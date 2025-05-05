import os
import asyncio
import edge_tts
import PyPDF2
import torch
import scipy.io.wavfile
import numpy as np
import warnings
from googletrans import Translator
from pydub import AudioSegment
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from openai import OpenAI
from langdetect import detect
import logging
import functools
import time
from io import BytesIO
from TTS.api import TTS
from transformers import AutoProcessor, BarkModel
from transformers.utils import logging as hf_logging

# Suppress unnecessary warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("podcast_generator")

# Initialize OpenAI client
client = OpenAI(api_key=" API Key Here")



# Base directory for output files
BASE_OUTPUT_DIR = r""

def get_output_directory():
    os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)
    return BASE_OUTPUT_DIR

def get_final_audio_file(output_dir):
    return os.path.join(output_dir, "final45_podcast.wav")

# --- Hindi TTS Implementation (Bark) is disabled ---
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = AutoProcessor.from_pretrained("suno/bark")
model = BarkModel.from_pretrained("suno/bark").to(device)

# Ensure the tokenizer has a pad token. If not, set it to the eos_token.
if processor.tokenizer.pad_token is None:
    processor.tokenizer.pad_token = processor.tokenizer.eos_token

# Explicitly set the model configuration pad_token_id
model.config.pad_token_id = processor.tokenizer.pad_token_id

if torch.cuda.is_available():
    model = model.half()
    try:
        model = torch.compile(model)
    except Exception as e:
        logger.warning("torch.compile() not available, skipping optimization.")

# Updated voices dictionary with additional languages for Bark TTS (Arabic removed)
VOICES = {
    "hi": ["v2/hi_speaker_0", "v2/hi_speaker_1", "v2/hi_speaker_2", "v2/hi_speaker_5"],
    "mr": ["mr-IN-AarohiNeural", "mr-IN-ManoharNeural"],
    "gu": ["gu-IN-DhwaniNeural", "gu-IN-NiranjanNeural"],
    "en": ["p374", "p228", "p231", "p232", "p250", "p243", "p255", "p303", "p298", "p285", "p360", "p335", "p341", "p326"],
    "es": ["v2/es_speaker_0", "v2/es_speaker_8", "v2/es_speaker_3", "v2/es_speaker_9"],
    "fr": ["v2/fr_speaker_4", "v2/fr_speaker_5", "v2/fr_speaker_3", "v2/fr_speaker_2"],
    "de": ["v2/de_speaker_0", "v2/de_speaker_3", "v2/de_speaker_2", "v2/de_speaker_8"],
    "it": ["v2/it_speaker_0", "v2/it_speaker_2", "v2/it_speaker_3", "v2/it_speaker_7"],
    "ja": ["v2/ja_speaker_2", "v2/ja_speaker_4", "v2/ja_speaker_6", "v2/ja_speaker_8"],
    "zh": ["v2/zh_speaker_0", "v2/zh_speaker_4", "v2/zh_speaker_8", "v2/zh_speaker_9"],
    "ru": ["v2/ru_speaker_0", "v2/ru_speaker_5", "v2/ru_speaker_1", "v2/ru_speaker_9"], 
    "pt": ["v2/pt_speaker_0", "v2/pt_speaker_1", "v2/pt_speaker_2", "v2/pt_speaker_3"], # No Female voices are available
    "ko": ["v2/ko_speaker_0", "v2/ko_speaker_1", "v2/ko_speaker_2", "v2/ko_speaker_3"], # One Female voice is available
    "tr": ["v2/tr_speaker_0", "v2/tr_speaker_4", "v2/tr_speaker_8", "v2/tr_speaker_5"]
    }

DURATION_WORD_LIMITS = {30: 75, 60: 150, 120: 300, 180: 420}

