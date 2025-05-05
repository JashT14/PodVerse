// // import  { useState } from 'react';
// // import './AudioBgRemover.css';

// // const AudioBgRemover = () => {
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [downloadUrl, setDownloadUrl] = useState('');
// //   const [error, setError] = useState('');
// //   const [dragActive, setDragActive] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(0);

// //   // Handle file selection from input or drag/drop.
// //   const handleFileChange = (e) => {
// //     const newFile = e.target.files[0];
// //     if (newFile && newFile.type.startsWith('audio/')) {
// //       setFile(newFile);
// //       setError('');
// //     } else {
// //       setError('Only audio files are allowed.');
// //       setFile(null);
// //     }
// //   };

// //   const handleDragOver = (e) => {
// //     e.preventDefault();
// //     setDragActive(true);
// //   };

// //   const handleDragLeave = (e) => {
// //     e.preventDefault();
// //     setDragActive(false);
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     setDragActive(false);
// //     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
// //       const droppedFile = e.dataTransfer.files[0];
// //       if (droppedFile.type.startsWith('audio/')) {
// //         setFile(droppedFile);
// //         setError('');
// //       } else {
// //         setError('Only audio files are allowed.');
// //         setFile(null);
// //       }
// //     }
// //   };

// //   // Upload the file using axios and track progress.
// //   const handleUpload = async () => {
// //     if (!file) {
// //       setError('Please select an audio file.');
// //       return;
// //     }
// //     setLoading(true);
// //     setError('');
// //     setDownloadUrl('');
// //     setUploadProgress(0);
// //     const formData = new FormData();
// //     formData.append('file', file);

// //     try {
// //       const response = await fetch('http://localhost:5001/bg-remover', {
// //         method: 'POST',
// //         body: formData,
// //       });

// //       if (!response.ok) {
// //         throw new Error('Server error occurred');
// //       }

// //       const blob = await response.blob();
// //       const url = window.URL.createObjectURL(blob);
// //       setDownloadUrl(url);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="podverse-cleaner-container">
// //       <div className="podverse-cleaner-header">
// //         <h1 className="podverse-cleaner-title">Podverse Audio Cleaner</h1>
// //         <p className="podverse-cleaner-subtitle">
// //           Clean background noise from your podcast recordings
// //         </p>
// //       </div>

// //       <div 
// //         className={`podverse-cleaner-dropzone ${dragActive ? 'podverse-dropzone-active' : ''}`}
// //         onDragOver={handleDragOver}
// //         onDragLeave={handleDragLeave}
// //         onDrop={handleDrop}
// //       >
// //         <div className="podverse-cleaner-icon">
// //           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //             <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             <path d="M2 17L2.621 19.485C2.72915 19.9177 2.97882 20.3018 3.33033 20.5763C3.68184 20.8508 4.11501 20.9999 4.561 21H19.439C19.885 20.9999 20.3182 20.8508 20.6697 20.5763C21.0212 20.3018 21.2708 19.9177 21.379 19.485L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //           </svg>
// //         </div>
// //         <input
// //           type="file"
// //           accept="audio/*"
// //           onChange={handleFileChange}
// //           className="podverse-cleaner-input"
// //           id="audio-file-input"
// //         />
// //         <label htmlFor="audio-file-input" className="podverse-cleaner-label">
// //           {file ? `Selected: ${file.name}` : 'Drag & drop an audio file here, or click to select'}
// //         </label>
// //       </div>

// //       {/* Progress Bar */}
// //       {uploadProgress > 0 && loading && (
// //         <div className="podverse-cleaner-progress-container">
// //           <div className="podverse-cleaner-progress-bar">
// //             <div 
// //               className="podverse-cleaner-progress-fill"
// //               style={{ width: `${uploadProgress}%` }}
// //             ></div>
// //           </div>
// //           <span className="podverse-cleaner-progress-text">{uploadProgress}%</span>
// //         </div>
// //       )}

// //       {/* Upload Button */}
// //       <button
// //         onClick={handleUpload}
// //         className="podverse-cleaner-button"
// //         disabled={loading || !file}
// //       >
// //         {loading ? 'Processing...' : 'Clean Audio'}
// //       </button>

// //       {/* Loading Spinner */}
// //       {loading && (
// //         <div className="podverse-cleaner-spinner-container">
// //           <div className="podverse-cleaner-spinner"></div>
// //           <p className="podverse-cleaner-spinner-text">
// //             Removing background noise...
// //           </p>
// //         </div>
// //       )}

