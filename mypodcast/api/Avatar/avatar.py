
import logging
import os
import time
import requests
import asyncio
import cv2
import numpy as np
import subprocess
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from deepface import DeepFace
import tempfile

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed_videos"  # New folder for processed videos
API_URL_IMAGES = "https://api.d-id.com/images"
API_URL_AUDIOS = "https://api.d-id.com/audios"
API_URL_TALKS = "https://api.d-id.com/talks"
API_KEY = " Replace with your actual API key "

# Ensure upload directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

def detect_gender(image_path):
    """Detect gender from image using DeepFace"""
    try:
        result = DeepFace.analyze(image_path, actions=["gender"])
        # Check if Man probability is higher
        if result[0]["gender"]["Man"] > result[0]["gender"]["Woman"]:
            return "male"
        else:
            return "female"
    except Exception as e:
        print(f"Gender detection error: {str(e)}")
        # Default to male if detection fails
        return "male"

async def upload_image_to_did(image_path):
    logger.debug("Uploading image to D-ID: %s", image_path)
    try:
        with open(image_path, 'rb') as image_file:
            files = {"image": (image_path, image_file, "image/jpeg")}
            headers = {"Authorization": f"Basic {API_KEY}"}
            
            # Use a function to run the blocking request in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(API_URL_IMAGES, headers=headers, files=files)
            )
            
            logger.debug("Image upload response status: %s, response: %s", response.status_code, response.text)
    except Exception as e:
        logger.error("Exception during image upload: %s", e)
        return None

    if response.status_code == 201:
        image_url = response.json().get("url")
        logger.debug("Image uploaded successfully, URL: %s", image_url)
        return image_url
    else:
        logger.error("Failed to upload image, status code: %s", response.status_code)
        return None

async def upload_audio_to_did(audio_path):
    logger.debug("Uploading audio to D-ID: %s", audio_path)
    try:
        with open(audio_path, 'rb') as audio_file:
            files = {"audio": (audio_path, audio_file, "audio/wav")}
            headers = {"Authorization": f"Basic {API_KEY}"}
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(API_URL_AUDIOS, headers=headers, files=files)
            )
            
            logger.debug("Audio upload response status: %s, response: %s", response.status_code, response.text)
    except Exception as e:
        logger.error("Exception during audio upload: %s", e)
        return None

    if response.status_code == 201:
        audio_url = response.json().get("url")
        logger.debug("Audio uploaded successfully, URL: %s", audio_url)
        return audio_url
    else:
        logger.error("Failed to upload audio, status code: %s", response.status_code)
        return None

async def create_talk_with_text(image_url, script_text, gender):
    logger.debug("Creating talk with text. Image URL: %s, Script: %s", image_url, script_text)
    voice_id = "en-US-GuyNeural" if gender == "male" else "en-US-JennyNeural"
    
    payload = {
        "source_url": image_url,
        "script": {
            "type": "text",
            "input": script_text,
            "provider": {
                "type": "microsoft",
                "voice_id": voice_id,
            }
        }
    }
    headers = {
        "Authorization": f"Basic {API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: requests.post(API_URL_TALKS, json=payload, headers=headers)
        )
        logger.debug("Create talk with text response status: %s, response: %s", response.status_code, response.text)
    except Exception as e:
        logger.error("Exception during talk creation with text: %s", e)
        return None

    if response.status_code == 201:
        talk_id = response.json().get("id")
        logger.debug("Talk created successfully with text, ID: %s", talk_id)
        return talk_id
    else:
        logger.error("Failed to create talk with text, status code: %s", response.status_code)
        return None

async def create_talk_with_audio(image_url, audio_url):
    logger.debug("Creating talk with audio. Image URL: %s, Audio URL: %s", image_url, audio_url)
    payload = {
        "source_url": image_url,
        "script": {
            "type": "audio",
            "audio_url": audio_url
        }
    }
    headers = {
        "Authorization": f"Basic {API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: requests.post(API_URL_TALKS, json=payload, headers=headers)
        )
        logger.debug("Create talk with audio response status: %s, response: %s", response.status_code, response.text)
    except Exception as e:
        logger.error("Exception during talk creation with audio: %s", e)
        return None

    if response.status_code == 201:
        talk_id = response.json().get("id")
        logger.debug("Talk created successfully with audio, ID: %s", talk_id)
        return talk_id
    else:
        logger.error("Failed to create talk with audio, status code: %s", response.status_code)
        return None

async def get_talk_status(talk_id):
    logger.debug("Polling talk status for talk_id: %s", talk_id)
    url = f"{API_URL_TALKS}/{talk_id}"
    headers = {"Authorization": f"Basic {API_KEY}"}
    
    while True:
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.get(url, headers=headers)
            )
            logger.debug("Talk status response for talk_id %s: %s, response: %s", talk_id, response.status_code, response.text)
        except Exception as e:
            logger.error("Exception during polling talk status: %s", e)
            return None

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "done":
                result_url = data.get("result_url")
                logger.debug("Talk processing done. Result URL: %s", result_url)
                return result_url
            else:
                logger.debug("Talk status not done. Current status: %s", data.get("status"))
                await asyncio.sleep(5)  # Poll every 5 seconds (reduced from 10)
        else:
            logger.error("Failed to poll talk status, status code: %s", response.status_code)
            return None