PREDEFINED_SAMPLE_TEXTS = {
    "hi": "नमस्ते, मैं {speaker_name} हूँ। यह एक पूर्वनिर्धारित नमूना आवाज़ है।",
    "mr": "नमस्कार, मी {speaker_name} आहे. हा एक पूर्वनिर्धारित नमुना आवाज आहे।",
    "en": "Hello, I am {speaker_name}. This is a predefined sample voice.",
    "gu": "હેલો, હું {speaker_name} છું. આ એક પૂર્વવ્યાખ્યાયિત નમૂના અવાજ છે.",
    "es": "Hola, soy {speaker_name}. Esta es una voz de muestra predefinida.",
    "fr": "Bonjour, je suis {speaker_name}. C'est une voix d'exemple prédéfinie.",
    "de": "Hallo, ich bin {speaker_name}. Dies ist eine vordefinierte Beispielstimme.",
    "it": "Ciao, sono {speaker_name}. Questa è una voce di esempio predefinita.",
    "ja": "こんにちは、私は{speaker_name}です。これは定義済みのサンプル音声です。",
    "zh": "你好，我是{speaker_name}。这是一段预定义的示例语音。",
    "ru": "Здравствуйте, я {speaker_name}. Это предопределённый образец голоса.",
    "pt": "Olá, eu sou {speaker_name}. Esta é uma voz de amostra pré-definida.",
    "ko": "안녕하세요, 저는 {speaker_name}입니다. 이것은 미리 정의된 샘플 음성입니다.",
    "tr": "Merhaba, ben {speaker_name}. Bu önceden tanımlanmış bir örnek sestir."
}
SPEAKER_NAME_MAP = {
    "v2/hi_speaker_1": "Sita",
    "v2/hi_speaker_0": "Priya",
    "v2/hi_speaker_2": "Amit",
    "v2/hi_speaker_5": "Rahul",
    "mr-IN-AarohiNeural": "Aarohi",
    "mr-IN-ManoharNeural": "Manohar",
     "p374": "Emma",
    "p228": "Daniel",
    "p231": "Michael",
    "p232": "John",
    "p250": "Sophia",
    "p243": "Olivia",
    "gu-IN-DhwaniNeural": "Dhwani",
    "gu-IN-NiranjanNeural": "Niranjan",
    "v2/es_speaker_0": "Carlos",
    "v2/es_speaker_8": "Sofia",
    "v2/es_speaker_3": "Diego",
    "v2/es_speaker_9": "Lucia",
    "v2/fr_speaker_4": "Pierre",
    "v2/fr_speaker_5": "Marie",
    "v2/fr_speaker_3": "Julien",
    "v2/fr_speaker_2": "Camille",
    "v2/de_speaker_0": "Hans",
    "v2/de_speaker_3": "Anna",
    "v2/de_speaker_2": "Fritz",
    "v2/de_speaker_8": "Greta",
    "v2/it_speaker_0": "Luca",
    "v2/it_speaker_2": "Giulia",
    "v2/it_speaker_3": "Marco",
    "v2/it_speaker_7": "Francesca",
    "v2/ja_speaker_2": "Hiroshi",
    "v2/ja_speaker_4": "Yuki",
    "v2/ja_speaker_6": "Takumi",
    "v2/ja_speaker_8": "Sakura",
    "v2/zh_speaker_0": "Wei",
    "v2/zh_speaker_4": "Mei",
    "v2/zh_speaker_8": "Li",
    "v2/zh_speaker_9": "Xia",
    "v2/ru_speaker_0": "Ivan",
    "v2/ru_speaker_5": "Anastasia",
    "v2/ru_speaker_1": "Dmitry",
    "v2/ru_speaker_9": "Ekaterina",
    "v2/pt_speaker_0": "João",
    "v2/pt_speaker_1": "Miguel",
    "v2/pt_speaker_2": "Carlos",
    "v2/pt_speaker_3": "Rafael",
    "v2/ko_speaker_0": "Min-Jun",
    "v2/ko_speaker_1": "Ji-Young",
    "v2/ko_speaker_2": "Seung-Hyun",
    "v2/ko_speaker_3": "Hye-Jin",
    "v2/tr_speaker_0": "Mehmet",
    "v2/tr_speaker_4": "Elif",
    "v2/tr_speaker_8": "Ahmet",
    "v2/tr_speaker_5": "Zeynep"
}

# Initialize VCTK TTS model
tts_vctk = None
try:
    tts_vctk = TTS(model_name="tts_models/en/vctk/vits", progress_bar=False, gpu=torch.cuda.is_available())
    logger.info("VCTK model initialized successfully")
