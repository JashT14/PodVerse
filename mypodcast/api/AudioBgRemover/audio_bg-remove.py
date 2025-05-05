
import os
import asyncio
import tempfile
from pathlib import Path
from io import BytesIO
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from df.enhance import enhance, init_df, load_audio, save_audio
from scipy.signal import butter, filtfilt
import numpy as np
import torch
from pydub import AudioSegment
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# -------------------------------
# Helper Functions
# -------------------------------

def get_supported_formats():
    return ['wav', 'mp3', 'ogg', 'flac', 'm4a', 'wma', 'aac']

def robust_convert_to_wav(input_file):
    """
    Convert any audio file to WAV using ffmpeg via pydub, regardless of extension.
    Always decodes using ffmpeg for maximum compatibility.
    """
    try:
        audio = AudioSegment.from_file(input_file)  # Will use ffmpeg backend
        temp_wav = input_file.rsplit('.', 1)[0] + '_temp.wav'
        audio.export(temp_wav, format='wav', codec='pcm_s16le')
        return temp_wav
    except Exception as e:
        raise RuntimeError(
            f"Conversion to WAV failed: {str(e)}\n"
            "1. Ensure FFmpeg is installed and in PATH\n"
            "2. Verify input file is a valid audio format\n"
            "3. Check file permissions"
        )

def convert_from_wav(input_wav, output_file, output_format):
    try:
        if output_format.lower() == 'wav':
            os.replace(input_wav, output_file)
            return output_file
        audio = AudioSegment.from_wav(input_wav)
        audio.export(output_file, format=output_format.lower())
        if '_temp.wav' in input_wav:
            os.remove(input_wav)
        return output_file
    except Exception as e:
        raise Exception(f"Error converting from WAV: {str(e)}")

def design_voice_filters(fs):
    b1, a1 = butter(4, [150/(fs/2), 3400/(fs/2)], btype='band')
    b2, a2 = butter(2, 2000/(fs/2), btype='high')
    b3, a3 = butter(2, 200/(fs/2), btype='low')
    return (b1, a1), (b2, a2), (b3, a3)

def apply_voice_enhancement(data, fs):
    voice_filter, clarity_filter, warmth_filter = design_voice_filters(fs)
    def process_channel(channel):
        output = filtfilt(*voice_filter, channel)
        output = filtfilt(*clarity_filter, output)
        output = filtfilt(*warmth_filter, output)
        output = output / np.max(np.abs(output))
        return output
    if data.ndim == 1:
        return process_channel(data)
    else:
        return np.vstack([process_channel(ch) for ch in data])

def enhanced_noise_reduction(input_file, output_file, voice_enhance=True, output_format='wav', enhancement_strength=1.0):
    try:
        temp_wav_input = robust_convert_to_wav(input_file)
        temp_wav_output = output_file.rsplit('.', 1)[0] + '_temp.wav'
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model, df_state, _ = init_df()
        model = model.to(device).eval()
        audio, _ = load_audio(temp_wav_input, sr=df_state.sr())
        audio = np.ascontiguousarray(audio)
        with torch.no_grad():
            audio_tensor = torch.from_numpy(audio).float().to(device)
            enhanced = enhance(model, df_state, audio_tensor)
            if voice_enhance:
                enhanced_np = enhanced.cpu().numpy()
                enhanced_np = apply_voice_enhancement(enhanced_np, df_state.sr())
                enhanced_np = enhanced_np * enhancement_strength
            else:
                enhanced_np = enhanced.cpu().numpy()
            if enhanced_np.ndim == 1 and audio.ndim > 1:
                enhanced_np = np.vstack([enhanced_np, enhanced_np])
            enhanced_np = enhanced_np / np.max(np.abs(enhanced_np))
            save_audio(temp_wav_output, enhanced_np, df_state.sr())
            del audio_tensor, enhanced
            if device.type == 'cuda':
                torch.cuda.empty_cache()
        final_output = convert_from_wav(temp_wav_output, output_file, output_format)
        if temp_wav_input != input_file:
            os.remove(temp_wav_input)
        app.logger.info(f"Successfully processed and saved as {output_format.upper()}: {final_output}")
        return True
    except Exception as e:
        app.logger.error(f"Processing error: {str(e)}")
        return False

# -------------------------------
# Async Wrapper for Blocking Code
# -------------------------------
async def enhanced_noise_reduction_async(input_file, output_file, voice_enhance=True, output_format='wav', enhancement_strength=1.0):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(
        None,
        enhanced_noise_reduction,
        input_file,
        output_file,
        voice_enhance,
        output_format,
        enhancement_strength
    )
    return result

# -------------------------------
# Flask Async Route
# -------------------------------
@app.route('/bg-remover', methods=['POST'])
async def bg_remover():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Secure filename and check extension
        filename = secure_filename(file.filename)
        suffix = Path(filename).suffix.lower().lstrip('.')
        if suffix not in get_supported_formats():
            return jsonify({"error": f"Unsupported file extension: .{suffix}"}), 400

        # File size check (max 50MB)
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)
        MAX_SIZE = 50 * 1024 * 1024
        if file_length > MAX_SIZE:
            return jsonify({"error": "File exceeds 50MB limit"}), 400

        # Save the uploaded file to a temporary location.
        with tempfile.NamedTemporaryFile(delete=False, suffix='.' + suffix) as temp_in:
            input_filepath = temp_in.name
            file.save(input_filepath)

        # Determine output format (default to WAV).
        output_format = request.form.get('output_format', 'wav').lower()
        if output_format not in get_supported_formats():
            os.remove(input_filepath)
            return jsonify({"error": f"Unsupported output format: {output_format}"}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix='.' + output_format) as temp_out:
            output_filepath = temp_out.name

        # Process the audio file asynchronously.
        success = await enhanced_noise_reduction_async(
            input_filepath,
            output_filepath,
            voice_enhance=True,
            output_format=output_format,
            enhancement_strength=1.0
        )

        # Clean up the temporary input file.
        os.remove(input_filepath)

        if not success:
            os.remove(output_filepath)
            return jsonify({"error": "Audio processing failed."}), 500

        # Read the processed file into memory using BytesIO.
        with open(output_filepath, 'rb') as f:
            file_bytes = f.read()
        os.remove(output_filepath)

        # Map output format to the proper MIME type.
        content_types = {
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg',
            'ogg': 'audio/ogg',
            'flac': 'audio/flac',
            'm4a': 'audio/mp4',
            'wma': 'audio/x-ms-wma',
            'aac': 'audio/aac',
            'webm': 'audio/webm',
            'amr': 'audio/amr'
        }
        content_type = content_types.get(output_format, 'application/octet-stream')

        # Return the processed audio file with the proper content type.
        return send_file(
            BytesIO(file_bytes),
            as_attachment=True,
            download_name=os.path.basename(output_filepath),
            mimetype=content_type
        )
    except Exception as e:
        app.logger.error(f"Critical failure: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