// //       {/* Error Message */}
// //       {error && (
// //         <div className="podverse-cleaner-error">
// //           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //             <path d="M12 9V13M12 17H12.01M6.6 21H17.4C18.8 21 19.5 21 20.054 20.782C20.5348 20.5903 20.9297 20.2543 21.1826 19.8235C21.47 19.336 21.5 18.68 21.56 17.366L21.82 11.366C21.892 9.85 21.928 9.092 21.634 8.48C21.376 7.942 20.968 7.488 20.454 7.18C19.868 6.828 19.114 6.802 17.6 6.75C15.954 6.694 15.132 6.666 14.486 6.35C14.1686 6.2046 13.8746 6.01231 13.614 5.78C13.134 5.36 12.794 4.772 12.114 3.6L11.886 3.2C11.3874 2.37947 11.138 1.96921 10.816 1.69C10.5313 1.44221 10.194 1.25939 9.828 1.154C9.414 1.034 8.972 1.05 8.086 1.082C7.242 1.112 6.82 1.128 6.472 1.218C5.84848 1.37822 5.29094 1.72155 4.866 2.2C4.56 2.56 4.36 3.02 3.96 3.94L3.22 5.5C2.572 6.938 2.248 7.656 2.09 8.414C1.95249 9.06735 1.93285 9.73754 2.03 10.396C2.142 11.16 2.464 11.878 3.108 13.314L4.834 17.214C5.282 18.226 5.506 18.733 5.874 19.124C6.19869 19.4703 6.60455 19.7279 7.05 19.874C7.556 20.042 8.114 20.042 9.228 20.042H10.282" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //           </svg>
// //           <p>{error}</p>
// //         </div>
// //       )}

// //       {/* Download Link */}
// //       {downloadUrl && (
// //         <div className="podverse-cleaner-download">
// //           <a 
// //             href={downloadUrl}
// //             download="podverse_cleaned_audio"
// //             className="podverse-cleaner-download-button"
// //           >
// //             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //               <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //             </svg>
// //             Download Cleaned Audio
// //           </a>
// //           <audio 
// //             controls 
// //             src={downloadUrl} 
// //             className="podverse-cleaner-audio-player"
// //           ></audio>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AudioBgRemover;

// //working
// import { useState, useRef } from 'react';
// import './AudioBgRemover.css';

// const AudioBgRemover = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState('');
//   const [error, setError] = useState('');
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
  
//   // Recording states
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioURL, setAudioURL] = useState('');
  
//   // Refs for recording
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);

//   const handleFileChange = (e) => {
//     const newFile = e.target.files[0];
//     if (newFile && newFile.type.startsWith('audio/')) {
//       setFile(newFile);
//       setError('');
//       setRecordedBlob(null);
//       setAudioURL(URL.createObjectURL(newFile));
//     } else {
//       setError('Only audio files are allowed.');
//       setFile(null);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragActive(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setDragActive(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const droppedFile = e.dataTransfer.files[0];
//       if (droppedFile.type.startsWith('audio/')) {
//         setFile(droppedFile);
//         setError('');
//         setRecordedBlob(null);
//         setAudioURL(URL.createObjectURL(droppedFile));
//       } else {
//         setError('Only audio files are allowed.');
//         setFile(null);
//       }
//     }
//   };