except Exception as e:
    logger.error(f"Error initializing VCTK model: {e}")
    logger.error("Please ensure espeak or espeak-ng is installed and properly configured.")

def log_execution_time(func):
    if asyncio.iscoroutinefunction(func):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            result = await func(*args, **kwargs)
            elapsed_time = time.time() - start_time
            logger.info(f"{func.__name__} executed in {elapsed_time:.2f} seconds")
            return result
        return async_wrapper
    else:
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            result = func(*args, **kwargs)
            elapsed_time = time.time() - start_time
            logger.info(f"{func.__name__} executed in {elapsed_time:.2f} seconds")
            return result
        return sync_wrapper

# --- Hindi TTS using Bark is disabled ---
@log_execution_time
def synthesize_text_bark(text, voice_preset, output_dir):
    """Synthesize text using Bark model."""
    try:
        # Call processor without passing padding, then manually ensure attention_mask exists.
        inputs = processor(text, voice_preset=voice_preset, return_tensors="pt")
        if "attention_mask" not in inputs:
            inputs["attention_mask"] = torch.ones_like(inputs["input_ids"])
        inputs = {k: v.to(device) for k, v in inputs.items()}
        audio_array = model.generate(
            **inputs,
            pad_token_id=processor.tokenizer.pad_token_id  # Already set in model.config
        ).cpu().numpy().squeeze()
        temp_file = os.path.join(output_dir, f"temp_bark_{time.time()}.wav")
        scipy.io.wavfile.write(temp_file, rate=model.generation_config.sample_rate, data=(audio_array * 32767).astype("int16"))
        segment = AudioSegment.from_wav(temp_file)
        os.remove(temp_file)
        return segment
    except Exception as e:
        logger.error(f"Bark synthesis error: {e}")
        return None

@log_execution_time
async def synthesize_text_edge_tts(text, voice, output_dir):
    """Synthesize text using Edge TTS."""
    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_data = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])
        audio_segment = AudioSegment.from_file(BytesIO(bytes(audio_data)), format="mp3")
        temp_file = os.path.join(output_dir, f"temp_edge_tts_{time.time()}.wav")
        audio_segment.export(temp_file, format="wav")
        return AudioSegment.from_wav(temp_file)
    except Exception as e:
        logger.error(f"Edge TTS synthesis error: {e}")
        return None

@log_execution_time
def synthesize_vctk(text, speaker, output_dir):
    """Synthesize text using VCTK model."""
    if not tts_vctk:
        logger.error("VCTK model not initialized")
        return None
    try:
        temp_file = os.path.join(output_dir, f"temp_vctk_{time.time()}.wav")
        tts_vctk.tts_to_file(text=text, speaker=speaker, file_path=temp_file)
        segment = AudioSegment.from_wav(temp_file)
        os.remove(temp_file)
        logger.info(f"Successfully synthesized text using VCTK with speaker {speaker}")
        return segment
    except FileNotFoundError as e:
        logger.error(f"VCTK synthesis error: Model file not found: {e}")
        return None
    except Exception as e:
        logger.error(f"Error in VCTK synthesis: {e}")
        return None

@log_execution_time
async def synthesize_text_to_wav_segment(text, voice, language, output_dir):
    """Synthesize text using Edge TTS for non-English languages that are not using Bark."""
    try:
        logger.info(f"Using Edge TTS for {language} with voice {voice}")
        return await synthesize_text_edge_tts(text, voice, output_dir)
    except Exception as e:
        logger.error(f"TTS synthesis error for voice {voice}: {e}")
        return None

@log_execution_time
def detect_language(text):
    try:
        return detect(text)
    except Exception as e:
        logger.error(f"Language detection error: {e}")
        return "unknown"

