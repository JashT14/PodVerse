






// // claude ai ui - 13/3/25 - 16:20 - college
// // eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Menu,
//   ArrowLeft,
//   PlusCircle,
//   SkipBack,
//   SkipForward,
//   Sun,
//   Moon,
//   Download
// } from "lucide-react";
// import "./TextToSpeech.css";

// // ------------------------------------------------------
// // Utility: Format seconds as mm:ss
// // ------------------------------------------------------
// const formatTime = (seconds) => {
//   if (!seconds || isNaN(seconds)) return "00:00";
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
// };

// // ------------------------------------------------------
// // AudioPlayer Component (Custom Controls for Audio)
// // ------------------------------------------------------
// const AudioPlayer = ({ src }) => {
//   const token = localStorage.getItem("token");

//   // Only append token if the URL is not a Blob and doesn't already have ?token= or &token=
//   let effectiveSrc = src;
//   if (src && token && !src.startsWith("blob:") && !src.includes("token=")) {
//     effectiveSrc = src.includes("?")
//       ? `${src}&token=${token}`
//       : `${src}?token=${token}`;
//   }

//   if (!effectiveSrc) return <div>Loading audio...</div>;

//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const skipBackward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = Math.max(
//         audioRef.current.currentTime - 10,
//         0
//       );
//     }
//   };

//   const skipForward = () => {
//     if (audioRef.current) {
//       const dur = audioRef.current.duration || 0;
//       audioRef.current.currentTime = Math.min(
//         audioRef.current.currentTime + 10,
//         dur
//       );
//     }
//   };