//   const startRecording = async () => {
//     try {
//       setFile(null);
//       setDownloadUrl('');
//       setError('');
//       audioChunksRef.current = [];
      
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
      
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };
      
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         const audioFile = new File([audioBlob], "recorded-audio.wav", { 
//           type: 'audio/wav' 
//         });
        
//         setRecordedBlob(audioBlob);
//         setAudioURL(audioUrl);
//         setFile(audioFile);
//         stream.getTracks().forEach(track => track.stop());
//       };
      
//       mediaRecorder.start();
//       setIsRecording(true);
      
//       let seconds = 0;
//       timerRef.current = setInterval(() => {
//         seconds++;
//         setRecordingTime(seconds);
//       }, 1000);
      
//     } catch (err) {
//       setError("Couldn't access microphone. " + err.message);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     }
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select or record an audio file.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setDownloadUrl('');
//     setUploadProgress(0);
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://localhost:5001/bg-remover', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Server error occurred');
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       setDownloadUrl(url);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="podverse-cleaner-container">
//       <div className="podverse-cleaner-header">
//         <h1 className="podverse-cleaner-title">Podverse Audio Cleaner</h1>
//         <p className="podverse-cleaner-subtitle">
//           Clean background noise from your podcast recordings
//         </p>
//       </div>

//       <div 
//         className={`podverse-cleaner-dropzone ${dragActive ? 'podverse-dropzone-active' : ''} ${isRecording ? 'recording' : ''}`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <div className="podverse-cleaner-dropzone-content">
//           {!file && !recordedBlob ? (
//             <>
//               <div className="podverse-cleaner-record-button-container">
//                 <button
//                   onClick={isRecording ? stopRecording : startRecording}
//                   className={`podverse-cleaner-record-button ${isRecording ? 'recording' : ''}`}
//                   type="button"
//                 >
//                   {isRecording ? (
//                     <>
//                       <span className="record-icon-stop"></span>
//                       Stop Recording ({formatTime(recordingTime)})
//                     </>
//                   ) : (
//                     <>
//                       <span className="record-icon-start"></span>
//                       Record Audio
//                     </>
//                   )}
//                 </button>
//               </div>

//               <div className="podverse-cleaner-separator">
//                 <span>OR</span>
//               </div>

//               <svg className="podverse-cleaner-upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>

//               <input
//                 type="file"
//                 accept="audio/*"
//                 onChange={handleFileChange}
//                 className="podverse-cleaner-input"
//                 id="audio-file-input"
//               />
//               <label htmlFor="audio-file-input" className="podverse-cleaner-label">
//                 Drag & drop an audio file here, or click to select
//               </label>
//             </>
//           ) : (
//             <div className="podverse-cleaner-file-info">
//               <div className="podverse-cleaner-file-header">
//                 <div className="podverse-cleaner-file-status">
//                   {recordedBlob ? (
//                     <>
//                       <span>Recorded Audio Preview:</span>
//                       {/* <span className="podverse-cleaner-recording-time">
//                         {formatTime(recordingTime)}
//                       </span> */}
//                     </>
//                   ) : file ? (
//                     <span>Selected: {file.name}</span>
//                   ) : null}
//                 </div>
//                 <button 
//                   className="podverse-cleaner-clear-button"
//                   onClick={() => {
//                     setFile(null);
//                     setRecordedBlob(null);
//                     setAudioURL('');
//                   }}
//                 >
//                   Clear
//                 </button>
//               </div>
              
//               {audioURL && (
//                 <div className="podverse-cleaner-audio-wrapper">
//                   <audio 
//                     controls 
//                     src={audioURL} 
//                     className="podverse-cleaner-audio-preview"
//                   />
                  
//                 </div>
//               )}
//             </div>
//           )}

//           <p className="podverse-cleaner-supported-formats">
//             Supported formats: WAV, MP3, OGG, FLAC, etc
//           </p>
//         </div>
//       </div>

//       {uploadProgress > 0 && loading && (
//         <div className="podverse-cleaner-progress-container">
//           <div className="podverse-cleaner-progress-bar">
//             <div 
//               className="podverse-cleaner-progress-fill"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//           <span className="podverse-cleaner-progress-text">{uploadProgress}%</span>
//         </div>
//       )}

//       <button
//         onClick={handleUpload}
//         className="podverse-cleaner-button"
//         disabled={loading || (!file && !recordedBlob)}
//       >
//         {loading ? 'Processing...' : 'Clean Audio'}
//       </button>

//       {loading && (
//         <div className="podverse-cleaner-spinner-container">
//           <div className="podverse-cleaner-spinner"></div>
//           <p className="podverse-cleaner-spinner-text">
//             Removing background noise...
//           </p>
//         </div>
//       )}

//       {error && (
//         <div className="podverse-cleaner-error">
//           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 9V13M12 17H12.01M6.6 21H17.4C18.8 21 19.5 21 20.054 20.782C20.5348 20.5903 20.9297 20.2543 21.1826 19.8235C21.47 19.336 21.5 18.68 21.56 17.366L21.82 11.366C21.892 9.85 21.928 9.092 21.634 8.48C21.376 7.942 20.968 7.488 20.454 7.18C19.868 6.828 19.114 6.802 17.6 6.75C15.954 6.694 15.132 6.666 14.486 6.35C14.1686 6.2046 13.8746 6.01231 13.614 5.78C13.134 5.36 12.794 4.772 12.114 3.6L11.886 3.2C11.3874 2.37947 11.138 1.96921 10.816 1.69C10.5313 1.44221 10.194 1.25939 9.828 1.154C9.414 1.034 8.972 1.05 8.086 1.082C7.242 1.112 6.82 1.128 6.472 1.218C5.84848 1.37822 5.29094 1.72155 4.866 2.2C4.56 2.56 4.36 3.02 3.96 3.94L3.22 5.5C2.572 6.938 2.248 7.656 2.09 8.414C1.95249 9.06735 1.93285 9.73754 2.03 10.396C2.142 11.16 2.464 11.878 3.108 13.314L4.834 17.214C5.282 18.226 5.506 18.733 5.874 19.124C6.19869 19.4703 6.60455 19.7279 7.05 19.874C7.556 20.042 8.114 20.042 9.228 20.042H10.282" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <p>{error}</p>
//         </div>
//       )}

//       {downloadUrl && (
//         <div className="podverse-cleaner-download">
//           <a 
//             href={downloadUrl}
//             download="podverse_cleaned_audio"
//             className="podverse-cleaner-download-button"
//           >
//             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Download Cleaned Audio
//           </a>
//           <audio 
//             controls 
//             src={downloadUrl} 
//             className="podverse-cleaner-audio-player"
//           ></audio>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioBgRemover;

import { useState, useRef, useEffect } from 'react';
import './AudioBgRemover.css';
import { encode } from 'wav-encoder';  // Add this line
const AudioBgRemover = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  
  // Refs for recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile && newFile.type.startsWith('audio/')) {
      setFile(newFile);
      setError('');
      setRecordedBlob(null);
      setAudioURL(URL.createObjectURL(newFile));
      // Reset audio duration to let the audio element load naturally
      setAudioDuration(0);
    } else {
      setError('Only audio files are allowed.');
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
        setError('');
        setRecordedBlob(null);
        setAudioURL(URL.createObjectURL(droppedFile));
        // Reset audio duration to let the audio element load naturally
        setAudioDuration(0);
      } else {
        setError('Only audio files are allowed.');
        setFile(null);
      }
    }
  };
  const convertToWav = async (webmBlob) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await webmBlob.arrayBuffer();
      const audioData = await audioContext.decodeAudioData(arrayBuffer);
      
      const wavBuffer = await encode({
        sampleRate: audioData.sampleRate,
        channelData: [audioData.getChannelData(0)]
      });
      return new Blob([wavBuffer], { type: 'audio/wav' });
    } catch (err) {
      console.error("WAV conversion failed:", err);
      throw err;
    }
  };
  const startRecording = async () => {
    try {
      setFile(null);
      setDownloadUrl('');
      setError('');
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,  // Fixed sample rate
          sampleSize: 16
        }
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {  // Remove unused (event) parameter
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const wavBlob = await convertToWav(audioBlob);  // Convert to WAV
          const audioUrl = URL.createObjectURL(wavBlob);
          setRecordedBlob(wavBlob);
          setAudioURL(audioUrl);
          setFile(new File([wavBlob], "recording.wav", { type: 'audio/wav' }));
        } catch (err) {
          setError("Failed to process recording: " + err.message);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      
    } catch (err) {
      setError("Couldn't access microphone. " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
  
      mediaRecorderRef.current.onstop = async (event) => {  // Fixed: Added (event)
        try {
          const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const wavBlob = await convertToWav(webmBlob);  // Requires encode()
          const audioUrl = URL.createObjectURL(wavBlob);
          setRecordedBlob(wavBlob);
          setAudioURL(audioUrl);
          setFile(new File([wavBlob], "recording.wav", { type: 'audio/wav' }));
        } catch (err) {
          setError("Failed to process recording: " + err.message);
        }
      };
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select or record an audio file.');
      return;
    }
    setLoading(true);
    setError('');
    setDownloadUrl('');
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/bg-remover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Server error occurred');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Event handler for when metadata is loaded for the audio element
  const handleAudioMetadata = (e) => {
    // Only update duration if it wasn't already set from recording
    if (audioDuration === 0) {
      setAudioDuration(Math.round(e.target.duration));
    }
  };
  console.log("Recording stopped. Final duration:", recordingTime);
  // Create a custom audio player with the correct duration display
  const CustomAudioPlayer = () => {
    if (!audioURL) return null;
    
    return (
      <div className="podverse-cleaner-audio-wrapper">
        <audio 
          ref={audioRef}
          controls 
          src={audioURL}
          preload="metadata"
          onLoadedMetadata={handleAudioMetadata}
        />
        {/* {audioDuration > 0 && recordedBlob && (
          // <div className="podverse-cleaner-duration">
          //   Duration: {formatTime(audioDuration)}
          // </div>
        )} */}
      </div>
    );
  };

  return (
    <div className="podverse-cleaner-container">
      <div className="podverse-cleaner-header">
        <h1 className="podverse-cleaner-title">Podverse Audio Cleaner</h1>
        <p className="podverse-cleaner-subtitle">
          Clean background noise from your podcast recordings
        </p>
      </div>

      <div 
        className={`podverse-cleaner-dropzone ${dragActive ? 'podverse-dropzone-active' : ''} ${isRecording ? 'recording' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="podverse-cleaner-dropzone-content">
          {!file && !recordedBlob ? (
            <>
              <div className="podverse-cleaner-record-button-container">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`podverse-cleaner-record-button ${isRecording ? 'recording' : ''}`}
                  type="button"
                >
                  {isRecording ? (
                    <>
                      <span className="record-icon-stop"></span>
                      Stop Recording ({formatTime(recordingTime)})
                    </>
                  ) : (
                    <>
                      <span className="record-icon-start"></span>
                      Record Audio
                    </>
                  )}
                </button>
              </div>

              <div className="podverse-cleaner-separator">
                <span>OR</span>
              </div>

              

              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="podverse-cleaner-input"
                id="audio-file-input"
              />
              <label htmlFor="audio-file-input" className="podverse-cleaner-label">
                Drag & drop an audio file here, or click to select
              </label>
            </>
          ) : (
            <div className="podverse-cleaner-file-info">
              <div className="podverse-cleaner-file-header">
                <div className="podverse-cleaner-file-status">
                  {recordedBlob ? (
                    <>
                      <span>Recorded Audio Preview:</span>
                      <span className="podverse-cleaner-recording-time">
                        {formatTime(recordingTime)}
                      </span>
                    </>
                  ) : file ? (
                    <span>Selected: {file.name}</span>
                  ) : null}
                </div>
                <button 
                  className="podverse-cleaner-clear-button"
                  onClick={() => {
                    setFile(null);
                    setRecordedBlob(null);
                    setAudioURL('');
                    setAudioDuration(0);
                  }}
                >
                  Clear
                </button>
              </div>
              
              <CustomAudioPlayer />
            </div>
          )}

          <p className="podverse-cleaner-supported-formats">
            Supported formats: WAV, MP3, OGG, FLAC, etc
          </p>
        </div>
      </div>

      {uploadProgress > 0 && loading && (
        <div className="podverse-cleaner-progress-container">
          <div className="podverse-cleaner-progress-bar">
            <div 
              className="podverse-cleaner-progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="podverse-cleaner-progress-text">{uploadProgress}%</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        className="podverse-cleaner-button"
        disabled={loading || (!file && !recordedBlob)}
      >
        {loading ? 'Processing...' : 'Clean Audio'}
      </button>

      {loading && (
        <div className="podverse-cleaner-spinner-container">
          <div className="podverse-cleaner-spinner"></div>
          <p className="podverse-cleaner-spinner-text">
            Removing background noise...
          </p>
        </div>
      )}

      {error && (
        <div className="podverse-cleaner-error">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M6.6 21H17.4C18.8 21 19.5 21 20.054 20.782C20.5348 20.5903 20.9297 20.2543 21.1826 19.8235C21.47 19.336 21.5 18.68 21.56 17.366L21.82 11.366C21.892 9.85 21.928 9.092 21.634 8.48C21.376 7.942 20.968 7.488 20.454 7.18C19.868 6.828 19.114 6.802 17.6 6.75C15.954 6.694 15.132 6.666 14.486 6.35C14.1686 6.2046 13.8746 6.01231 13.614 5.78C13.134 5.36 12.794 4.772 12.114 3.6L11.886 3.2C11.3874 2.37947 11.138 1.96921 10.816 1.69C10.5313 1.44221 10.194 1.25939 9.828 1.154C9.414 1.034 8.972 1.05 8.086 1.082C7.242 1.112 6.82 1.128 6.472 1.218C5.84848 1.37822 5.29094 1.72155 4.866 2.2C4.56 2.56 4.36 3.02 3.96 3.94L3.22 5.5C2.572 6.938 2.248 7.656 2.09 8.414C1.95249 9.06735 1.93285 9.73754 2.03 10.396C2.142 11.16 2.464 11.878 3.108 13.314L4.834 17.214C5.282 18.226 5.506 18.733 5.874 19.124C6.19869 19.4703 6.60455 19.7279 7.05 19.874C7.556 20.042 8.114 20.042 9.228 20.042H10.282" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{error}</p>
        </div>
      )}

      {downloadUrl && (
        <div className="podverse-cleaner-download">
          <a 
            href={downloadUrl}
            download="podverse_cleaned_audio"
            className="podverse-cleaner-download-button"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Cleaned Audio
          </a>
          <audio
  controls
  src={downloadUrl}
  preload="metadata"  // ← Add this
  className="podverse-cleaner-audio-player"
/>
        </div>
      )}
    </div>
  );
};

export default AudioBgRemover;