@log_execution_time
def extract_text_from_pdf(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text.strip()
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return None

@log_execution_time
async def translate_text(text, target_lang):
    try:
        translator = Translator()
        translated = await translator.translate(text, dest=target_lang)
        return translated.text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text

@log_execution_time
def format_as_conversation(text, language, target_duration=None):
    try:
        system_prompt = (
            f"Convert the following {language} text into a podcast-style interactive conversation "
            "between two speakers. Format the conversation so that each turn starts on a new line using "
            "'Speaker 1:' and 'Speaker 2:' exactly (no extra spaces). "
        )
        if target_duration and target_duration in DURATION_WORD_LIMITS:
            system_prompt += (
                f"Explain the topic '{text}' in {language}. "
                f"The total word count should be approximately {DURATION_WORD_LIMITS[target_duration]} words. "
                "Ensure the topic is clearly explained within the given word limit."
            )
            logger.info(f"Setting word limit to {DURATION_WORD_LIMITS[target_duration]} words for {target_duration}s duration")
        else:
            logger.info("No duration specified; generating conversation without a word limit")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ]
        )
        conversation = response.choices[0].message.content
        return conversation
    except Exception as e:
        logger.error(f"Conversation formatting error: {e}")
        return None

@log_execution_time
async def process_segments(lines, voices, language, output_dir):
    audio_segments = []
    pause = AudioSegment.silent(duration=50)
    tasks = []
    # Languages that use Bark synthesis (Edge TTS is not used for these)
    bark_langs = {"hi", "es", "pt", "ko", "tr", "fr", "de", "it", "ja", "zh", "ru"}
    
    for i, line in enumerate(lines):
        if not line.strip():
            continue
        if "Speaker1:" in line or "Speaker 1:" in line:
            voice = voices[0]
        elif "Speaker2:" in line or "Speaker 2:" in line:
            voice = voices[1] if len(voices) > 1 else voices[0]
        else:
            voice = voices[i % len(voices)]
        speaker_text = line.split(":", 1)[1].strip() if ":" in line else line.strip()
        if language in bark_langs:
            tasks.append(asyncio.to_thread(synthesize_text_bark, speaker_text, voice, output_dir))
        elif language == "en":
            tasks.append(asyncio.to_thread(synthesize_vctk, speaker_text, voice, output_dir))
        else:
            tasks.append(synthesize_text_to_wav_segment(speaker_text, voice, language, output_dir))
    results = await asyncio.gather(*tasks)
    for segment in results:
        if segment:
            audio_segments.append(segment)
            audio_segments.append(pause)
    return audio_segments

@log_execution_time
def combine_audio_segments(segments, output_file):
    if not segments:
        return False
    combined_audio = sum(segments, AudioSegment.empty())
    combined_audio.export(output_file, format="wav")
    return True

@log_execution_time
def adjust_audio_duration(audio_segment, target_duration_ms):
    current_duration = len(audio_segment)
    if current_duration == 0:
        logger.error("Empty audio segment")
        return audio_segment
    speed_factor = current_duration / target_duration_ms
    speed_factor = min(max(speed_factor, 1.0), 2.0)
    logger.info(f"Adjusting audio speed by factor {speed_factor:.2f} to match {target_duration_ms/1000:.1f}s target")
    new_frame_rate = int(audio_segment.frame_rate * speed_factor)
    adjusted_audio = audio_segment._spawn(audio_segment.raw_data, overrides={
        "frame_rate": new_frame_rate
    }).set_frame_rate(audio_segment.frame_rate)
    logger.info(f"Original duration: {current_duration/1000:.2f}s, Adjusted duration: {len(adjusted_audio)/1000:.2f}s")
    return adjusted_audio