//   const toggleMute = () => {
//     if (!audioRef.current) return;
//     audioRef.current.muted = !audioRef.current.muted;
//     setIsMuted(audioRef.current.muted);
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   const handleSeek = (e) => {
//     const seekTime = Number(e.target.value);
//     if (audioRef.current) {
//       audioRef.current.currentTime = seekTime;
//       setCurrentTime(seekTime);
//     }
//   };


//   return (
//     <div className="audio-player fade-in">
//       <audio
//         ref={audioRef}
//         src={effectiveSrc}
//         preload="metadata"
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//         onEnded={() => setIsPlaying(false)}
//       >
//         <source src={effectiveSrc} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="audio-controls">
//         <button onClick={togglePlay} className="control-btn">
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//         <button onClick={skipBackward} className="control-btn">
//           <SkipBack size={16} />
//         </button>
//         <button onClick={skipForward} className="control-btn">
//           <SkipForward size={16} />
//         </button>
//         <button onClick={toggleMute} className="control-btn">
//           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//         </button>
//         <a href={effectiveSrc} download className="control-btn">
//           <Download size={16} />
//         </a>
//       </div>
//       <div className="time-stamps">
//         <span className="current-time">{formatTime(currentTime)}</span>
//         <span className="duration-time">{formatTime(duration)}</span>
//       </div>
//       <input
//         type="range"
//         min="0"
//         max={duration || 0}
//         value={currentTime}
//         onChange={handleSeek}
//         className="audio-slider"
//       />
//     </div>
//   );
// };

// // ------------------------------------------------------
// // SequentialAudioPlayer Component (for Queue Playback)
// // ------------------------------------------------------
// const SequentialAudioPlayer = ({ audioList, onQueueEnd }) => {
//   const audioRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     if (audioRef.current && audioList.length > 0) {
//       audioRef.current.src = audioList[currentIndex];
//       if (isPlaying) {
//         audioRef.current
//           .play()
//           .catch((err) => console.error("Play failed:", err));
//       }
//     }
//   }, [currentIndex, audioList, isPlaying]);

//   const handleEnded = () => {
//     if (currentIndex < audioList.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setIsPlaying(false);
//       if (onQueueEnd) onQueueEnd();
//     }
//   };


  

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (audioRef.current.paused) {
//       audioRef.current
//         .play()
//         .then(() => setIsPlaying(true))
//         .catch((err) => console.error("Play failed:", err));
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   return (
//     <div className="sequential-audio-player">
//       <audio
//         ref={audioRef}
//         onEnded={handleEnded}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//       />
//       <div className="player-controls">
//         <button onClick={togglePlay} className="control-btn">
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//         <span className="player-status">
//           Playing {currentIndex + 1} of {audioList.length}
//         </span>
//         <div className="progress-bar">
//           <span>{formatTime(currentTime)}</span>
//           <span>{formatTime(duration)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ------------------------------------------------------
// // Main TextToSpeech Component
// // ------------------------------------------------------

// const TextToSpeech = () => {
//     // Add this function in your TextToSpeech component
// // Modify the positionDropdowns function
// // eslint-disable-next-line no-unused-vars
// const positionDropdowns = () => {
//     // Get all dropdown option elements
//     const dropdowns = document.querySelectorAll('.speaker-options');
    
//     dropdowns.forEach(dropdown => {
//       // Always add the options-above class and remove options-below
//       dropdown.classList.remove('options-below');
//       dropdown.classList.add('options-above');
//     });
//   };
//     const [chats, setChats] = useState([]); // Chats loaded from backend
//     const [activeChatIndex, setActiveChatIndex] = useState(null);
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [text, setText] = useState("");
//     const [language, setLanguage] = useState("en");
//     const [speaker1, setSpeaker1] = useState("");
//     const [speaker2, setSpeaker2] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [file, setFile] = useState(null);
//     const [duration1, setDuration1] = useState("");
//     const [darkMode, setDarkMode] = useState(false);
//     const [audioHistory, setAudioHistory] = useState([]);
//     const [isQueuePlaying, setIsQueuePlaying] = useState(false);
//     const [error, setError] = useState(null);
  
//     const speakers = {
//       en: [
//         { name: "John", id: "p374" },
//         { name: "Daniel", id: "p250" },
//         { name: "Michael", id: "p231" },
//         { name: "Sophia", id: "p232" },
//         { name: "Emma", id: "p228" },
//         { name: "Olivia", id: "p243" }
//       ],
//       hi: [
//         { name: "Rahul", id: "v2/hi_speaker_1" },
//         { name: "Amit", id: "v2/hi_speaker_0" },
//         { name: "Emma", id: "v2/hi_speaker_2" },
//         { name: "Daniel", id: "v2/hi_speaker_5" }
//       ],
//       mr :[
//         { name: "Aarohi", id: "mr-IN-AarohiNeural" },
//         { name: "Manohar", id: "mr-IN-ManoharNeural" },
//       ],
//       gu:[
//         { name: "Dhwani", id: "gu-IN-DhwaniNeural" },
//         { name: "Niranjan", id: "gu-IN-NiranjanNeural" },
//       ],
//       es: [
//         { name: "Carlos", id: "es_speaker_1" },
//         { name: "Sofia", id: "es_speaker_2" },
//       ],
//       fr:[
//         { name: "Pierre", id: "fr_speaker_0" },
//         { name: "Marie", id: "fr_speaker_1" },

//       ],
//       de:[
//         { name: "Hans", id: "de_speaker_0" },
//         { name: "Anna", id: "de_speaker_1" },
//       ],
//       it:[
//         { name: "Luca", id: "it_speaker_0" },
//         { name: "Giulia", id: "it_speaker_1" },
//       ],
//       ja:[
//         { name: "Hiroshi", id: "ja_speaker_0" },
//         { name: "Yuki", id: "ja_speaker_1" },
//       ],
//       zh:[
//         { name: "Wei", id: "zh_speaker_0" },
//         { name: "Mei", id: "zh_speaker_1" },
//       ],
//       ru:[
//         { name: "Ivan", id: "ru_speaker_0" },
//         { name: "Anastasia", id: "ru_speaker_1" },
//       ]
      
//     };
  
//     const token = localStorage.getItem("token");
  
  
//     const playSample = async (speakerId) => {
//       try {
//         console.log(`Playing sample for ${speakerId} in ${language}`);
//         const playIconElement = document.querySelector(`.play-icon[data-speaker="${speakerId}"]`);
//         if (!playIconElement) return;
//         const originalContent = playIconElement.innerHTML;
        
//         // First fetch the audio without changing the UI
//         const response = await axios.get(
//           `http://127.0.0.1:5000/sample_voice?language=${language}&voice=${speakerId}`,
//           { responseType: "blob" }
//         );
//         const sampleUrl = window.URL.createObjectURL(new Blob([response.data]));
//         const audio = new Audio(sampleUrl);
        
//         // Set up audio events
//         audio.onplay = () => {
//           // Only create and show visualizer when audio actually starts playing
//           const visualizer = document.createElement('div');
//           visualizer.className = 'mini-visualizer';
          
//           for (let i = 0; i < 7; i++) {
//             const bar = document.createElement('div');
//             bar.className = 'mini-bar';
//             visualizer.appendChild(bar);
//           }
          
//           // Replace play icon with visualizer only when audio starts
//           playIconElement.innerHTML = '';
//           playIconElement.appendChild(visualizer);
//         };
        
//         audio.onended = () => {
//           playIconElement.innerHTML = originalContent;
//         };
        
//         audio.onerror = () => {
//           playIconElement.innerHTML = originalContent;
//           console.error("Audio playback error");
//         };
        
//         // Show loading indicator while waiting for audio to load
//         playIconElement.innerHTML = '<span class="loading-dot">...</span>';
        
//         // Start playing
//         await audio.play();
        
//       } catch (error) {
//         console.error("Error playing sample:", error);
//         // Restore play icon if any error occurs
//         const playIconElement = document.querySelector(`.play-icon[data-speaker="${speakerId}"]`);
//         // eslint-disable-next-line no-undef
//         if (playIconElement) playIconElement.innerHTML = originalContent;
//         alert(`Failed to play sample voice: ${error.message}`);
//       }
//     };
  
//     // ------------------------------------------------------
//     // Load Chats from Backend
//     // ------------------------------------------------------
//     const loadChats = async () => {
//       setError(null);
//       try {
//         if (!token) {
//           setError("Authentication token required. Please log in.");
//           return;
//         }
//         const response = await axios.get("http://localhost:5257/api/chats", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setChats(response.data);
  
//         // If we have existing chats, pick the first; otherwise create a new one
//         if (response.data.length > 0) {
//           setActiveChatIndex(0);
//         } else {
//           // Automatically create a new chat if none exist
//           createNewChat();
//         }
//       } catch (err) {
//         console.error("Error loading chats:", err);
//         setError(err.response?.data?.error || "Failed to load chats");
//       }
//     };
  
//     // ------------------------------------------------------
//     // Create New Chat
//     // ------------------------------------------------------
//     const createNewChat = async () => {
//       setError(null);
//       try {
//         const response = await axios.post(
//           "http://localhost:5257/api/chats/new",
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const newChat = response.data.chat;
//         newChat.title = newChat.title || "New Chat";
  
//         setChats((prevChats) => {
//           const updated = [...prevChats, newChat];
//           setActiveChatIndex(updated.length - 1); // set newly created chat active
//           return updated;
//         });
//       } catch (err) {
//         console.error("Failed to create new chat", err);
//         setError("Failed to create new chat");
//       }
//     };
  
//     // ------------------------------------------------------
//     // Load Chat-Specific Audio History
//     // ------------------------------------------------------
//     const loadChatAudioHistory = async (chatId) => {
//       setError(null);
//       try {
//         if (!token) {
//           setError("Authentication token required. Please log in.");
//           return;
//         }
//         const response = await axios.get(
//           `http://localhost:5257/api/chats/${chatId}/audio`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.data && response.data.history) {
//           setAudioHistory(response.data.history);
//         } else {
//           setAudioHistory([]);
//         }
//       } catch (err) {
//         console.error("Error loading chat audio history:", err);
//         setError(err.response?.data?.error || "Failed to load chat audio history");
//       }
//     };
  
//     useEffect(() => {
//       if (token) {
//         loadChats();
//       }
//       // eslint-disable-next-line
//     }, [token]);
  
//     useEffect(() => {
//       if (activeChatIndex !== null && chats[activeChatIndex]) {
//         loadChatAudioHistory(chats[activeChatIndex].chatId);
//       }
//       // eslint-disable-next-line
//     }, [activeChatIndex, chats]);
  
//     const handleTextChange = (e) => setText(e.target.value);
  
//     const handleFileUpload = (e) => {
//       if (e.target.files.length > 0) {
//         setFile(e.target.files[0]);
//         setText(`Processing file: ${e.target.files[0].name}`);
//       }
//     };
  
//     // ------------------------------------------------------
//     // Handle Sending TTS Request
//     // ------------------------------------------------------
//     const handleSend = async () => {
//       setError(null);
//       if (!token) {
//         setError("Authentication token required. Please log in.");
//         return;
//       }
//       if (!text.trim() && !file) {
//         setError("Please enter text or upload a file.");
//         return;
//       }
//       if (activeChatIndex === null || !chats[activeChatIndex]) {
//         setError("No active chat selected.");
//         return;
//       }
  
//       const currentChat = chats[activeChatIndex];
//       const userQuery = file ? `Uploaded file: ${file.name}` : text;
  
//       // Update local conversation and derive new title
//       const newTitle = userQuery.substring(0, 30) || "Untitled Chat";
//       setChats((prevChats) =>
//         prevChats.map((chat, index) => {
//           if (index === activeChatIndex) {
//             const updatedConversation = [
//               ...(chat.conversation || []),
//               { query: userQuery, audio: null, timestamp: new Date() }
//             ];
//             // Use the user query if title is empty or "New Chat"
//             const updatedTitle =
//               (!chat.title || chat.title === "New Chat") ? newTitle : chat.title;
//             return {
//               ...chat,
//               conversation: updatedConversation,
//               title: updatedTitle
//             };
//           }
//           return chat;
//         })
//       );
  
//       // Call the backend to update the title if needed
//       if ((!currentChat.title || currentChat.title === "New Chat") && userQuery) {
//         try {
//           await axios.put(
//             `http://localhost:5257/api/chats/${currentChat.chatId}`,
//             { title: newTitle },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         } catch (err) {
//           console.error("Failed to update chat title:", err);
//         }
//       }
  
//       setLoading(true);
  
//       const formData = new FormData();
//       formData.append("token", token);
//       if (file) {
//         formData.append("file", file);
//       } else {
//         formData.append("text", text);
//       }
//       formData.append("language", language);
//       if (language === "en" || language === "hi" || language ==="mr" || language==="gu"|| language=="es" || language=="fr" || language=="it" || language=="de" || language=="ja" || language=="zh" || language=="ru") {
//         if (speaker1) formData.append("speaker1", speaker1);
//         if (speaker2) formData.append("speaker2", speaker2);
//       }
//       if (duration1 && duration1 > 0) {
//         formData.append("duration1", duration1);
//       }
//       // Append active chatId to store audio with chat metadata
//       formData.append("chatId", currentChat.chatId);
  
//       try {
//         // 1) Generate speech via Flask
//         const flaskResponse = await axios.post(
//           "http://127.0.0.1:5000/generate",
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//             responseType: "blob"
//           }
//         );
//         const audioBlob = new Blob([flaskResponse.data], { type: "audio/mpeg" });
//         const tempAudioUrl = URL.createObjectURL(audioBlob);
  
//         // Update conversation with the temporary URL
//         setChats((prevChats) =>
//           prevChats.map((chat, index) => {
//             if (
//               index === activeChatIndex &&
//               chat.conversation &&
//               chat.conversation.length > 0
//             ) {
//               const updatedConversation = [...chat.conversation];
//               updatedConversation[updatedConversation.length - 1].audio =
//                 tempAudioUrl;
//               return { ...chat, conversation: updatedConversation };
//             }
//             return chat;
//           })
//         );
  
//         // 2) Store the audio file permanently in Node/Express
//         const storeFormData = new FormData();
//         storeFormData.append("audio", audioBlob, "tts.mp3");
//         storeFormData.append("text", text);
//         storeFormData.append("chatId", currentChat.chatId);
  
//         const storeResponse = await axios.post(
//           "http://localhost:5257/tts-audio",
//           storeFormData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
//         const { fileId } = storeResponse.data;
//         const permanentAudioUrl = `http://localhost:5257/api/tts-audio/${fileId}`;
  
//         // Update conversation with permanent URL
//         setChats((prevChats) =>
//           prevChats.map((chat, index) => {
//             if (
//               index === activeChatIndex &&
//               chat.conversation &&
//               chat.conversation.length > 0
//             ) {
//               const updatedConversation = [...chat.conversation];
//               updatedConversation[updatedConversation.length - 1].audio =
//                 permanentAudioUrl;
//               return { ...chat, conversation: updatedConversation };
//             }
//             return chat;
//           })
//         );
  
//         // Refresh chat-specific audio history
//         loadChatAudioHistory(currentChat.chatId);
//       } catch (err) {
//         console.error("Error generating/storing speech:", err);
//         setError(
//           err.response?.data?.error || "Failed to generate or store speech"
//         );
//       } finally {
//         setLoading(false);
//         setText("");
//         setFile(null);
//       }
//     };
  
//     // Build array of streaming URLs for sequential playback using audioHistory
//     // (Remove the "?token=" part so we don't double-append it)
//     const queueAudioList = audioHistory.map(
//       (file) => `http://localhost:5257/api/tts-audio/${file._id}`
//     );
  
//     const activeChat = activeChatIndex !== null ? chats[activeChatIndex] : null;
  
//     return (
//       <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
//         {/* Left Sidebar */}
//         <div
//           className={`chat-sidebar slide-in ${
//             sidebarOpen ? "open" : "closed"
//           }`}
//         >
//           <div className="sidebar-header">
//             <h3>Chats</h3>
//             <button onClick={createNewChat} className="new-chat-btn">
//               <PlusCircle size={16} /> New Chat
//             </button>
//           </div>
//           <div className="chat-list">
//             {chats.length === 0 ? (
//               <p>No chats found.</p>
//             ) : (
//               chats.map((chat, index) => {
//                 const displayTitle =
//                   chat.title && chat.title.trim() !== ""
//                     ? chat.title
//                     : chat.chatId;
//                 return (
//                   <div
//                     key={chat.chatId}
//                     className={`chat-item ${
//                       activeChatIndex === index ? "active" : ""
//                     } fade-in`}
//                     onClick={() => setActiveChatIndex(index)}
//                   >
//                     {displayTitle}
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
  
//         {/* Toggle Sidebar Button */}
//         <button
//           className="sidebar-toggle-btn"
//           onClick={() => setSidebarOpen((prev) => !prev)}
//         >
//           {sidebarOpen ? <ArrowLeft size={16} /> : <Menu size={16} />}
//         </button>
  
//         {/* Main Content */}
//         <div className="main-content fade-in">
//           <div className="navbar">
//             <h2>{activeChat ? activeChat.title || activeChat.chatId : "Chat"}</h2>
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="dark-mode-toggle"
//             >
//               {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//             </button>
//           </div>
  
//           {error && (
//             <div className="error-banner fade-in">
//               <p>{error}</p>
//               <button onClick={() => setError(null)}>×</button>
//             </div>
//           )}
  
//           {/* REVISED LAYOUT: Main container with flex column */}
//           <div className="chat-layout">
//             {/* 1. Scrollable Audio Messages Section (top) */}
//             <div className="audio-messages-container">
//               {/* Audio History Section */}
//               {audioHistory.length > 0 && (
//                 <div className="audio-history">
//                   <h3>Audio History</h3>
//                   <button
//                     onClick={() => setIsQueuePlaying(!isQueuePlaying)}
//                     className="play-all-btn"
//                     disabled={queueAudioList.length === 0}
//                   >
//                     {isQueuePlaying ? "Stop Queue" : "Play All"}
//                   </button>
//                   <div className="history-grid">
//                     {audioHistory.map((file) => {
//                       const audioUrl = `http://localhost:5257/api/tts-audio/${file._id}`;
//                       return (
//                         <div key={file._id} className="history-item">
//                           <p className="history-timestamp">
//                             {new Date(file.uploadDate).toLocaleString()}
//                           </p>
//                           <p className="requested-text">
//                             Query: {file.requestedText}
//                           </p>
//                           <AudioPlayer src={audioUrl} />
//                         </div>
//                       );
//                     })}
//                   </div>
//                   {isQueuePlaying && queueAudioList.length > 0 && (
//                     <div className="queue-player">
//                       <h3>Sequential Playback</h3>
//                       <SequentialAudioPlayer
//                         audioList={queueAudioList}
//                         onQueueEnd={() => setIsQueuePlaying(false)}
//                       />

// </div>
//                 )}
//               </div>
//             )}

//             {/* Chat Messages Display */}
//             {activeChat &&
//               activeChat.conversation &&
//               activeChat.conversation.map((pair, index) => (
//                 <div key={index} className="conversation-pair fade-in">
//                   <div className="user-message">
//                     <p>{pair.query}</p>
//                   </div>
//                   <div className="assistant-message">
//                     {pair.audio ? (
//                       <AudioPlayer src={pair.audio} />
//                     ) : (
//                       <div className="loading-audio">Audio pending...</div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//             {loading && (
//               <div className="chat-bubble assistant fade-in">
//                 <p>Generating speech...</p>
//               </div>
//             )}
//           </div>

//           {/* 2. Fixed Chat Input at the bottom */}
//           <div className="chat-input-fixed">
//             <textarea
//               value={text}
//               onChange={handleTextChange}
//               placeholder="Type your message here..."
//               disabled={loading}
//             />
//             <div className="file-upload-wrapper">
//               <input
//                 type="file"
//                 id="file-upload"
//                 accept=".txt,.pdf"
//                 onChange={handleFileUpload}
//                 disabled={loading}
//               />
//               <label htmlFor="file-upload" className="file-upload-label">
//                 {file ? file.name : "Upload File"}
//               </label>
//             </div>
//             <div className="input-controls">
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 disabled={loading}
//               >
//               <option value="hi">Hindi</option>
//               <option value="mr">Marathi</option>
//               <option value="en">English</option>
//               <option value="gu">Gujarati</option>
//               <option value="es">Spanish</option>
//               <option value="fr">French</option>
//               <option value="de">German</option>
//               <option value="it">Italian</option>
//               <option value="ja">Japanese</option>
//               <option value="zh">Chinese</option>
//               <option value="ru">Russian</option>

//               </select>
//               <select
//                 value={duration1 || ""}
//                 onChange={(e) =>
//                   setDuration1(
//                     e.target.value === "" ? null : Number(e.target.value)
//                   )
//                 }
//                 disabled={loading}
//               >
//                 <option value="">Select Duration</option>
//                 <option value={30}>30 seconds</option>
//                 <option value={60}>1 minute</option>
//                 <option value={120}>2 minutes</option>
//                 <option value={180}>3 minutes</option>
//               </select>
//               {(language === "en" || language === "hi" || language=="mr" || language=="gu" || language=="es" || language=="fr" || language=="de" || language=="it" || language=="ja" || language=="zh" || language=="ru") && (
//                 <>
// <div className="speaker-selection">
//   <label>Speaker 1:</label>
//   <div className="speaker-dropdown" >
//     <select value={speaker1} onChange={(e) => setSpeaker1(e.target.value)}>
//       <option value="">Select Speaker 1</option>
//       {speakers[language] &&
//         speakers[language].map((sp) => (
//           <option key={sp.id} value={sp.id}>
//             {sp.name}
//           </option>
//         ))}
//     </select>
    
//     <div className="speaker-options options-above">
//       {speakers[language] &&
//         speakers[language].map((sp) => (
//           <div 
//             key={sp.id} 
//             className={`speaker-option ${speaker1 === sp.id ? "selected" : ""}`}
//           >
//             <span onClick={() => setSpeaker1(sp.id)}>{sp.name}</span>
//             <span 
//               className="play-icon" 
//               data-speaker={sp.id}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 playSample(sp.id);
//               }}
//             >
//               ▶
//             </span>
//           </div>
//         ))}
//     </div>
//   </div>
// </div>
                  
//                   <div className="speaker-selection">
//                     <label>Speaker 2:</label>
//                     <div className="speaker-dropdown">
//                       <select value={speaker2} onChange={(e) => setSpeaker2(e.target.value)}>
//                         <option value="">Select Speaker 2</option>
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <option key={sp.id} value={sp.id}>
//                               {sp.name}
//                             </option>
//                           ))}
//                       </select>
//                       <div className="speaker-options options-above">
//                       {/* <div className="speaker-options"> */}
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <div 
//                               key={sp.id} 
//                               className={`speaker-option ${speaker2 === sp.id ? "selected" : ""}`}
//                             >
//                               <span onClick={() => setSpeaker2(sp.id)}>{sp.name}</span>
//                               <span 
//                                 className="play-icon" 
//                                 data-speaker={sp.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   playSample(sp.id);
//                                 }}
//                               >
//                                 ▶
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                   {/* </div> */}
//                 </>
//               )}
//               <button onClick={handleSend} disabled={loading}>
//                 {loading ? "Generating..." : "Send"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextToSpeech;


// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Menu,
  ArrowLeft,
  PlusCircle,
  SkipBack,
  SkipForward,
  Sun,
  Moon,
  Download,
} from "lucide-react";
import "./TextToSpeech.css";

// ------------------------------------------------------
// Utility: Format seconds as mm:ss
// ------------------------------------------------------
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
};

// ------------------------------------------------------
// AudioPlayer Component (Custom Controls for Audio)
// ------------------------------------------------------
const AudioPlayer = ({ src }) => {
  // 1) Always declare hooks at the top
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const token = localStorage.getItem("token");

  // 2) Derive effectiveSrc
  let effectiveSrc = src;
  if (src && token && !src.startsWith("blob:") && !src.includes("token=")) {
    effectiveSrc = src.includes("?")
      ? `${src}&token=${token}`
      : `${src}?token=${token}`;
  }

  // 3) Then do early return
  if (!effectiveSrc) {
    return <div>Loading audio...</div>;
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration || 0;
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        dur
      );
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="audio-player fade-in">
      <audio
        ref={audioRef}
        src={effectiveSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={effectiveSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="audio-controls">
        <button onClick={togglePlay} className="control-btn">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={skipBackward} className="control-btn">
          <SkipBack size={16} />
        </button>
        <button onClick={skipForward} className="control-btn">
          <SkipForward size={16} />
        </button>
        <button onClick={toggleMute} className="control-btn">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <a href={effectiveSrc} download className="control-btn">
          <Download size={16} />
        </a>
      </div>
      <div className="time-stamps">
        <span className="current-time">{formatTime(currentTime)}</span>
        <span className="duration-time">{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="audio-slider"
      />
    </div>
  );
};

// ------------------------------------------------------
// SequentialAudioPlayer Component (for Queue Playback)
// ------------------------------------------------------
const SequentialAudioPlayer = ({ audioList, onQueueEnd }) => {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && audioList.length > 0) {
      audioRef.current.src = audioList[currentIndex];
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.error("Play failed:", err));
      }
    }
  }, [currentIndex, audioList, isPlaying]);

  const handleEnded = () => {
    if (currentIndex < audioList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsPlaying(false);
      if (onQueueEnd) onQueueEnd();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play failed:", err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div className="sequential-audio-player">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="player-controls">
        <button onClick={togglePlay} className="control-btn">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="player-status">
          Playing {currentIndex + 1} of {audioList.length}
        </span>
        <div className="progress-bar">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------
// Main TextToSpeech Component
// ------------------------------------------------------
const TextToSpeech = () => {
  // Add this function in your TextToSpeech component
  // Modify the positionDropdowns function
  // eslint-disable-next-line no-unused-vars
  const positionDropdowns = () => {
    // Get all dropdown option elements
    const dropdowns = document.querySelectorAll(".speaker-options");

    dropdowns.forEach((dropdown) => {
      // Always add the options-above class and remove options-below
      dropdown.classList.remove("options-below");
      dropdown.classList.add("options-above");
    });
  };

  const [chats, setChats] = useState([]); // Chats loaded from backend
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [speaker1, setSpeaker1] = useState("");
  const [speaker2, setSpeaker2] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [duration1, setDuration1] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [audioHistory, setAudioHistory] = useState([]);
  const [isQueuePlaying, setIsQueuePlaying] = useState(false);
  const [error, setError] = useState(null);

  const speakers = {
    en: [
      { name: "John", id: "p374" },
      { name: "Daniel", id: "p250" },
      { name: "Michael", id: "p231" },
      { name: "Sophia", id: "p232" },
      { name: "Emma", id: "p228" },
      { name: "Olivia", id: "p243" },
    ],
    hi: [
      { name: "Rahul", id: "v2/hi_speaker_1" },
      { name: "Amit", id: "v2/hi_speaker_0" },
      { name: "Sita", id: "v2/hi_speaker_2" },
      { name: "Priya", id: "v2/hi_speaker_5" },
    ],
    mr: [
      { name: "Aarohi", id: "mr-IN-AarohiNeural" },
      { name: "Manohar", id: "mr-IN-ManoharNeural" },
    ],
    gu: [
      { name: "Dhwani", id: "gu-IN-DhwaniNeural" },
      { name: "Niranjan", id: "gu-IN-NiranjanNeural" },
    ],
    es: [
      { name: "Carlos", id: "v2/es_speaker_0" },
      { name: "Sofia", id: "v2/es_speaker_8" },
      { name: "Diego", id: "v2/es_speaker_3" },
      { name: "Lucia", id: "v2/es_speaker_9" }
    ],
    fr: [
      { name: "Pierre", id: "v2/fr_speaker_4" },
      { name: "Marie", id: "v2/fr_speaker_5" },
      { name: "Julien", id: "v2/fr_speaker_3" },
      { name: "Camille", id: "v2/fr_speaker_2" }
    ],
    de: [
      { name: "Hans", id: "v2/de_speaker_0" },
      { name: "Anna", id: "v2/de_speaker_3" },
      { name: "Fritz", id: "v2/de_speaker_2" },
      { name: "Greta", id: "v2/de_speaker_8" }
    ],
    it: [
      { name: "Luca", id: "v2/it_speaker_0" },
      { name: "Giulia", id: "v2/it_speaker_2" },
      { name: "Marco", id: "v2/it_speaker_3" },
      { name: "Francesca", id: "v2/it_speaker_7" }
    ],
    ja: [
      { name: "Hiroshi", id: "v2/ja_speaker_2" },
      { name: "Yuki", id: "v2/ja_speaker_4" },
      { name: "Takumi", id: "v2/ja_speaker_6" },
      { name: "Sakura", id: "v2/ja_speaker_8" }
    ],
    zh: [
      { name: "Wei", id: "v2/zh_speaker_0" },
      { name: "Mei", id: "v2/zh_speaker_4" },
      { name: "Li", id: "v2/zh_speaker_8" },
      { name: "Xia", id: "v2/zh_speaker_9" }
    ],
     ru: [
      { name: "Ivan", id: "v2/ru_speaker_0" },
      { name: "Anastasia", id: "v2/ru_speaker_5" },
      { name: "Dmitry", id: "v2/ru_speaker_1" },
      { name: "Ekaterina", id: "v2/ru_speaker_9" }
    ],
    pt: [
      { name: "João", id: "v2/pt_speaker_0" },
      { name: "Miguel", id: "v2/pt_speaker_1" },
      { name: "Carlos", id: "v2/pt_speaker_2" },
      { name: "Rafael", id: "v2/pt_speaker_3" }
    ],
    ko: [
      { name: "Min-Jun", id: "v2/ko_speaker_0" },
      { name: "Ji-Young", id: "v2/ko_speaker_1" },
      { name: "Seung-Hyun", id: "v2/ko_speaker_2" },
      { name: "Hye-Jin", id: "v2/ko_speaker_3" }
    ],
    tr: [
      { name: "Mehmet", id: "v2/tr_speaker_0" },
      { name: "Elif", id: "v2/tr_speaker_4" },
      { name: "Ahmet", id: "v2/tr_speaker_8" },
      { name: "Zeynep", id: "v2/tr_speaker_5" }
    ],
  };
  

  const token = localStorage.getItem("token");

  // const playSample = async (speakerId) => {
  //   try {
  //     console.log(`Playing sample for ${speakerId} in ${language}`);
  //     const playIconElement = document.querySelector(
  //       `.play-icon[data-speaker="${speakerId}"]`
  //     );
  //     if (!playIconElement) return;
  //     const originalContent = playIconElement.innerHTML;

  //     // First fetch the audio without changing the UI
  //     const response = await axios.get(
  //       `http://127.0.0.1:5000/sample_voice?language=${language}&voice=${speakerId}`,
  //       { responseType: "blob" }
  //     );
  //     const sampleUrl = window.URL.createObjectURL(new Blob([response.data]));
  //     const audio = new Audio(sampleUrl);

  //     // Set up audio events
  //     audio.onplay = () => {
  //       // Only create and show visualizer when audio actually starts playing
  //       const visualizer = document.createElement("div");
  //       visualizer.className = "mini-visualizer";

  //       for (let i = 0; i < 7; i++) {
  //         const bar = document.createElement("div");
  //         bar.className = "mini-bar";
  //         visualizer.appendChild(bar);
  //       }

  //       // Replace play icon with visualizer only when audio starts
  //       playIconElement.innerHTML = "";
  //       playIconElement.appendChild(visualizer);
  //     };

  //     audio.onended = () => {
  //       playIconElement.innerHTML = originalContent;
  //     };

  //     audio.onerror = () => {
  //       playIconElement.innerHTML = originalContent;
  //       console.error("Audio playback error");
  //     };

  //     // Show loading indicator while waiting for audio to load
  //     playIconElement.innerHTML = '<span class="loading-dot">...</span>';

  //     // Start playing
  //     await audio.play();
  //   } catch (error) {
  //     console.error("Error playing sample:", error);
  //     // Restore play icon if any error occurs
  //     const playIconElement = document.querySelector(
  //       `.play-icon[data-speaker="${speakerId}"]`
  //     );
  //     if (playIconElement) playIconElement.innerHTML = "▶";
  //     alert(`Failed to play sample voice: ${error.message}`);
  //   }
  // };


  const playSample = async (speakerId) => {
    try {
      console.log(`Playing sample for ${speakerId} in ${language}`);
      // Ensure correct selection of play icon
      const playIconElements = document.querySelectorAll(
        `.play-icon[data-speaker="${speakerId}"]`
      );
      if (!playIconElements.length) return;

      playIconElements.forEach((playIconElement) => {
        const originalContent = playIconElement.innerHTML;
        const sampleUrl = `/assets/Voices/sample_voice_${language}_${speakerId.replace('/','_')}.wav`;
        const audio = new Audio(sampleUrl);

        audio.onplay = () => {
          const visualizer = document.createElement("div");
          visualizer.className = "mini-visualizer";
          for (let i = 0; i < 7; i++) {
            const bar = document.createElement("div");
            bar.className = "mini-bar";
            visualizer.appendChild(bar);
          }
          playIconElement.innerHTML = "";
          playIconElement.appendChild(visualizer);
        };

        audio.onended = () => {
          playIconElement.innerHTML = originalContent;
        };

        audio.onerror = () => {
          playIconElement.innerHTML = originalContent;
          console.error("Audio playback error");
        };

        playIconElement.innerHTML = '<span className="loading-dot">...</span>';
        audio.play().catch(() => {
          playIconElement.innerHTML = originalContent;
        });
      });
    } catch (error) {
      console.error("Error playing sample:", error);
    }
  };
  
  // ------------------------------------------------------
  // Load Chats from Backend
  // ------------------------------------------------------
  const loadChats = async () => {
    setError(null);
    try {
      if (!token) {
        setError("Authentication token required. Please log in.");
        return;
      }
      const response = await axios.get("http://localhost:5257/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data);

      // If we have existing chats, pick the first; otherwise create a new one
      if (response.data.length > 0) {
        setActiveChatIndex(0);
      } else {
        // Automatically create a new chat if none exist
        createNewChat();
      }
    } catch (err) {
      console.error("Error loading chats:", err);
      setError(err.response?.data?.error || "Failed to load chats");
    }
  };

  // ------------------------------------------------------
  // Create New Chat
  // ------------------------------------------------------
  const createNewChat = async () => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5257/api/chats/new",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newChat = response.data.chat;
      newChat.title = newChat.title || "New Chat";

      setChats((prevChats) => {
        const updated = [...prevChats, newChat];
        setActiveChatIndex(updated.length - 1); // set newly created chat active
        return updated;
      });
    } catch (err) {
      console.error("Failed to create new chat", err);
      setError("Failed to create new chat");
    }
  };

  // ------------------------------------------------------
  // Load Chat-Specific Audio History
  // ------------------------------------------------------
  const loadChatAudioHistory = async (chatId) => {
    setError(null);
    try {
      if (!token) {
        setError("Authentication token required. Please log in.");
        return;
      }
      const response = await axios.get(
        `http://localhost:5257/api/chats/${chatId}/audio`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.history) {
        setAudioHistory(response.data.history);
      } else {
        setAudioHistory([]);
      }
    } catch (err) {
      console.error("Error loading chat audio history:", err);
      setError(err.response?.data?.error || "Failed to load chat audio history");
    }
  };

  useEffect(() => {
    if (token) {
      loadChats();
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (activeChatIndex !== null && chats[activeChatIndex]) {
      loadChatAudioHistory(chats[activeChatIndex].chatId);
    }
    // eslint-disable-next-line
  }, [activeChatIndex, chats]);

  const handleTextChange = (e) => setText(e.target.value);

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setText(`Processing file: ${e.target.files[0].name}`);
    }
  };

  // ------------------------------------------------------
  // Handle Sending TTS Request
  // ------------------------------------------------------
  const handleSend = async () => {
    setError(null);
    if (!token) {
      setError("Authentication token required. Please log in.");
      return;
    }
    if (!text.trim() && !file) {
      setError("Please enter text or upload a file.");
      return;
    }
    if (activeChatIndex === null || !chats[activeChatIndex]) {
      setError("No active chat selected.");
      return;
    }

    const currentChat = chats[activeChatIndex];
    const userQuery = file ? `Uploaded file: ${file.name}` : text;

    // Update local conversation and derive new title
    const newTitle = userQuery.substring(0, 30) || "Untitled Chat";
    setChats((prevChats) =>
      prevChats.map((chat, index) => {
        if (index === activeChatIndex) {
          const updatedConversation = [
            ...(chat.conversation || []),
            { query: userQuery, audio: null, timestamp: new Date() },
          ];
          // Use the user query if title is empty or "New Chat"
          const updatedTitle =
            !chat.title || chat.title === "New Chat" ? newTitle : chat.title;
          return {
            ...chat,
            conversation: updatedConversation,
            title: updatedTitle,
          };
        }
        return chat;
      })
    );

    // Call the backend to update the title if needed
    if ((!currentChat.title || currentChat.title === "New Chat") && userQuery) {
      try {
        await axios.put(
          `http://localhost:5257/api/chats/${currentChat.chatId}`,
          { title: newTitle },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to update chat title:", err);
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("token", token);
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("text", text);
    }
    formData.append("language", language);
    if (
      language === "en" ||
      language === "hi" ||
      language === "mr" ||
      language === "gu" ||
      language === "es" ||
      language === "fr" ||
      language === "de" ||
      language === "it" ||
      language === "ja" ||
      language === "zh" ||
      language === "ru" ||
      language === "pt" ||
      language === "ko" ||
      language === "tr"
    )
     {
      if (speaker1) formData.append("speaker1", speaker1);
      if (speaker2) formData.append("speaker2", speaker2);
    }
    if (duration1 && duration1 > 0) {
      formData.append("duration1", duration1);
    }
    // Append active chatId to store audio with chat metadata
    formData.append("chatId", currentChat.chatId);

    try {
      // 1) Generate speech via Flask
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5000/generate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );
      const audioBlob = new Blob([flaskResponse.data], { type: "audio/mpeg" });
      const tempAudioUrl = URL.createObjectURL(audioBlob);

      // Update conversation with the temporary URL
      setChats((prevChats) =>
        prevChats.map((chat, index) => {
          if (
            index === activeChatIndex &&
            chat.conversation &&
            chat.conversation.length > 0
          ) {
            const updatedConversation = [...chat.conversation];
            updatedConversation[updatedConversation.length - 1].audio =
              tempAudioUrl;
            return { ...chat, conversation: updatedConversation };
          }
          return chat;
        })
      );

      // 2) Store the audio file permanently in Node/Express
      const storeFormData = new FormData();
      storeFormData.append("audio", audioBlob, "tts.mp3");
      storeFormData.append("text", text);
      storeFormData.append("chatId", currentChat.chatId);

      const storeResponse = await axios.post(
        "http://localhost:5257/tts-audio",
        storeFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { fileId } = storeResponse.data;
      const permanentAudioUrl = `http://localhost:5257/api/tts-audio/${fileId}`;

      // Update conversation with permanent URL
      setChats((prevChats) =>
        prevChats.map((chat, index) => {
          if (
            index === activeChatIndex &&
            chat.conversation &&
            chat.conversation.length > 0
          ) {
            const updatedConversation = [...chat.conversation];
            updatedConversation[updatedConversation.length - 1].audio =
              permanentAudioUrl;
            return { ...chat, conversation: updatedConversation };
          }
          return chat;
        })
      );

      // Refresh chat-specific audio history
      loadChatAudioHistory(currentChat.chatId);
    } catch (err) {
      console.error("Error generating/storing speech:", err);
      setError(err.response?.data?.error || "Failed to generate or store speech");
    } finally {
      setLoading(false);
      setText("");
      setFile(null);
    }
  };

  // Build array of streaming URLs for sequential playback using audioHistory
  const queueAudioList = audioHistory.map(
    (file) => `http://localhost:5257/api/tts-audio/${file._id}`
  );

  const activeChat = activeChatIndex !== null ? chats[activeChatIndex] : null;

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Left Sidebar */}
      <div
        className={`chat-sidebar slide-in ${sidebarOpen ? "open" : "closed"}`}
      >
        <div className="sidebar-header">
          <h3>Chats</h3>
          <button onClick={createNewChat} className="new-chat-btn">
            <PlusCircle size={16} /> New Chat
          </button>
        </div>
        <div className="chat-list">
          {chats.length === 0 ? (
            <p>No chats found.</p>
          ) : (
            chats.map((chat, index) => {
              const displayTitle =
                chat.title && chat.title.trim() !== ""
                  ? chat.title
                  : chat.chatId;
              return (
                <div
                  key={chat.chatId}
                  className={`chat-item ${
                    activeChatIndex === index ? "active" : ""
                  } fade-in`}
                  onClick={() => setActiveChatIndex(index)}
                >
                  {displayTitle}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        {sidebarOpen ? <ArrowLeft size={16} /> : <Menu size={16} />}
      </button>

      {/* Main Content */}
      <div className="main-content fade-in">
        <div className="navbar">
          <h2>{activeChat ? activeChat.title || activeChat.chatId : "Chat"}</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="dark-mode-toggle"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {error && (
          <div className="error-banner fade-in">
            <p>{error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* REVISED LAYOUT: Main container with flex column */}
        <div className="chat-layout">
          {/* 1. Scrollable Audio Messages Section (top) */}
          <div className="audio-messages-container">
            {/* Audio History Section */}
            {audioHistory.length > 0 && (
              <div className="audio-history">
                <h3>Audio History</h3>
                <button
                  onClick={() => setIsQueuePlaying(!isQueuePlaying)}
                  className="play-all-btn"
                  disabled={queueAudioList.length === 0}
                >
                  {isQueuePlaying ? "Stop Queue" : "Play All"}
                </button>
                <div className="history-grid">
                  {audioHistory.map((file) => {
                    const audioUrl = `http://localhost:5257/api/tts-audio/${file._id}`;
                    return (
                      <div key={file._id} className="history-item">
                        <p className="history-timestamp">
                          {new Date(file.uploadDate).toLocaleString()}
                        </p>
                        <p className="requested-text">
                          Query: {file.requestedText}
                        </p>
                        <AudioPlayer src={audioUrl} />
                      </div>
                    );
                  })}
                </div>
                {isQueuePlaying && queueAudioList.length > 0 && (
                  <div className="queue-player">
                    <h3>Sequential Playback</h3>
                    <SequentialAudioPlayer
                      audioList={queueAudioList}
                      onQueueEnd={() => setIsQueuePlaying(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Chat Messages Display */}
            {activeChat &&
              activeChat.conversation &&
              activeChat.conversation.map((pair, index) => (
                <div key={index} className="conversation-pair fade-in">
                  <div className="user-message">
                    <p>{pair.query}</p>
                  </div>
                  <div className="assistant-message">
                    {pair.audio ? (
                      <AudioPlayer src={pair.audio} />
                    ) : (
                      <div className="loading-audio">Audio pending...</div>
                    )}
                  </div>
                </div>
              ))}

            {loading && (
              <div className="chat-bubble assistant fade-in">
                <p>Generating speech...</p>
              </div>
            )}
          </div>

          {/* 2. Fixed Chat Input at the bottom */}
          <div className="chat-input-fixed">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                disabled={loading}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                {file ? file.name : "Upload File"}
              </label>
            </div>
            <div className="input-controls">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
              >
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="en">English</option>
                <option value="gu">Gujarati</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
                <option value="ru">Russian</option>
                <option value="pt">Portuguese</option>
                <option value="ko">Korean</option>
                <option value="tr">Turkish</option>

              </select>
              <select
                value={duration1 || ""}
                onChange={(e) =>
                  setDuration1(e.target.value === "" ? null : Number(e.target.value))
                }
                disabled={loading}
              >
                <option value="">Select Duration</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={180}>3 minutes</option>
              </select>
              {(language === "en" ||
                language === "hi" ||
                language === "mr" ||
                language === "gu" ||
                language === "es" ||
                language === "fr" ||
                language === "de" ||
                language === "it" ||
                language === "ja" ||
                language === "zh" ||
                language === "ru" ||
                language === "pt" ||
                language === "ko" ||
                language === "tr") && (
                <>
                  <div className="speaker-selection">
                    <label>Speaker 1:</label>
                    <div className="speaker-dropdown">
                      <select
                        value={speaker1}
                        onChange={(e) => setSpeaker1(e.target.value)}
                      >
                        <option value="">Select Speaker 1</option>
                        {speakers[language] &&
                          speakers[language].map((sp) => (
                            <option key={sp.id} value={sp.id}>
                              {sp.name}
                            </option>
                          ))}
                      </select>

                      <div className="speaker-options options-above">
                        {speakers[language] &&
                          speakers[language].map((sp) => (
                            <div
                              key={sp.id}
                              className={`speaker-option ${
                                speaker1 === sp.id ? "selected" : ""
                              }`}
                            >
                              <span onClick={() => setSpeaker1(sp.id)}>
                                {sp.name}
                              </span>
                              <span
                                className="play-icon"
                                data-speaker={sp.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSample(sp.id);
                                }}
                              >
                                ▶
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="speaker-selection">
                    <label>Speaker 2:</label>
                    <div className="speaker-dropdown">
                      <select
                        value={speaker2}
                        onChange={(e) => setSpeaker2(e.target.value)}
                      >
                        <option value="">Select Speaker 2</option>
                        {speakers[language] &&
                          speakers[language].map((sp) => (
                            <option key={sp.id} value={sp.id}>
                              {sp.name}
                            </option>
                          ))}
                      </select>
                      <div className="speaker-options options-above">
                        {speakers[language] &&
                          speakers[language].map((sp) => (
                            <div
                              key={sp.id}
                              className={`speaker-option ${
                                speaker2 === sp.id ? "selected" : ""
                              }`}
                            >
                              <span onClick={() => setSpeaker2(sp.id)}>
                                {sp.name}
                              </span>
                              <span
                                className="play-icon"
                                data-speaker={sp.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSample(sp.id);
                                }}
                              >
                                ▶
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <button onClick={handleSend} disabled={loading}>
                {loading ? "Generating..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------
// PropTypes for AudioPlayer and SequentialAudioPlayer
// ------------------------------------------------------
AudioPlayer.propTypes = {
  src: PropTypes.string,
};

SequentialAudioPlayer.propTypes = {
  audioList: PropTypes.arrayOf(PropTypes.string),
  onQueueEnd: PropTypes.func,
};

export default TextToSpeech;



// import  { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Menu,
//   ArrowLeft,
//   PlusCircle,
//   SkipBack,
//   SkipForward,
//   Sun,
//   Moon,
//   Download
// } from "lucide-react";
// import "./TextToSpeech.css";

// // ------------------------------------------------------
// // Utility: Format seconds as mm:ss
// // ------------------------------------------------------
// const formatTime = (seconds) => {
//   if (!seconds || isNaN(seconds)) return "00:00";
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
// };

// // ------------------------------------------------------
// // AudioPlayer Component (Custom Controls for Audio)
// // ------------------------------------------------------
// const AudioPlayer = ({ src }) => {
//   const token = localStorage.getItem("token");

//   // Only append token if the URL is not a Blob and doesn't already have ?token= or &token=
//   let effectiveSrc = src;
//   if (src && token && !src.startsWith("blob:") && !src.includes("token=")) {
//     effectiveSrc = src.includes("?")
//       ? `${src}&token=${token}`
//       : `${src}?token=${token}`;
//   }

//   if (!effectiveSrc) return <div>Loading audio...</div>;

//   const audioRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     // This ensures our audio ref is always updated with the latest src
//     if (audioRef.current && effectiveSrc) {
//       audioRef.current.load();
//     }
//   }, [effectiveSrc]);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const skipBackward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = Math.max(
//         audioRef.current.currentTime - 10,
//         0
//       );
//     }
//   };

//   const skipForward = () => {
//     if (audioRef.current) {
//       const dur = audioRef.current.duration || 0;
//       audioRef.current.currentTime = Math.min(
//         audioRef.current.currentTime + 10,
//         dur
//       );
//     }
//   };

//   const toggleMute = () => {
//     if (!audioRef.current) return;
//     audioRef.current.muted = !audioRef.current.muted;
//     setIsMuted(audioRef.current.muted);
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   const handleSeek = (e) => {
//     const seekTime = Number(e.target.value);
//     if (audioRef.current) {
//       audioRef.current.currentTime = seekTime;
//       setCurrentTime(seekTime);
//     }
//   };

//   return (
//     <div className="audio-player fade-in">
//       <audio
//         ref={audioRef}
//         src={effectiveSrc}
//         preload="metadata"
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//         onEnded={() => setIsPlaying(false)}
//       >
//         <source src={effectiveSrc} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="audio-controls">
//         <button onClick={togglePlay} className="control-btn">
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//         <button onClick={skipBackward} className="control-btn">
//           <SkipBack size={16} />
//         </button>
//         <button onClick={skipForward} className="control-btn">
//           <SkipForward size={16} />
//         </button>
//         <button onClick={toggleMute} className="control-btn">
//           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//         </button>
//         <a href={effectiveSrc} download className="control-btn">
//           <Download size={16} />
//         </a>
//       </div>
//       <div className="time-stamps">
//         <span className="current-time">{formatTime(currentTime)}</span>
//         <span className="duration-time">{formatTime(duration)}</span>
//       </div>
//       <input
//         type="range"
//         min="0"
//         max={duration || 0}
//         value={currentTime}
//         onChange={handleSeek}
//         className="audio-slider"
//       />
//     </div>
//   );
// };

// // ------------------------------------------------------
// // SequentialAudioPlayer Component (for Queue Playback)
// // ------------------------------------------------------
// const SequentialAudioPlayer = ({ audioList = [], onQueueEnd = () => {} }) => {
//   const audioRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     if (audioRef.current && audioList.length > 0) {
//       audioRef.current.src = audioList[currentIndex];
//       if (isPlaying) {
//         audioRef.current
//           .play()
//           .catch((err) => console.error("Play failed:", err));
//       }
//     }
//   }, [currentIndex, audioList, isPlaying]);

//   const handleEnded = () => {
//     if (currentIndex < audioList.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setIsPlaying(false);
//       onQueueEnd();
//     }
//   };

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (audioRef.current.paused) {
//       audioRef.current
//         .play()
//         .then(() => setIsPlaying(true))
//         .catch((err) => console.error("Play failed:", err));
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   return (
//     <div className="sequential-audio-player">
//       <audio
//         ref={audioRef}
//         onEnded={handleEnded}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//       />
//       <div className="player-controls">
//         <button onClick={togglePlay} className="control-btn">
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//         <span className="player-status">
//           Playing {currentIndex + 1} of {audioList.length}
//         </span>
//         <div className="progress-bar">
//           <span>{formatTime(currentTime)}</span>
//           <span>{formatTime(duration)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ------------------------------------------------------
// // Main TextToSpeech Component
// // ------------------------------------------------------
// const TextToSpeech = () => {
//   // Position dropdowns function
//   const positionDropdowns = () => {
//     // Get all dropdown option elements
//     const dropdowns = document.querySelectorAll('.speaker-options');
    
//     dropdowns.forEach(dropdown => {
//       // Always add the options-above class and remove options-below
//       dropdown.classList.remove('options-below');
//       dropdown.classList.add('options-above');
//     });
//   };

//   const [chats, setChats] = useState([]); // Chats loaded from backend
//   const [activeChatIndex, setActiveChatIndex] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [text, setText] = useState("");
//   const [language, setLanguage] = useState("en");
//   const [speaker1, setSpeaker1] = useState("");
//   const [speaker2, setSpeaker2] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);
//   const [duration1, setDuration1] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const [audioHistory, setAudioHistory] = useState([]);
//   const [isQueuePlaying, setIsQueuePlaying] = useState(false);
//   const [error, setError] = useState(null);

//   const speakers = {
//     en: [
//       { name: "John", id: "p374" },
//       { name: "Daniel", id: "p250" },
//       { name: "Michael", id: "p231" },
//       { name: "Sophia", id: "p232" },
//       { name: "Emma", id: "p228" },
//       { name: "Olivia", id: "p243" }
//     ],
//     hi: [
//       { name: "Rahul", id: "v2/hi_speaker_1" },
//       { name: "Amit", id: "v2/hi_speaker_0" },
//       { name: "Emma", id: "v2/hi_speaker_2" },
//       { name: "Daniel", id: "v2/hi_speaker_5" }
//     ],
//     mr: [
//       { name: "Aarohi", id: "mr-IN-AarohiNeural" },
//       { name: "Manohar", id: "mr-IN-ManoharNeural" },
//     ],
//     gu: [
//       { name: "Dhwani", id: "gu-IN-DhwaniNeural" },
//       { name: "Niranjan", id: "gu-IN-NiranjanNeural" },
//     ]
//   };

//   const token = localStorage.getItem("token");

//   // Call the positionDropdowns function once on component mount if needed
//   useEffect(() => {
//     positionDropdowns();
//   }, []);

//   const playSample = async (speakerId) => {
//     const playIconElement = document.querySelector(
//       `.play-icon[data-speaker="${speakerId}"]`
//     );
//     const originalContent = playIconElement ? playIconElement.innerHTML : "▶";
//     try {
//       if (!playIconElement) return;
//       console.log(`Playing sample for ${speakerId} in ${language}`);
      
//       // First fetch the audio without changing the UI
//       const response = await axios.get(
//         `http://127.0.0.1:5000/sample_voice?language=${language}&voice=${speakerId}`,
//         { responseType: "blob" }
//       );
//       const sampleUrl = window.URL.createObjectURL(new Blob([response.data]));
//       const audio = new Audio(sampleUrl);
      
//       // Set up audio events
//       audio.onplay = () => {
//         // Only create and show visualizer when audio actually starts playing
//         const visualizer = document.createElement("div");
//         visualizer.className = "mini-visualizer";
        
//         for (let i = 0; i < 7; i++) {
//           const bar = document.createElement("div");
//           bar.className = "mini-bar";
//           visualizer.appendChild(bar);
//         }
        
//         // Replace play icon with visualizer only when audio starts
//         playIconElement.innerHTML = "";
//         playIconElement.appendChild(visualizer);
//       };
      
//       audio.onended = () => {
//         playIconElement.innerHTML = originalContent;
//       };
      
//       audio.onerror = () => {
//         playIconElement.innerHTML = originalContent;
//         console.error("Audio playback error");
//       };
      
//       // Show loading indicator while waiting for audio to load
//       playIconElement.innerHTML = '<span class="loading-dot">...</span>';
      
//       // Start playing
//       await audio.play();
      
//     } catch (error) {
//       console.error("Error playing sample:", error);
//       if (playIconElement) playIconElement.innerHTML = originalContent;
//       alert(`Failed to play sample voice: ${error.message}`);
//     }
//   };

//   // ------------------------------------------------------
//   // Load Chats from Backend
//   // ------------------------------------------------------
//   const loadChats = async () => {
//     setError(null);
//     try {
//       if (!token) {
//         setError("Authentication token required. Please log in.");
//         return;
//       }
//       const response = await axios.get("http://localhost:5257/api/chats", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setChats(response.data);

//       // If we have existing chats, pick the first; otherwise create a new one
//       if (response.data.length > 0) {
//         setActiveChatIndex(0);
//       } else {
//         // Automatically create a new chat if none exist
//         createNewChat();
//       }
//     } catch (err) {
//       console.error("Error loading chats:", err);
//       setError(err.response?.data?.error || "Failed to load chats");
//     }
//   };

//   // ------------------------------------------------------
//   // Create New Chat
//   // ------------------------------------------------------
//   const createNewChat = async () => {
//     setError(null);
//     try {
//       const response = await axios.post(
//         "http://localhost:5257/api/chats/new",
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const newChat = response.data.chat;
//       newChat.title = newChat.title || "New Chat";

//       setChats((prevChats) => {
//         const updated = [...prevChats, newChat];
//         setActiveChatIndex(updated.length - 1); // set newly created chat active
//         return updated;
//       });
//     } catch (err) {
//       console.error("Failed to create new chat", err);
//       setError("Failed to create new chat");
//     }
//   };

//   // ------------------------------------------------------
//   // Load Chat-Specific Audio History
//   // ------------------------------------------------------
//   const loadChatAudioHistory = async (chatId) => {
//     setError(null);
//     try {
//       if (!token) {
//         setError("Authentication token required. Please log in.");
//         return;
//       }
//       const response = await axios.get(
//         `http://localhost:5257/api/chats/${chatId}/audio`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (response.data && response.data.history) {
//         setAudioHistory(response.data.history);
//       } else {
//         setAudioHistory([]);
//       }
//     } catch (err) {
//       console.error("Error loading chat audio history:", err);
//       setError(err.response?.data?.error || "Failed to load chat audio history");
//     }
//   };

//   // Load chats on component mount if token is available
//   useEffect(() => {
//     if (token) {
//       loadChats();
//     }
//   }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Load chat audio history when active chat changes
//   useEffect(() => {
//     if (activeChatIndex !== null && chats[activeChatIndex]) {
//       loadChatAudioHistory(chats[activeChatIndex].chatId);
//     }
//   }, [activeChatIndex, chats]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleTextChange = (e) => setText(e.target.value);

//   const handleFileUpload = (e) => {
//     if (e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//       setText(`Processing file: ${e.target.files[0].name}`);
//     }
//   };

//   // ------------------------------------------------------
//   // Handle Sending TTS Request
//   // ------------------------------------------------------
//   const handleSend = async () => {
//     setError(null);
//     if (!token) {
//       setError("Authentication token required. Please log in.");
//       return;
//     }
//     if (!text.trim() && !file) {
//       setError("Please enter text or upload a file.");
//       return;
//     }
//     if (activeChatIndex === null || !chats[activeChatIndex]) {
//       setError("No active chat selected.");
//       return;
//     }

//     const currentChat = chats[activeChatIndex];
//     const userQuery = file ? `Uploaded file: ${file.name}` : text;

//     // Update local conversation and derive new title
//     const newTitle = userQuery.substring(0, 30) || "Untitled Chat";
//     setChats((prevChats) =>
//       prevChats.map((chat, index) => {
//         if (index === activeChatIndex) {
//           const updatedConversation = [
//             ...(chat.conversation || []),
//             { query: userQuery, audio: null, timestamp: new Date() }
//           ];
//           // Use the user query if title is empty or "New Chat"
//           const updatedTitle =
//             (!chat.title || chat.title === "New Chat") ? newTitle : chat.title;
//           return {
//             ...chat,
//             conversation: updatedConversation,
//             title: updatedTitle
//           };
//         }
//         return chat;
//       })
//     );

//     // Call the backend to update the title if needed
//     if ((!currentChat.title || currentChat.title === "New Chat") && userQuery) {
//       try {
//         await axios.put(
//           `http://localhost:5257/api/chats/${currentChat.chatId}`,
//           { title: newTitle },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (err) {
//         console.error("Failed to update chat title:", err);
//       }
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("token", token);
//     if (file) {
//       formData.append("file", file);
//     } else {
//       formData.append("text", text);
//     }
//     formData.append("language", language);
//     if (language === "en" || language === "hi" || language === "mr" || language === "gu") {
//       if (speaker1) formData.append("speaker1", speaker1);
//       if (speaker2) formData.append("speaker2", speaker2);
//     }
//     if (duration1 && duration1 > 0) {
//       formData.append("duration1", duration1);
//     }
//     // Append active chatId to store audio with chat metadata
//     formData.append("chatId", currentChat.chatId);

//     try {
//       // 1) Generate speech via Flask
//       const flaskResponse = await axios.post(
//         "http://127.0.0.1:5000/generate",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           responseType: "blob"
//         }
//       );
//       const audioBlob = new Blob([flaskResponse.data], { type: "audio/mpeg" });
//       const tempAudioUrl = URL.createObjectURL(audioBlob);

//       // Update conversation with the temporary URL
//       setChats((prevChats) =>
//         prevChats.map((chat, index) => {
//           if (
//             index === activeChatIndex &&
//             chat.conversation &&
//             chat.conversation.length > 0
//           ) {
//             const updatedConversation = [...chat.conversation];
//             updatedConversation[updatedConversation.length - 1].audio =
//               tempAudioUrl;
//             return { ...chat, conversation: updatedConversation };
//           }
//           return chat;
//         })
//       );

//       // 2) Store the audio file permanently in Node/Express
//       const storeFormData = new FormData();
//       storeFormData.append("audio", audioBlob, "tts.mp3");
//       storeFormData.append("text", text);
//       storeFormData.append("chatId", currentChat.chatId);

//       const storeResponse = await axios.post(
//         "http://localhost:5257/tts-audio",
//         storeFormData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       const { fileId } = storeResponse.data;
//       const permanentAudioUrl = `http://localhost:5257/api/tts-audio/${fileId}`;

//       // Update conversation with permanent URL
//       setChats((prevChats) =>
//         prevChats.map((chat, index) => {
//           if (
//             index === activeChatIndex &&
//             chat.conversation &&
//             chat.conversation.length > 0
//           ) {
//             const updatedConversation = [...chat.conversation];
//             updatedConversation[updatedConversation.length - 1].audio =
//               permanentAudioUrl;
//             return { ...chat, conversation: updatedConversation };
//           }
//           return chat;
//         })
//       );

//       // Refresh chat-specific audio history
//       loadChatAudioHistory(currentChat.chatId);
//     } catch (err) {
//       console.error("Error generating/storing speech:", err);
//       setError(
//         err.response?.data?.error || "Failed to generate or store speech"
//       );
//     } finally {
//       setLoading(false);
//       setText("");
//       setFile(null);
//     }
//   };

//   // Build array of streaming URLs for sequential playback using audioHistory
//   const queueAudioList = audioHistory.map(
//     (file) => `http://localhost:5257/api/tts-audio/${file._id}`
//   );

//   const activeChat = activeChatIndex !== null ? chats[activeChatIndex] : null;

//   return (
//     <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
//       {/* Left Sidebar */}
//       <div
//         className={`chat-sidebar slide-in ${
//           sidebarOpen ? "open" : "closed"
//         }`}
//       >
//         <div className="sidebar-header">
//           <h3>Chats</h3>
//           <button onClick={createNewChat} className="new-chat-btn">
//             <PlusCircle size={16} /> New Chat
//           </button>
//         </div>
//         <div className="chat-list">
//           {chats.length === 0 ? (
//             <p>No chats found.</p>
//           ) : (
//             chats.map((chat, index) => {
//               const displayTitle =
//                 chat.title && chat.title.trim() !== ""
//                   ? chat.title
//                   : chat.chatId;
//               return (
//                 <div
//                   key={chat.chatId}
//                   className={`chat-item ${
//                     activeChatIndex === index ? "active" : ""
//                   } fade-in`}
//                   onClick={() => setActiveChatIndex(index)}
//                 >
//                   {displayTitle}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Toggle Sidebar Button */}
//       <button
//         className="sidebar-toggle-btn"
//         onClick={() => setSidebarOpen((prev) => !prev)}
//       >
//         {sidebarOpen ? <ArrowLeft size={16} /> : <Menu size={16} />}
//       </button>

//       {/* Main Content */}
//       <div className="main-content fade-in">
//         <div className="navbar">
//           <h2>{activeChat ? activeChat.title || activeChat.chatId : "Chat"}</h2>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="dark-mode-toggle"
//           >
//             {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//           </button>
//         </div>

//         {error && (
//           <div className="error-banner fade-in">
//             <p>{error}</p>
//             <button onClick={() => setError(null)}>×</button>
//           </div>
//         )}

//         {/* REVISED LAYOUT: Main container with flex column */}
//         <div className="chat-layout">
//           {/* 1. Scrollable Audio Messages Section (top) */}
//           <div className="audio-messages-container">
//             {/* Audio History Section */}
//             {audioHistory.length > 0 && (
//               <div className="audio-history">
//                 <h3>Audio History</h3>
//                 <button
//                   onClick={() => setIsQueuePlaying(!isQueuePlaying)}
//                   className="play-all-btn"
//                   disabled={queueAudioList.length === 0}
//                 >
//                   {isQueuePlaying ? "Stop Queue" : "Play All"}
//                 </button>
//                 <div className="history-grid">
//                   {audioHistory.map((file) => {
//                     const audioUrl = `http://localhost:5257/api/tts-audio/${file._id}`;
//                     return (
//                       <div key={file._id} className="history-item">
//                         <p className="history-timestamp">
//                           {new Date(file.uploadDate).toLocaleString()}
//                         </p>
//                         <p className="requested-text">
//                           Query: {file.requestedText}
//                         </p>
//                         <AudioPlayer src={audioUrl} />
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {isQueuePlaying && queueAudioList.length > 0 && (
//                   <div className="queue-player">
//                     <h3>Sequential Playback</h3>
//                     <SequentialAudioPlayer
//                       audioList={queueAudioList}
//                       onQueueEnd={() => setIsQueuePlaying(false)}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Chat Messages Display */}
//             {activeChat &&
//               activeChat.conversation &&
//               activeChat.conversation.map((pair, index) => (
//                 <div key={index} className="conversation-pair fade-in">
//                   <div className="user-message">
//                     <p>{pair.query}</p>
//                   </div>
//                   <div className="assistant-message">
//                     {pair.audio ? (
//                       <AudioPlayer src={pair.audio} />
//                     ) : (
//                       <div className="loading-audio">Audio pending...</div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//             {loading && (
//               <div className="chat-bubble assistant fade-in">
//                 <p>Generating speech...</p>
//               </div>
//             )}
//           </div>

//           {/* 2. Fixed Chat Input at the bottom */}
//           <div className="chat-input-fixed">
//             <textarea
//               value={text}
//               onChange={handleTextChange}
//               placeholder="Type your message here..."
//               disabled={loading}
//             />
//             <div className="file-upload-wrapper">
//               <input
//                 type="file"
//                 id="file-upload"
//                 accept=".txt,.pdf"
//                 onChange={handleFileUpload}
//                 disabled={loading}
//               />
//               <label htmlFor="file-upload" className="file-upload-label">
//                 {file ? file.name : "Upload File"}
//               </label>
//             </div>
//             <div className="input-controls">
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 disabled={loading}
//               >
//                 <option value="en">English</option>
//                 <option value="hi">Hindi</option>
//                 <option value="mr">Marathi</option>
//                 <option value="gu">Gujarati</option>
//               </select>
//               <select
//                 value={duration1 || ""}
//                 onChange={(e) =>
//                   setDuration1(
//                     e.target.value === "" ? null : Number(e.target.value)
//                   )
//                 }
//                 disabled={loading}
//               >
//                 <option value="">Select Duration</option>
//                 <option value={30}>30 seconds</option>
//                 <option value={60}>1 minute</option>
//                 <option value={120}>2 minutes</option>
//                 <option value={180}>3 minutes</option>
//               </select>
//               {(language === "en" ||
//                 language === "hi" ||
//                 language === "mr" ||
//                 language === "gu") && (
//                 <>
//                   <div className="speaker-selection">
//                     <label>Speaker 1:</label>
//                     <div className="speaker-dropdown">
//                       <select
//                         value={speaker1}
//                         onChange={(e) => setSpeaker1(e.target.value)}
//                       >
//                         <option value="">Select Speaker 1</option>
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <option key={sp.id} value={sp.id}>
//                               {sp.name}
//                             </option>
//                           ))}
//                       </select>
                      
//                       <div className="speaker-options options-above">
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <div 
//                               key={sp.id} 
//                               className={`speaker-option ${speaker1 === sp.id ? "selected" : ""}`}
//                             >
//                               <span onClick={() => setSpeaker1(sp.id)}>{sp.name}</span>
//                               <span 
//                                 className="play-icon" 
//                                 data-speaker={sp.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   playSample(sp.id);
//                                 }}
//                               >
//                                 ▶
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="speaker-selection">
//                     <label>Speaker 2:</label>
//                     <div className="speaker-dropdown">
//                       <select
//                         value={speaker2}
//                         onChange={(e) => setSpeaker2(e.target.value)}
//                       >
//                         <option value="">Select Speaker 2</option>
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <option key={sp.id} value={sp.id}>
//                               {sp.name}
//                             </option>
//                           ))}
//                       </select>
//                       <div className="speaker-options options-above">
//                         {speakers[language] &&
//                           speakers[language].map((sp) => (
//                             <div 
//                               key={sp.id} 
//                               className={`speaker-option ${speaker2 === sp.id ? "selected" : ""}`}
//                             >
//                               <span onClick={() => setSpeaker2(sp.id)}>{sp.name}</span>
//                               <span 
//                                 className="play-icon" 
//                                 data-speaker={sp.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   playSample(sp.id);
//                                 }}
//                               >
//                                 ▶
//                               </span>
//                             </div>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//               <button onClick={handleSend} disabled={loading}>
//                 {loading ? "Generating..." : "Send"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextToSpeech;