async def download_video(video_url, output_path):
    """Download video from URL"""
    logger.debug(f"Downloading video from {video_url} to {output_path}")
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: requests.get(video_url, stream=True)
        )
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.debug(f"Video downloaded successfully to {output_path}")
            return True
        else:
            logger.error(f"Failed to download video. Status code: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"Exception during video download: {str(e)}")
        return False

async def remove_watermark_with_audio(input_video, output_video):
    """Remove watermark from video while preserving audio"""
    logger.debug(f"Removing watermark from {input_video}")
    
    # Temporary files with unique names to avoid conflicts
    temp_dir = tempfile.mkdtemp()
    temp_video = os.path.join(temp_dir, "temp_video_no_audio.mp4")
    temp_audio = os.path.join(temp_dir, "temp_audio.aac")
    frame_dir = os.path.join(temp_dir, "frames")
    os.makedirs(frame_dir, exist_ok=True)
    
    # Define watermark removal parameters
    threshold_value = 220
    blur_size = 5
    inpaint_radius = 3
    iterations = 2
    
    try:
        # Step 1: Extract audio using FFmpeg
        extract_audio_cmd = [
            'ffmpeg', '-y', '-i', input_video, '-vn', '-acodec', 'copy', temp_audio
        ]
        
        extract_proc = await asyncio.create_subprocess_exec(
            *extract_audio_cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await extract_proc.communicate()
        
        if extract_proc.returncode != 0:
            logger.error("Error extracting audio")
            return False
        
        # Step 2: Process video frames (watermark removal)
        cap = cv2.VideoCapture(input_video)
        if not cap.isOpened():
            logger.error("Error: Could not open video.")
            return False
            
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # Run the CPU-intensive video processing in a thread pool
        def process_video():
            frame_count = 0
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Watermark removal logic
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                            cv2.THRESH_BINARY_INV, 11, 2)
                kernel = np.ones((3,3), np.uint8)
                cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
                contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                mask = np.zeros_like(gray)
                
                for cnt in contours:
                    area = cv2.contourArea(cnt)
                    x,y,w,h = cv2.boundingRect(cnt)
                    aspect_ratio = float(w)/h
                    if area > 100 and area < 5000 and 0.5 < aspect_ratio < 2.0:
                        cv2.drawContours(mask, [cnt], -1, 255, -1)
                
                mask = cv2.GaussianBlur(mask, (blur_size, blur_size), 0)
                _, mask = cv2.threshold(mask, 128, 255, cv2.THRESH_BINARY)
                
                result = frame.copy()
                for _ in range(iterations):
                    result = cv2.inpaint(result, mask, inpaint_radius, cv2.INPAINT_NS)
                
                # Save frame as PNG
                frame_path = os.path.join(frame_dir, f"frame_{frame_count:04d}.png")
                cv2.imwrite(frame_path, result)
                frame_count += 1
                
            logger.debug(f"Processed {frame_count} frames")
            cap.release()
            return True
        
        # Process video in a thread pool
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, process_video)
        
        # Step 3: Create video from processed frames using FFmpeg (better codec handling)
        frames_to_video_cmd = [
            'ffmpeg', '-y',
            '-framerate', str(fps),
            '-i', os.path.join(frame_dir, 'frame_%04d.png'),
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',  # Important for compatibility
            '-crf', '23',  # Quality setting (lower is better)
            temp_video
        ]
        
        frames_proc = await asyncio.create_subprocess_exec(
            *frames_to_video_cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await frames_proc.communicate()
        
        if frames_proc.returncode != 0:
            logger.error(f"Error creating video from frames: {stderr.decode()}")
            return False
            
        # Step 4: Merge processed video with original audio
        merge_cmd = [
            'ffmpeg', '-y',
            '-i', temp_video,
            '-i', temp_audio,
            '-c:v', 'copy',          # Copy video stream without re-encoding
            '-c:a', 'aac',           # Re-encode audio as AAC for better compatibility
            '-map', '0:v:0',         # Use video from first input
            '-map', '1:a:0',         # Use audio from second input
            '-shortest',             # End when the shortest input stream ends
            '-movflags', '+faststart', # Optimize for web playback
            output_video
        ]
        
        merge_proc = await asyncio.create_subprocess_exec(
            *merge_cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await merge_proc.communicate()
        
        if merge_proc.returncode != 0:
            logger.error(f"Error merging video and audio: {stderr.decode()}")
            return False
            
        logger.debug(f"✅ Success! Watermark removed with audio preserved: {output_video}")
        return True
        
    except Exception as e:
        logger.error(f"Error in watermark removal: {str(e)}")
        return False
    finally:
        # Cleanup temporary files with proper error handling and file closure
        try:
            # Close video capture explicitly to release the file
            if 'cap' in locals() and cap.isOpened():
                cap.release()
                
            # Add a small delay to ensure file handles are fully released
            await asyncio.sleep(1)
                
            # Remove temp files if they exist
            if os.path.exists(temp_video):
                os.remove(temp_video)
            if os.path.exists(temp_audio):
                os.remove(temp_audio)
            if os.path.exists(frame_dir):
                import shutil
                shutil.rmtree(frame_dir)
            os.rmdir(temp_dir)
        except Exception as e:
            logger.error(f"Error cleaning up temp files: {str(e)}")

# New route to serve processed videos
@app.route('/videos/<filename>')
def serve_video(filename):
    """Serve processed video files"""
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
async def upload():
    logger.debug("Received /upload request")
    if 'image' not in request.files:
        logger.error("No image file provided in request")
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    script_text = request.form.get("script", "")
    audio_file = request.files.get("audio")
    
    if file.filename == '':
        logger.error("No selected file for image")
        return jsonify({"error": "No selected file"}), 400
    
    # Save image file
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    gender = detect_gender(filepath)
    
    # Upload image to D-ID
    image_url = await upload_image_to_did(filepath)
    if not image_url:
        logger.error("Failed to upload image to D-ID")
        return jsonify({"error": "Failed to upload image"}), 500
    
    talk_id = None
    
    # Handle audio if provided
    if audio_file and audio_file.filename != '':
        logger.debug("Audio file provided: %s", audio_file.filename)
        # Save audio file
        audio_filename = secure_filename(audio_file.filename)
        audio_filepath = os.path.join(app.config['UPLOAD_FOLDER'], audio_filename)
        try:
            audio_file.save(audio_filepath)
            logger.debug("Audio file saved: %s", audio_filepath)
        except Exception as e:
            logger.error("Error saving audio file: %s", e)
            return jsonify({"error": "Failed to save audio file"}), 500
        
        # Upload audio to D-ID
        audio_url = await upload_audio_to_did(audio_filepath)
        if not audio_url:
            logger.error("Failed to upload audio to D-ID")
            return jsonify({"error": "Failed to upload audio"}), 500
        
        # Create talk with audio
        talk_id = await create_talk_with_audio(image_url, audio_url)
    else:
        logger.debug("No audio file provided; using script text")
        # Create talk with text
        if not script_text:
            logger.error("No script provided when audio is absent")
            return jsonify({"error": "No script or audio provided"}), 400
        talk_id = await create_talk_with_text(image_url, script_text, gender)
    
    if not talk_id:
        logger.error("Failed to create talk")
        return jsonify({"error": "Failed to create talk"}), 500
    
    result_url = await get_talk_status(talk_id)
    if not result_url:
        logger.error("Failed to retrieve talk result")
        return jsonify({"error": "Failed to retrieve talk result"}), 500
    
    logger.debug("Retrieved video URL: %s", result_url)
    
    # New step: Download, process to remove watermark, and provide processed video URL
    temp_dir = tempfile.mkdtemp()
    input_video_path = os.path.join(temp_dir, "input_video.mp4")
    
    # Generate a unique filename for the processed video
    processed_filename = f"processed_{int(time.time())}.mp4"
    output_video_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
    
    try:
        # Download the video from D-ID
        download_success = await download_video(result_url, input_video_path)
        if not download_success:
            logger.error("Failed to download video from D-ID")
            return jsonify({"videoUrl": result_url})  # Fallback to original URL with correct key name
        
        # Process the video to remove watermark
        process_success = await remove_watermark_with_audio(input_video_path, output_video_path)
        if not process_success:
            logger.error("Failed to process video (remove watermark)")
            return jsonify({"videoUrl": result_url})  # Fallback to original URL with correct key name
        
        # Generate proper URL for the processed video that can be served by Flask
        host = request.host_url.rstrip('/')  # Remove trailing slash if present
        processed_video_url = f"{host}/videos/{processed_filename}"
        logger.debug(f"Processed video available at: {processed_video_url}")
        
        # Return videoUrl to match what frontend expects
        return jsonify({
            "videoUrl": processed_video_url,  # Changed key from "video_url" to "videoUrl" to match frontend
            "original_url": result_url,
            "success": True
        })
        
    except Exception as e:
        logger.error(f"Error in video processing pipeline: {str(e)}")
        return jsonify({"videoUrl": result_url, "success": False})  # Changed key to match frontend
    finally:
        # Clean up temporary files
        try:
            if os.path.exists(input_video_path):
                os.remove(input_video_path)
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir)
        except Exception as e:
            logger.error(f"Error cleaning up temporary files: {str(e)}")

# Make Flask work properly with asyncio
@app.route('/upload', methods=['POST'])
def upload_sync():
    """Synchronous wrapper for async upload function"""
    # Create a new event loop for this request
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(upload())
    finally:
        loop.close()

if __name__ == '__main__':
    logger.debug("Starting Flask app on port 5002")
    app.run(debug=True, port=5002)