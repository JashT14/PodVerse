
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import tempfile
from gradio_client import Client, handle_file
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'voice_cloning_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define the path to your actor_voices folder
ACTOR_VOICES_FOLDER = r'C:\mypodcast\api\Voicecloning\actor_voices'  # Update this path to the actual location

@app.route('/api/generate_audio', methods=['POST'])
def generate_audio():
    try:
        # Get text from request
        text = request.form.get('text')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Check if we're using a predefined voice or an uploaded file
        if 'predefined_voice' in request.form:
            # Get the predefined voice filename
            voice_filename = request.form.get('predefined_voice')
            voice_filepath = os.path.join(ACTOR_VOICES_FOLDER, voice_filename)
            
            # Check if the file exists
            if not os.path.exists(voice_filepath):
                return jsonify({'error': f'Voice file not found: {voice_filename}'}), 404
                
            # Use the predefined voice file
            speaker_audio_path = voice_filepath
        
        elif 'speaker_audio' in request.files:
            # Handle uploaded file
            file = request.files['speaker_audio']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
                
            # Save uploaded file temporarily
            speaker_audio_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}_{secure_filename(file.filename)}")
            file.save(speaker_audio_path)
        
        else:
            return jsonify({'error': 'No voice source provided'}), 400
        
        # Connect to the Zonos server
        client = Client("http://127.0.0.1:7860/")
        
        # Generate audio with voice cloning
        result = client.predict(
            model_choice="Zyphra/Zonos-v0.1-transformer",
            text=text,
            speaker_audio=handle_file(speaker_audio_path),
            prefix_audio=None,
            # Default emotion parameters
            e1=1,      # Happiness
            e2=0.05,   # Sadness
            e3=0.05,   # Disgust
            e4=0.05,   # Fear 
            e5=0.05,   # Surprise
            e6=0.05,   # Anger
            e7=0.1,    # Other
            e8=0.2,    # Neutral
            # Default voice characteristic parameters
            vq_single=0.78,
            fmax=24000,
            pitch_std=45,
            speaking_rate=15,
            dnsmos_ovrl=4,
            speaker_noised=False,
            # Default generation parameters
            cfg_scale=2,
            seed=420,
            randomize_seed=True,
            # Which attributes to make unconditional
            unconditional_keys=["emotion"],
            api_name="/generate_audio"
        )
        
        # The result contains the file path to the generated audio
        generated_audio_path = result[0]
        
        # Clean up the temporary file if it was an uploaded file
        if 'speaker_audio' in request.files:
            os.remove(speaker_audio_path)
        
        # Return the audio file directly
        return send_file(generated_audio_path, mimetype="audio/wav", as_attachment=True,
                        download_name="generated_voice.wav")
        
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Optional: Add an endpoint to list all available predefined voices
@app.route('/api/predefined_voices', methods=['GET'])
def get_predefined_voices():
    try:
        voices = []
        for filename in os.listdir(ACTOR_VOICES_FOLDER):
            if filename.endswith('.wav'):
                name = os.path.splitext(filename)[0]
                voices.append({
                    'id': name.lower(),
                    'name': name.replace('_', ' ').title(),
                    'filename': filename
                })
        return jsonify({'voices': voices})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)






