
// import { useState, useEffect } from 'react';
// import { encode } from 'wav-encoder';
// import './VoiceCloning.css';

// const VoiceCloning = () => {
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [isChecked, setIsChecked] = useState(false);
//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isDragging) {
//       setIsDragging(true);
//     }
//   };
  
//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!e.currentTarget.contains(e.relatedTarget)) {
//       setIsDragging(false);
//     }
//   };
  
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!isDragging) {
//       setIsDragging(true);
//     }
//   };
  
//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
    
//     const files = e.dataTransfer.files;
//     if (files.length) {
//       handleFileChange({ target: { files } });
//     }
//   };
//   // Consent Modal state and handlers from the first snippet
//     const [showConsentModal, setShowConsentModal] = useState(true);
//     const [userConsented, setUserConsented] = useState(false);
  
//     const handleAcceptConsent = () => {
//       setUserConsented(true);
//       setShowConsentModal(false);
//       // Optional: Store consent in localStorage to remember the choice
//       // localStorage.setItem('voiceCloneConsent', 'true');
//     };
  
//     const handleDeclineConsent = () => {
//       // Optionally, you can redirect or simply alert the user.
//       alert('You must consent to use Voice Cloning features.');
//       window.location.href = '/';
//     };
  
//     // Check localStorage on component mount
//     useEffect(() => {
//       const hasConsented = localStorage.getItem('voiceCloneConsent') === 'true';
//       if (hasConsented) {
//         setUserConsented(true);
//         setShowConsentModal(false);
//       }
//     }, []);
  
//     useEffect(() => {
//       const handleBeforeUnload = () => {
//         localStorage.removeItem('voiceCloneConsent');
//       };
    
//       window.addEventListener('beforeunload', handleBeforeUnload);
//       return () => {
//         window.removeEventListener('beforeunload', handleBeforeUnload);
//       };
//     }, []);
//   const [audioFile, setAudioFile] = useState(null);
//   const [textPrompt, setTextPrompt] = useState('');
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [generatedAudio, setGeneratedAudio] = useState(null);
//   const [error, setError] = useState(null);
//   const [predefinedVoices, setPredefinedVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState(null);
//   const [uploadMethod, setUploadMethod] = useState('upload');
//   const [sampleTextIndex, setSampleTextIndex] = useState(0);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [recordedBlob, setRecordedBlob] = useState(null);
//   const [timerSeconds, setTimerSeconds] = useState(10);
//   const [countdown, setCountdown] = useState(null);
//   const [activeTab, setActiveTab] = useState('indian'); // Added for tabs

//   const voiceImages = {
//     deepika: '/assets/images/celebrities/deepika.jpg',
//     priyanka: '/assets/images/celebrities/priyanka.jpg',
//     sharukh: '/assets/images/celebrities/sharukh.jpg',
//     mukesh: '/assets/images/celebrities/mukesh.jpg',
//     sudha: '/assets/images/celebrities/sudha.jpg',
//     harsha: '/assets/images/celebrities/harsha.jpg',
//     virat: '/assets/images/celebrities/virat.jpg',
//     rohit: '/assets/images/celebrities/rohit.jpg',
//     trump: '/assets/images/celebrities/trump.jpg',
//     bill: '/assets/images/celebrities/bill.jpg',
//     elon: '/assets/images/celebrities/elon.jpg',
//     jeff: '/assets/images/celebrities/jeff.jpg',
//     mark: '/assets/images/celebrities/mark.jpg',
//     // barak: '/assets/images/celebrities/barak.jpg',
//     kamala: '/assets/images/celebrities/kamala.jpg',
//     sundar: '/assets/images/celebrities/sundar.jpg',
//     ronaldo: '/assets/images/celebrities/ronaldo.jpg',
//     // messi: '/assets/images/celebrities/messi.jpg'
//   };

//   const SAMPLE_TEXTS = [
//     "Hello everyone, welcome to our Podverse!",
//     "In a world where technology connects us all, your voice matters more than ever.",
//     "This is a historic moment for our company and our community.",
//     "Success is not final, failure is not fatal.",
//     "The only way to do great work is to love what you do.",
//     "Innovation distinguishes between a leader and a follower.",
//     "Your time is limited, so don't waste it living someone else's life.",
//     "The future belongs to those who believe in the beauty of their dreams.",
//     "Stay hungry, stay foolish. Keep pushing the boundaries of what's possible.",
//     "Together, we can create something truly extraordinary."
//   ];

//   const fallbackImage = '/assets/images/celebrities/placeholder.jpg';

//   useEffect(() => {
//     const voices = [
//       { id: 'deepika', name: 'Deepika Padukone', filename: 'deepika.wav', category: 'indian' },
//       { id: 'priyanka', name: 'Priyanka Chopra', filename: 'priyanka.wav', category: 'indian' },
//       { id: 'sharukh', name: 'Sharukh Khan', filename: 'onlysharukh.wav', category: 'indian' },
//       { id: 'mukesh', name: 'Mukesh Ambani', filename: 'onlymukesh.wav', category: 'indian' },
//       { id: 'sudha', name: 'Sudha Murthy', filename: 'onlysudha.wav', category: 'indian' },
//       { id: 'harsha', name: 'Harsha Bhogle', filename: 'onlyharsha.wav', category: 'indian' },
//       { id: 'virat', name: 'Virat Kohli', filename: 'viratkohli.wav', category: 'indian' },
//       { id: 'rohit', name: 'Rohit Sharma', filename: 'rohitsharma.wav', category: 'indian' },
//       { id: 'trump', name: 'Donald Trump', filename: 'trump.wav', category: 'foreign' },
//       { id: 'bill', name: 'Bill Gates', filename: 'onlybill.wav', category: 'foreign' },
//       { id: 'elon', name: 'Elon Musk', filename: 'onlyelon.wav', category: 'foreign' },
//       { id: 'jeff', name: 'Jeff Bezos', filename: 'onlyjeff.wav', category: 'foreign' },
//       { id: 'mark', name: 'Mark Zuckerberg', filename: 'onlymark.wav', category: 'foreign' },
//       // { id: 'barak', name: 'Barak Obama', filename: 'onlybarak.wav', category: 'foreign' },
//       { id: 'kamala', name: 'Kamala Harris', filename: 'onlykamala.wav', category: 'foreign' },
//       { id: 'sundar', name: 'Sundar Pichai', filename: 'onlysundar.wav', category: 'foreign' },
//       { id: 'ronaldo', name: 'Cristiano Ronaldo', filename: 'ronaldo.wav', category: 'foreign' },
//       // { id: 'messi', name: 'Lionel Messi', filename: 'messi.wav', category: 'foreign' },
//     ];

//     const voicesWithImages = voices.map(voice => ({
//       ...voice,
//       image: voiceImages[voice.id] || fallbackImage
//     }));
    
//     setPredefinedVoices(voicesWithImages);
//   }, []);

//   const convertWebmToWav = async (webmBlob) => {
//     try {
//       const audioContext = new AudioContext();
//       const arrayBuffer = await webmBlob.arrayBuffer();
//       const audioData = await audioContext.decodeAudioData(arrayBuffer);
      
//       const wavBuffer = await encode({
//         sampleRate: audioData.sampleRate,
//         channelData: [audioData.getChannelData(0)]
//       });
  
//       return new Blob([wavBuffer], { type: 'audio/wav' });
//     } catch (error) {
//       console.error('Conversion error:', error);
//       throw new Error('Failed to convert recording to WAV format');
//     }
//   };
  
//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: {
//           channelCount: 1,
//           sampleRate: 16000,
//           sampleSize: 16
//         }
//       });

//       const recorder = new MediaRecorder(stream, {
//         mimeType: 'audio/webm;codecs=opus',
//         audioBitsPerSecond: 128000
//       });

//       setMediaRecorder(recorder);
//       setIsRecording(true);
//       setTimerSeconds(10);
//       setError(null);
//       setAudioFile(null);
//       setRecordedBlob(null);

//       let chunks = [];
//       recorder.ondataavailable = (e) => chunks.push(e.data);
      
//       recorder.onstop = async () => {
//         try {
//           const webmBlob = new Blob(chunks, { type: 'audio/webm' });
//           const wavBlob = await convertWebmToWav(webmBlob);
          
//           const wavFile = new File([wavBlob], 'recording.wav', {
//             type: 'audio/wav'
//           });

//           setAudioFile(wavFile);
//           setRecordedBlob(URL.createObjectURL(wavBlob));
//         } catch (error) {
//           setError(error.message);
//         }
//         stream.getTracks().forEach(track => track.stop());
//       };

//       recorder.start();

//       const countdownInterval = setInterval(() => {
//         setTimerSeconds((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdownInterval);
//             stopRecording();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       setCountdown(countdownInterval);

//     } catch (err) {
//       setError('Microphone access denied. Please allow microphone access to record.');
//       console.error('Error accessing microphone:', err);
//     }
//   };
//   const formatDuration = (seconds) => {
//     if (!seconds && seconds !== 0) return "0.00";
//     // Round to 2 decimal places for more precision
//     const exactSeconds = Math.round(seconds * 100) / 100;
//     return exactSeconds.toFixed(2); // Always shows 2 decimal places
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       const duration = 10 - timerSeconds;
//       setRecordingDuration(duration);
  
//       mediaRecorder.stop();
//       setIsRecording(false);
//       if (countdown) {
//         clearInterval(countdown);
//         setCountdown(null);
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (mediaRecorder) {
//         mediaRecorder.stream?.getTracks().forEach(track => track.stop());
//       }
//       if (countdown) clearInterval(countdown);
//     };
//   }, [mediaRecorder, countdown]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.name.endsWith('.wav')) {
//         setError('Please upload a WAV file');
//         return;
//       }
//       const previewUrl = URL.createObjectURL(file);
//       setAudioFile(file);
//       setRecordedBlob(previewUrl);
//       setSelectedVoice(null);
//       setUploadMethod('upload');


//        const audio = new Audio(previewUrl);
       
//       audio.onerror = () => {
//         setError('Invalid audio file');
//       };
//     }
//   };

//   const handleVoiceSelect = (voice) => {
//     setSelectedVoice(voice);
//     setAudioFile(null);
//     setUploadMethod('predefined');
//   };


//   const handleTextChange = (e) => {
//     setTextPrompt(e.target.value);
//   };

//   const handleSampleText = () => {
//     setTextPrompt(SAMPLE_TEXTS[sampleTextIndex]);
//     setSampleTextIndex((prev) => (prev + 1) % SAMPLE_TEXTS.length);
//   };

//   const handleSubmit = async () => {
//     if ((!audioFile && !selectedVoice) || !textPrompt.trim()) {
//       setError("Please provide both a voice source and text");
//       return;
//     }

//     if (audioFile && uploadMethod === 'upload') {
//       if (!audioFile.name.endsWith('.wav')) {
//         setError('Only WAV files are supported');
//         return;
//       }
//       if (audioFile.size > 10 * 1024 * 1024) {
//         setError('File size too large (max 10MB)');
//         return;
//       }
//     }

//     setIsLoading(true);
//     setError(null);
//     setGeneratedAudio(null);

//     try {
//       const formData = new FormData();
//       if (uploadMethod === 'upload' && audioFile) {
//         formData.append('speaker_audio', audioFile);
//       } else if (uploadMethod === 'predefined' && selectedVoice) {
//         formData.append('predefined_voice', selectedVoice.filename);
//       }
//       formData.append('text', textPrompt);

//       const response = await fetch('http://localhost:5000/api/generate_audio', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to generate audio');
//       }

//       const blob = await response.blob();
//       const audioUrl = URL.createObjectURL(blob);
//       setGeneratedAudio(audioUrl);
//       new Audio(audioUrl).play();
//     } catch (err) {
//       setError(err.message);
//       console.error("Error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const renderFileUploadSection = () => (
//     <div 
//       className={`voice-cloning-file-upload-slide-in-left ${isDragging ? 'dragging' : ''}`}
//       onDragEnter={handleDragEnter}
//       onDragLeave={handleDragLeave}
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//     >
//       <div className="center-container">
//         {!audioFile && !recordedBlob ? (
//           <div className="upload-options">
//             <div className="file-upload-section">
//               <label htmlFor="audio-file" className="podverse-cleaner-label">
//                 Drag & drop an audio file here, or click to select
//               </label>
//               <input 
//                 type="file" 
//                 id="audio-file" 
//                 accept=".wav,audio/wav" 
//                 onChange={handleFileChange} 
//                 className="file-input"
//               />
//             </div>
  
//             <div className="or-separator">OR</div>
  
//             <div className="recording-section">
//               {!isRecording ? (
//                 <button 
//                   className={`record-button ${isRecording ? 'recording' : ''}`}
//                   onClick={startRecording}
//                 >
//                   <div className="record-icon"></div> Record Audio
//                 </button>
//               ) : (
//                 <button 
//                   className="stop-button"
//                   onClick={stopRecording}
//                 >
//                   <span className="record-icon-stop"></span>
//                   Stop Recording ({timerSeconds}s)
//                 </button>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="recorded-audio-preview fade-in">
//            <div className="preview-header">
//   <h4>
//     {audioFile ? "Uploaded Audio Preview" : "Recording Preview"}
//     {audioFile && (
//       <span className="selected-file-name">: {audioFile.name}</span>
//     )}
//   </h4>
//   <div className="duration-display">
//     Duration: {formatDuration(recordingDuration)}
//   </div>
//   <button 
//     className="clear-button"
//     onClick={() => {
//       setAudioFile(null);
//       setRecordedBlob(null);
//     }}
//   >
//     Clear
//   </button>
// </div>
//             <audio 
//               controls 
//               src={recordedBlob} 
//               className="audio-preview" 
//               onLoadedMetadata={(e) => {
//                 const duration = Math.round(e.target.duration);
//                 setRecordingDuration(duration);
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
  
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const indianVoices = predefinedVoices.filter(voice => voice.category === 'indian');
//   const foreignVoices = predefinedVoices.filter(voice => voice.category === 'foreign');

//   return (
// <>
//     {/* {showConsentModal && (
//       <div className="consent-modal">
// <div className="consent-modal-content">
// <h2>Voice Cloning Consent & Legal Warning</h2>
// <p>
 
//   By accessing and using the Voice Cloning feature, you accept full legal responsibility for its use. This tool is intended solely for project and research purposes, and it is your obligation to comply with all applicable laws, regulations, and intellectual property rights.<br/> Unauthorized commercial or public distribution of synthesized content is strictly prohibited, and you are solely accountable for any misuse.<br/><br/> Your continued use of this feature confirms that you have read, understood, and agreed to these terms.
// </p>

// <div className="consent-buttons">
//   <button 
//     className="consent-button consent-accept" 
//     onClick={handleAcceptConsent}
//   >
//     I Consent & Accept Responsibility
//   </button>
//   <button 
//     className="consent-button consent-decline" 
//     onClick={handleDeclineConsent}
//   >
//     Decline
//   </button>
// </div>
// </div>

//       </div>
//     )} */}
//     {showConsentModal && (
//   <div className="consent-modal">
//     <div className="consent-modal-content">
//       <h2>Voice Cloning Consent & Legal Warning</h2>
//       <p>
//         IMPORTANT NOTICE:<br/>By accessing and using the Voice Cloning feature, you acknowledge that all legal responsibilities are solely yours.<br/>
//         This tool is intended for project and research purposes only.<br/>You must ensure that you comply with all applicable laws, regulations, 
//         and intellectual property rights before distributing any synthesized content online.<br/>Unauthorized commercial or public distribution is strictly prohibited, 
//         and you assume full responsibility for any consequences arising from misuse.<br/><br/>Your access to this feature confirms that you have reviewed and accepted these terms.
//       </p>
      
//       <div className="consent-checkbox">
//         <input 
//           type="checkbox" 
//           id="consent-checkbox" 
//           onChange={(e) => setIsChecked(e.target.checked)} 
//         />
//         <label htmlFor="consent-checkbox">I have read and understand the terms</label>
//       </div>
      
//       <div className="consent-buttons">
//         <button 
//           className={`consent-button consent-accept ${!isChecked ? 'disabled' : ''}`}
//           onClick={handleAcceptConsent}
//           disabled={!isChecked}
//         >
//           I Consent & Accept Responsibility
//         </button>
//         <button 
//           className="consent-button consent-decline" 
//           onClick={handleDeclineConsent}
//         >
//           Decline
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     {userConsented && (
//     <div className="voice-cloning-app">
//       <div className="voice-cloning-content">
//         <h2 className="voice-cloning-header slide-in-top">Voice Cloning Studio</h2>
        
//         <div className="voice-cloning-toggle fade-in">
//           <button 
//             className={`toggle-button ${uploadMethod === 'upload' ? 'active' : ''}`}
//             onClick={() => setUploadMethod('upload')}
//           >
//             Upload Voice
//           </button>
//           <button 
//             className={`toggle-button ${uploadMethod === 'predefined' ? 'active' : ''}`}
//             onClick={() => setUploadMethod('predefined')}
//           >
//             Sample Voices
//           </button>
//         </div>

//         {uploadMethod === 'upload' ? renderFileUploadSection() : (
//           <div className="voice-cloning-predefined slide-in-right">
//             <h3 className="section-title">Select a Voice</h3>

//             {/* New tabbed navigation */}
//             <div className="voice-category-tabs">
//               <button 
//                 className={`tab-button ${activeTab === 'indian' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('indian')}
//               >
//                 Indian Celebrities
//               </button>
//               <button 
//                 className={`tab-button ${activeTab === 'foreign' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('foreign')}
//               >
//                 Foreign Celebrities
//               </button>
//             </div>

//             {/* Indian Celebrities Section */}
//             {activeTab === 'indian' && (
//               <div className="celebrity-section">
//                 <div className="voice-grid">
//                   {indianVoices.map((voice, index) => (
//                     <div 
//                       key={voice.id}
//                       className={`voice-card ${selectedVoice?.id === voice.id ? 'selected' : ''}`}
//                       onClick={() => handleVoiceSelect(voice)}
//                       style={{animationDelay: `${index * 0.05}s`}}
//                     >
//                       <div className="voice-card-inner">
//                         <div className="voice-image-container">
//                           <img 
//                             src={voice.image} 
//                             alt={voice.name} 
//                             className="voice-image"
//                             onError={(e) => { e.target.src = fallbackImage }}
//                           />
//                         </div>
//                         <div className="voice-info">
//                           <div className="voice-name">{voice.name}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Foreign Celebrities Section */}
//             {activeTab === 'foreign' && (
//               <div className="celebrity-section">
//                 <div className="voice-grid">
//                   {foreignVoices.map((voice, index) => (
//                     <div 
//                       key={voice.id}
//                       className={`voice-card ${selectedVoice?.id === voice.id ? 'selected' : ''}`}
//                       onClick={() => handleVoiceSelect(voice)}
//                       style={{animationDelay: `${index * 0.05}s`}}
//                     >
//                       <div className="voice-card-inner">
//                         <div className="voice-image-container">
//                           <img 
//                             src={voice.image} 
//                             alt={voice.name} 
//                             className="voice-image"
//                             onError={(e) => { e.target.src = fallbackImage }}
//                           />
//                         </div>
//                         <div className="voice-info">
//                           <div className="voice-name">{voice.name}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="sample-text-section">
//           {/* <button
//             className="sample-text-btn"
//             onClick={handleSampleText}
//             disabled={isLoading}
//             title="Click to insert sample text"
//           >
//             🎤 Get Inspired!
//           </button> */}
//         </div>

//         <div className="voice-cloning-text-input fade-in">
//   <div className="text-input-container">
//     <textarea
//       className="text-prompt-input"
//       placeholder="Type your message here..."
//       value={textPrompt}
//       onChange={handleTextChange}
//     />
//     <div className="inspire-button-container">
//       <button
//         className="sample-text-btn"
//         onClick={handleSampleText}
//         disabled={isLoading}
//         title="Click to insert sample text"
//       >
//         <span className="brain-icon">🧠</span> Inspire Me
//       </button>
//     </div>
//   </div>
// </div>

//         <div className="voice-cloning-button-section bounce-in">
//           <button 
//             className={`send-button ${isLoading ? 'loading' : ''}`}
//             onClick={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <span className="loading-spinner"></span>
//             ) : (
//               'Generate Voice'
//             )}
//           </button>
//         </div>

//         {error && (
//           <div className="voice-cloning-error shake">
//             <span className="error-icon">⚠️</span> {error}
//           </div>
//         )}

// {generatedAudio && (
//   <div className="voice-cloning-audio-player slide-in-bottom">
//     <h3 className="player-title">Generated Voice</h3>
    
//       <audio 
//         controls 
//         src={generatedAudio} 
//         className="audio-control"
//         controlsList="nodownload" // ← This hides the download option
//       ></audio>
   
//     <a 
//       href={generatedAudio} 
//       download="generated_voice.wav" 
//       className="download-button"
//     >
//       <span className="download-icon">↓</span> Download Audio
//     </a>
//   </div>
// )}
        
//       </div>
//     </div>
// )}
// </>
//   );
// };

// export default VoiceCloning;



import { useState, useEffect } from 'react';
import { encode } from 'wav-encoder';
import './VoiceCloning.css';

const VoiceCloning = () => {
  const [actualDuration, setActualDuration] = useState(0);
const [isChecked, setIsChecked] = useState(false);
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileChange({ target: { files } });
    }
  };
  // Consent Modal state and handlers from the first snippet
    const [showConsentModal, setShowConsentModal] = useState(true);
    const [userConsented, setUserConsented] = useState(false);
  
    const handleAcceptConsent = () => {
      setUserConsented(true);
      setShowConsentModal(false);
      // Optional: Store consent in localStorage to remember the choice
      // localStorage.setItem('voiceCloneConsent', 'true');
    };
  
    const handleDeclineConsent = () => {
      // Optionally, you can redirect or simply alert the user.
      alert('You must consent to use Voice Cloning features.');
      window.location.href = '/';
    };
  
    // Check localStorage on component mount
    useEffect(() => {
      const hasConsented = localStorage.getItem('voiceCloneConsent') === 'true';
      if (hasConsented) {
        setUserConsented(true);
        setShowConsentModal(false);
      }
    }, []);
  
    useEffect(() => {
      const handleBeforeUnload = () => {
        localStorage.removeItem('voiceCloneConsent');
      };
    
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
  const [audioFile, setAudioFile] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [predefinedVoices, setPredefinedVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [sampleTextIndex, setSampleTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(10);
  const [countdown, setCountdown] = useState(null);
  const [activeTab, setActiveTab] = useState('indian'); // Added for tabs

  const voiceImages = {
    deepika: '/assets/images/celebrities/deepika.jpg',
    priyanka: '/assets/images/celebrities/priyanka.jpg',
    sharukh: '/assets/images/celebrities/sharukh.jpg',
    mukesh: '/assets/images/celebrities/mukesh.jpg',
    sudha: '/assets/images/celebrities/sudha.jpg',
    harsha: '/assets/images/celebrities/harsha.jpg',
    virat: '/assets/images/celebrities/virat.jpg',
    rohit: '/assets/images/celebrities/rohit.jpg',
    trump: '/assets/images/celebrities/trump.jpg',
    bill: '/assets/images/celebrities/bill.jpg',
    elon: '/assets/images/celebrities/elon.jpg',
    jeff: '/assets/images/celebrities/jeff.jpg',
    mark: '/assets/images/celebrities/mark.jpg',
    // barak: '/assets/images/celebrities/barak.jpg',
    kamala: '/assets/images/celebrities/kamala.jpg',
    sundar: '/assets/images/celebrities/sundar.jpg',
    ronaldo: '/assets/images/celebrities/ronaldo.jpg',
    // messi: '/assets/images/celebrities/messi.jpg'
  };

  const SAMPLE_TEXTS = [
    "Hello everyone, welcome to our Podverse!",
    "In a world where technology connects us all, your voice matters more than ever.",
    "This is a historic moment for our company and our community.",
    "Success is not final, failure is not fatal.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Your time is limited, so don't waste it living someone else's life.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Stay hungry, stay foolish. Keep pushing the boundaries of what's possible.",
    "Together, we can create something truly extraordinary."
  ];

  const fallbackImage = '/assets/images/celebrities/placeholder.jpg';

  useEffect(() => {
    const voices = [
      { id: 'deepika', name: 'Deepika Padukone', filename: 'deepika.wav', category: 'indian' },
      { id: 'priyanka', name: 'Priyanka Chopra', filename: 'priyanka.wav', category: 'indian' },
      { id: 'sharukh', name: 'Sharukh Khan', filename: 'onlysharukh.wav', category: 'indian' },
      { id: 'mukesh', name: 'Mukesh Ambani', filename: 'onlymukesh.wav', category: 'indian' },
      { id: 'sudha', name: 'Sudha Murthy', filename: 'onlysudha.wav', category: 'indian' },
      { id: 'harsha', name: 'Harsha Bhogle', filename: 'onlyharsha.wav', category: 'indian' },
      { id: 'virat', name: 'Virat Kohli', filename: 'viratkohli.wav', category: 'indian' },
      { id: 'rohit', name: 'Rohit Sharma', filename: 'rohitsharma.wav', category: 'indian' },
      { id: 'trump', name: 'Donald Trump', filename: 'trump.wav', category: 'foreign' },
      { id: 'bill', name: 'Bill Gates', filename: 'onlybill.wav', category: 'foreign' },
      { id: 'elon', name: 'Elon Musk', filename: 'onlyelon.wav', category: 'foreign' },
      { id: 'jeff', name: 'Jeff Bezos', filename: 'onlyjeff.wav', category: 'foreign' },
      { id: 'mark', name: 'Mark Zuckerberg', filename: 'onlymark.wav', category: 'foreign' },
      // { id: 'barak', name: 'Barak Obama', filename: 'onlybarak.wav', category: 'foreign' },
      { id: 'kamala', name: 'Kamala Harris', filename: 'onlykamala.wav', category: 'foreign' },
      { id: 'sundar', name: 'Sundar Pichai', filename: 'onlysundar.wav', category: 'foreign' },
      { id: 'ronaldo', name: 'Cristiano Ronaldo', filename: 'ronaldo.wav', category: 'foreign' },
      // { id: 'messi', name: 'Lionel Messi', filename: 'messi.wav', category: 'foreign' },
    ];

    const voicesWithImages = voices.map(voice => ({
      ...voice,
      image: voiceImages[voice.id] || fallbackImage
    }));
    
    setPredefinedVoices(voicesWithImages);
  }, []);

  const convertWebmToWav = async (webmBlob) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await webmBlob.arrayBuffer();
      const audioData = await audioContext.decodeAudioData(arrayBuffer);
      
      const wavBuffer = await encode({
        sampleRate: audioData.sampleRate,
        channelData: [audioData.getChannelData(0)]
      });
  
      return new Blob([wavBuffer], { type: 'audio/wav' });
    } catch (error) {
      console.error('Conversion error:', error);
      throw new Error('Failed to convert recording to WAV format');
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16
        }
      });
  
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
  
      setMediaRecorder(recorder);
      setTimerSeconds(10);
      setIsRecording(true);
      setError(null);
      setAudioFile(null);
      setRecordedBlob(null);
  
      let chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = async () => {
        try {
          const webmBlob = new Blob(chunks, { type: 'audio/webm' });
          const wavBlob = await convertWebmToWav(webmBlob);
          
          const wavFile = new File([wavBlob], 'recording.wav', {
            type: 'audio/wav'
          });
  
          setAudioFile(wavFile);
          setRecordedBlob(URL.createObjectURL(wavBlob));
        } catch (error) {
          setError(error.message);
        }
        stream.getTracks().forEach(track => track.stop());
      };
  
      recorder.start();

      const countdownInterval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdown(countdownInterval);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to record.');
      console.error('Error accessing microphone:', err);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream?.getTracks().forEach(track => track.stop());
      }
      if (countdown) clearInterval(countdown);
    };
  }, [mediaRecorder, countdown]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.wav')) {
        setError('Please upload a WAV file');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAudioFile(file);
      setRecordedBlob(previewUrl);
      setSelectedVoice(null);
      setUploadMethod('upload');
  
      const audio = new Audio(previewUrl);
      audio.onerror = () => {
        setError('Invalid audio file');
      };
    }
  };

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setAudioFile(null);
    setUploadMethod('predefined');
  };


  const handleTextChange = (e) => {
    setTextPrompt(e.target.value);
  };

  const handleSampleText = () => {
    setTextPrompt(SAMPLE_TEXTS[sampleTextIndex]);
    setSampleTextIndex((prev) => (prev + 1) % SAMPLE_TEXTS.length);
  };

  const handleSubmit = async () => {
    if ((!audioFile && !selectedVoice) || !textPrompt.trim()) {
      setError("Please provide both a voice source and text");
      return;
    }

    if (audioFile && uploadMethod === 'upload') {
      if (!audioFile.name.endsWith('.wav')) {
        setError('Only WAV files are supported');
        return;
      }
      if (audioFile.size > 10 * 1024 * 1024) {
        setError('File size too large (max 10MB)');
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedAudio(null);

    try {
      const formData = new FormData();
      if (uploadMethod === 'upload' && audioFile) {
        formData.append('speaker_audio', audioFile);
      } else if (uploadMethod === 'predefined' && selectedVoice) {
        formData.append('predefined_voice', selectedVoice.filename);
      }
      formData.append('text', textPrompt);

      const response = await fetch('http://localhost:5000/api/generate_audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setGeneratedAudio(audioUrl);
      new Audio(audioUrl).play();
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileUploadSection = () => (
    <div 
      className={`voice-cloning-file-upload-slide-in-left ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="center-container">
        {!audioFile && !recordedBlob ? (
          <div className="upload-options">
            <div className="file-upload-section">
              <label htmlFor="audio-file" className="podverse-cleaner-label">
                Drag & drop an audio file here, or click to select
              </label>
              <input 
                type="file" 
                id="audio-file" 
                accept=".wav,audio/wav" 
                onChange={handleFileChange} 
                className="file-input"
              />
            </div>
  
            <div className="or-separator">OR</div>
  
            <div className="recording-section">
              {!isRecording ? (
                <button 
                  className={`record-button ${isRecording ? 'recording' : ''}`}
                  onClick={startRecording}
                >
                  <div className="record-icon"></div> Record Audio
                </button>
              ) : (
                <button 
                  className="stop-button"
                  onClick={stopRecording}
                >
                  <span className="record-icon-stop"></span>
                  Stop Recording ({timerSeconds}s)
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="recorded-audio-preview fade-in">
            <div className="preview-header">
            {isRecording || (recordedBlob && mediaRecorder) ? (
      <h4>Recording Preview: <span className="duration-text">{formatDuration(actualDuration)}</span></h4>
              ) : (
                <h4>Selected: {audioFile?.name}</h4>
              )}
<button 
    className="clear-button"
    onClick={() => {
      setAudioFile(null);
      setRecordedBlob(null);
      setActualDuration(0);
      if (mediaRecorder) {
        mediaRecorder.stream?.getTracks().forEach(track => track.stop());
        setMediaRecorder(null);
      }
    }}
  >
    Clear
  </button>
            </div>
            <audio 
  controls 
  src={recordedBlob} 
  className="audio-preview" 
  onLoadedMetadata={(e) => {
    setActualDuration(e.target.duration);
  }}
/>
          </div>
        )}
      </div>
    </div>
  );
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const indianVoices = predefinedVoices.filter(voice => voice.category === 'indian');
  const foreignVoices = predefinedVoices.filter(voice => voice.category === 'foreign');

  return (
<> {showConsentModal && (
  <div className="consent-modal">
    <div className="consent-modal-content">
      <h2>Voice Cloning Consent & Legal Warning</h2>
      <p>
        IMPORTANT NOTICE:<br/>By accessing and using the Voice Cloning feature, you acknowledge that all legal responsibilities are solely yours.<br/>
        This tool is intended for project and research purposes only.<br/>You must ensure that you comply with all applicable laws, regulations, 
        and intellectual property rights before distributing any synthesized content online.<br/>Unauthorized commercial or public distribution is strictly prohibited, 
        and you assume full responsibility for any consequences arising from misuse.<br/><br/>Your access to this feature confirms that you have reviewed and accepted these terms.
      </p>
      
      <div className="consent-checkbox">
        <input 
          type="checkbox" 
          id="consent-checkbox" 
          onChange={(e) => setIsChecked(e.target.checked)} 
        />
        <label htmlFor="consent-checkbox">I have read and understand the terms</label>
      </div>
      
      <div className="consent-buttons">
        <button 
          className={`consent-button consent-accept ${!isChecked ? 'disabled' : ''}`}
          onClick={handleAcceptConsent}
          disabled={!isChecked}
        >
          I Consent & Accept Responsibility
        </button>
        <button 
          className="consent-button consent-decline" 
          onClick={handleDeclineConsent}
        >
          Decline
        </button>
      </div>
    </div>
  </div>
)}


    {userConsented && (
    <div className="voice-cloning-app">
      <div className="voice-cloning-content">
        <h2 className="voice-cloning-header slide-in-top">Voice Cloning Studio</h2>
        
        <div className="voice-cloning-toggle fade-in">
          <button 
            className={`toggle-button ${uploadMethod === 'upload' ? 'active' : ''}`}
            onClick={() => setUploadMethod('upload')}
          >
            Upload Voice
          </button>
          <button 
            className={`toggle-button ${uploadMethod === 'predefined' ? 'active' : ''}`}
            onClick={() => setUploadMethod('predefined')}
          >
            Sample Voices
          </button>
        </div>

        {uploadMethod === 'upload' ? renderFileUploadSection() : (
          <div className="voice-cloning-predefined slide-in-right">
            <h3 className="section-title">Select a Voice</h3>

            {/* New tabbed navigation */}
            <div className="voice-category-tabs">
              <button 
                className={`tab-button ${activeTab === 'indian' ? 'active' : ''}`}
                onClick={() => handleTabChange('indian')}
              >
                Indian Celebrities
              </button>
              <button 
                className={`tab-button ${activeTab === 'foreign' ? 'active' : ''}`}
                onClick={() => handleTabChange('foreign')}
              >
                Foreign Celebrities
              </button>
            </div>

            {/* Indian Celebrities Section */}
            {activeTab === 'indian' && (
              <div className="celebrity-section">
                <div className="voice-grid">
                  {indianVoices.map((voice, index) => (
                    <div 
                      key={voice.id}
                      className={`voice-card ${selectedVoice?.id === voice.id ? 'selected' : ''}`}
                      onClick={() => handleVoiceSelect(voice)}
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <div className="voice-card-inner">
                        <div className="voice-image-container">
                          <img 
                            src={voice.image} 
                            alt={voice.name} 
                            className="voice-image"
                            onError={(e) => { e.target.src = fallbackImage }}
                          />
                        </div>
                        <div className="voice-info">
                          <div className="voice-name">{voice.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foreign Celebrities Section */}
            {activeTab === 'foreign' && (
              <div className="celebrity-section">
                <div className="voice-grid">
                  {foreignVoices.map((voice, index) => (
                    <div 
                      key={voice.id}
                      className={`voice-card ${selectedVoice?.id === voice.id ? 'selected' : ''}`}
                      onClick={() => handleVoiceSelect(voice)}
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      <div className="voice-card-inner">
                        <div className="voice-image-container">
                          <img 
                            src={voice.image} 
                            alt={voice.name} 
                            className="voice-image"
                            onError={(e) => { e.target.src = fallbackImage }}
                          />
                        </div>
                        <div className="voice-info">
                          <div className="voice-name">{voice.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="sample-text-section">
          {/* <button
            className="sample-text-btn"
            onClick={handleSampleText}
            disabled={isLoading}
            title="Click to insert sample text"
          >
            🎤 Get Inspired!
          </button> */}
        </div>

        <div className="voice-cloning-text-input fade-in">
  <div className="text-input-container">
    <textarea
      className="text-prompt-input"
      placeholder="Type your message here..."
      value={textPrompt}
      onChange={handleTextChange}
    />
    <div className="inspire-button-container">
      <button
        className="sample-text-btn"
        onClick={handleSampleText}
        disabled={isLoading}
        title="Click to insert sample text"
      >
        <span className="brain-icon">🧠</span> Inspire Me
      </button>
    </div>
  </div>
</div>

        <div className="voice-cloning-button-section bounce-in">
          <button 
            className={`send-button ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Generate Voice'
            )}
          </button>
        </div>

        {error && (
          <div className="voice-cloning-error shake">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

{generatedAudio && (
  <div className="voice-cloning-audio-player slide-in-bottom">
    <h3 className="player-title">Generated Voice</h3>
    
      <audio 
        controls 
        src={generatedAudio} 
        className="audio-control"
        controlsList="nodownload" // ← This hides the download option
      ></audio>
   
    <a 
      href={generatedAudio} 
      download="generated_voice.wav" 
      className="download-button"
    >
      <span className="download-icon">↓</span> Download Audio
    </a>
  </div>
)}
        
      </div>
    </div>
)}
</>
  );
};

export default VoiceCloning;