@app.route("/generate", methods=["POST"])
def generate_podcast():
    logger.info("Received request for podcast generation")
    text = request.form.get("text")
    language = request.form.get("language")
    file = request.files.get("file")
    speaker1 = request.form.get("speaker1")
    speaker2 = request.form.get("speaker2")
    target_duration = None
    duration_str = request.form.get("duration1")
    if duration_str:
        try:
            target_duration = int(duration_str)
            logger.info(f"Target duration: {target_duration} seconds")
        except ValueError:
            logger.warning("Invalid duration value provided; proceeding without duration constraint")
    if not text and not file:
        return jsonify({"error": "No text or file provided"}), 400
    if file:
        text = extract_text_from_pdf(file)
        if not text:
            return jsonify({"error": "Could not extract text from PDF"}), 400
    detected_lang = detect_language(text)
    if detected_lang != language:
        text = asyncio.run(translate_text(text, language))
    conversation = format_as_conversation(text, language, target_duration)
    if not conversation:
        return jsonify({"error": "Failed to format conversation"}), 500
    lines = conversation.split("\n")
    output_dir = get_output_directory()
    final_audio_file = get_final_audio_file(output_dir)
    if (language == "en" or language == "hi") and speaker1 and speaker2:
        voices_for_language = [speaker1, speaker2]
    elif language in {"mr", "es", "gu"}:
        voices_for_language = [speaker1, speaker2]
    else:
        voices_for_language = VOICES.get(language, VOICES["en"][:2])
    segments = asyncio.run(process_segments(lines, voices_for_language, language, output_dir))
    if not segments:
        return jsonify({"error": "Failed to generate audio segments"}), 500
    combined_audio = sum(segments, AudioSegment.empty())
    current_duration_ms = len(combined_audio)
    current_duration_sec = current_duration_ms / 1000
    logger.info(f"Generated audio duration: {current_duration_sec:.2f}s")
    if target_duration is not None:
        target_duration_ms = target_duration * 1000
        if current_duration_ms > target_duration_ms:
            logger.info(f"Audio exceeds target duration ({current_duration_sec:.2f}s > {target_duration}s). Adjusting speed...")
            combined_audio = adjust_audio_duration(combined_audio, target_duration_ms)
            final_duration_sec = len(combined_audio) / 1000
            logger.info(f"Final audio duration after adjustment: {final_duration_sec:.2f}s")
        else:
            logger.info(f"Audio duration ({current_duration_sec:.2f}s) is within target ({target_duration}s). No adjustment needed.")
    combined_audio.export(final_audio_file, format="wav")
    logger.info(f"Audio generated successfully. File: {final_audio_file}")
    return send_file(final_audio_file, as_attachment=True)

@app.route("/sample_voice", methods=["GET"])
def get_sample_voice():
    """
    Endpoint to return a short WAV file demonstrating the chosen voice.
    Query Params:
      - language: The language code (e.g., 'hi', 'en', 'mr', 'gu', 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ru', 'pt', 'ko', 'tr')
      - voice: The speaker preset to use
    """
    language = request.args.get("language")
    voice = request.args.get("voice")
    if not language or not voice:
        return jsonify({"error": "Language and voice are required"}), 400
    output_dir = get_output_directory()
    speaker_name = SPEAKER_NAME_MAP.get(voice, voice)
    if language in PREDEFINED_SAMPLE_TEXTS:
        sample_text = PREDEFINED_SAMPLE_TEXTS[language].format(speaker_name=speaker_name)
    else:
        return jsonify({"error": f"Unsupported language: {language}"}), 400
    try:
        bark_languages = {"hi", "es", "pt", "ko", "tr", "fr", "de", "it", "ja", "zh", "ru"}
        if language in bark_languages:
            logger.info(f"Using Bark TTS for {language} with voice {voice}")
            audio_segment = synthesize_text_bark(sample_text, voice, output_dir)
        elif language == "en":
            logger.info(f"Using VCTK for English with speaker {voice}")
            audio_segment = synthesize_vctk(sample_text, voice, output_dir)
        else:
            logger.info(f"Using Edge TTS for {language} with voice {voice}")
            audio_segment = asyncio.run(synthesize_text_to_wav_segment(sample_text, voice, language, output_dir))
        if not audio_segment:
            logger.error(f"Failed to generate audio for {language} with voice {voice}")
            return jsonify({"error": "Failed to generate sample voice"}), 500
        sample_file = os.path.join(output_dir, f"sample_voice_{language}_{voice.replace('/', '_')}.wav")
        audio_segment.export(sample_file, format="wav")
        logger.info(f"Successfully generated sample voice at {sample_file}")
        return send_file(sample_file, as_attachment=True)
    except Exception as e:
        logger.error(f"Error generating sample voice: {e}")
        return jsonify({"error": f"Error generating sample voice: {str(e)}"}), 500

if __name__ == "__main__":
    from asgiref.wsgi import WsgiToAsgi
    from hypercorn.asyncio import serve
    from hypercorn.config import Config
    asgi_app = WsgiToAsgi(app)
    config = Config()
    config.bind = ["0.0.0.0:5000"]
    asyncio.run(serve(asgi_app, config))
