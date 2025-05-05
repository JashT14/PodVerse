// import  { useState, useEffect, useRef, useCallback } from "react";
// import PropTypes from "prop-types";
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
//   Download,
//   ArrowDownCircle,
//   MoreHorizontal,
//   Share2,
//   Trash2
// } from "lucide-react";
// import "./TextToSpeech.css";
// import ShareModal from "./ShareModal";




// //Define backend URL
// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

// // ------------------------------------------------------
// // Utility: Format seconds as mm:ss
// // ------------------------------------------------------
// const formatTime = (seconds) => {
//   if (!seconds || isNaN(seconds)) return "00:00";
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
// };

// // Helper to extract fileId from audio URL.
// const extractFileIdFromSrc = (src) => {
//   const parts = src.split("/");
//   const lastPart = parts[parts.length - 1];
//   return lastPart.split("?")[0];
// };


// // ------------------------------------------------------
// // AudioPlayer Component
// // ------------------------------------------------------
// const AudioPlayer = ({ src }) => {
//   const token = localStorage.getItem("token");
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
//   const [fallback, setFallback] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);

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

//   const skipBackward = (e) => {
//     e.preventDefault();
//     if (audioRef.current) {
//       const newTime = Math.max(audioRef.current.currentTime - 10, 0);
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const skipForward = (e) => {
//     e.preventDefault();
//     if (audioRef.current) {
//       const dur = audioRef.current.duration || 0;
//       const newTime = Math.min(audioRef.current.currentTime + 10, dur);
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const toggleMute = () => {
//     if (!audioRef.current) return;
//     audioRef.current.muted = !audioRef.current.muted;
//     setIsMuted(audioRef.current.muted);
//   };

//   const handleDownload = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(effectiveSrc);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.style.display = "none";
//       link.href = url;
//       link.download = 'Podcast.mp3';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed", error);
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
//         onError={() => setFallback(true)}
//         controls={fallback}
//       >
//         <source src={effectiveSrc} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="audio-controls">
//         <button type="button" onClick={togglePlay} className="control-btn">
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//         <button type="button" onClick={skipBackward} className="control-btn">
//           <SkipBack size={16} />
//         </button>
//         <button type="button" onClick={skipForward} className="control-btn">
//           <SkipForward size={16} />
//         </button>
//         <button type="button" onClick={toggleMute} className="control-btn">
//           {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//         </button>
//         <button type="button" onClick={handleDownload} className="control-btn">
//           <Download size={16} />
//         </button>
//         <button type="button" onClick={() => setShowShareModal(true)} className="control-btn share-btn">
//           <Share2 size={16} />
//         </button>

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
//       {showShareModal && (
//         <ShareModal type="audio" id={extractFileIdFromSrc(src)} onClose={() => setShowShareModal(false)} />
// )}

//     </div>
//   );
// };

// AudioPlayer.propTypes = {
//   src: PropTypes.string,
// };
// const LanguageDropdown = ({ language, setLanguage, loading, closeDropdowns }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropDirection, setDropDirection] = useState('down');
//   const dropdownRef = useRef(null);

//   const languages = [
//     { code: 'hi', name: 'Hindi', flag: 'https://flagcdn.com/w40/in.png' },
//     { code: 'mr', name: 'Marathi', flag: 'https://flagcdn.com/w40/in.png' },
//     { code: 'gu', name: 'Gujarati', flag: 'https://flagcdn.com/w40/in.png' },
//     { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
//     { code: 'es', name: 'Spanish', flag: 'https://flagcdn.com/w40/es.png' },
//     { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
//     { code: 'de', name: 'German', flag: 'https://flagcdn.com/w40/de.png' },
//     { code: 'it', name: 'Italian', flag: 'https://flagcdn.com/w40/it.png' },
//     { code: 'ja', name: 'Japanese', flag: 'https://flagcdn.com/w40/jp.png' },
//     { code: 'zh', name: 'Chinese', flag: 'https://flagcdn.com/w40/cn.png' },
//     { code: 'ru', name: 'Russian', flag: 'https://flagcdn.com/w40/ru.png' },
//     { code: 'pt', name: 'Portuguese', flag: 'https://flagcdn.com/w40/pt.png' },
//     { code: 'ko', name: 'Korean', flag: 'https://flagcdn.com/w40/kr.png' },
//     { code: 'tr', name: 'Turkish', flag: 'https://flagcdn.com/w40/tr.png' }
//   ];
  

//   useEffect(() => {
//     const checkDropdownPosition = () => {
//       if (!dropdownRef.current) return;

//       const rect = dropdownRef.current.getBoundingClientRect();
//       const spaceBelow = window.innerHeight - rect.bottom;
//       const spaceAbove = rect.top;

//       // Determine drop direction based on available space
//       setDropDirection(spaceBelow > 300 ? 'down' : 'up');
//     };

//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     // Check position when opening dropdown
//     if (isOpen) {
//       checkDropdownPosition();
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     window.addEventListener('resize', checkDropdownPosition);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       window.removeEventListener('resize', checkDropdownPosition);
//     };
//   }, [isOpen]);

//   const handleLanguageChange = (selectedLanguage) => {
//     setLanguage(selectedLanguage);
//     closeDropdowns && closeDropdowns();
//     setIsOpen(false);
//   };

//   const toggleDropdown = (e) => {
//     e.stopPropagation();
//     if (!loading) {
//       setIsOpen(!isOpen);
//     }
//   };

//   const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

//   return (
//     <div 
//       className={`language-dropdown ${dropDirection}`} 
//       ref={dropdownRef}
//     >
//       <div 
//         className={`dropdown-header ${loading ? 'disabled' : ''}`} 
//         onClick={toggleDropdown}
//       >
//         <img 
//           src={selectedLanguage.flag} 
//           alt={`${selectedLanguage.name} flag`} 
//           className="flag-icon"
//         />
//         <span className="language-name">{selectedLanguage.name}</span>
//         <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
//       </div>
//       {isOpen && !loading && (
//         <ul className="dropdown-list">
//           {languages.map((lang) => (
//             <li 
//               key={lang.code}
//               onClick={() => handleLanguageChange(lang.code)}
//               className={language === lang.code ? 'selected' : ''}
//             >
//               <img 
//                 src={lang.flag} 
//                 alt={`${lang.name} flag`} 
//                 className="flag-icon"
//               />
//               <span className="language-name">{lang.name}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// // ------------------------------------------------------
// // Main TextToSpeech Component
// // ------------------------------------------------------
// const TextToSpeech = () => {
//   // Speaker dropdown states
//   const [dropdownOpen, setDropdownOpen] = useState({
//     speaker1: false,
//     speaker2: false,
//   });
//   const toggleDropdown = (speakerKey) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [speakerKey]: !prev[speakerKey],
//     }));
//   };
//   const closeDropdowns = () => {
//     setDropdownOpen({ speaker1: false, speaker2: false });
//   };

//   const playSample = async (speakerId) => {
//     try {
//       const playIconElements = document.querySelectorAll(
//         `.play-icon[data-speaker="${speakerId}"]`
//       );
//       if (!playIconElements.length) return;
//       playIconElements.forEach((playIconElement) => {
//         const originalContent = playIconElement.innerHTML;
//         const sampleUrl = `/assets/Voices/sample_voice_${language}_${speakerId.replace("/","_")}.wav`;
//         const audio = new Audio(sampleUrl);
//         audio.onplay = () => {
//           const visualizer = document.createElement("div");
//           visualizer.className = "mini-visualizer";
//           for (let i = 0; i < 7; i++) {
//             const bar = document.createElement("div");
//             bar.className = "mini-bar";
//             visualizer.appendChild(bar);
//           }
//           playIconElement.innerHTML = "";
//           playIconElement.appendChild(visualizer);
//         };
//         audio.onended = () => {
//           playIconElement.innerHTML = originalContent;
//         };
//         audio.onerror = () => {
//           playIconElement.innerHTML = originalContent;
//           console.error("Audio playback error");
//         };
//         playIconElement.innerHTML = '<span className="loading-dot">...</span>';
//         audio.play().catch(() => {
//           playIconElement.innerHTML = originalContent;
//         });
//       });
//     } catch (error) {
//       console.error("Error playing sample:", error);
//     }
//   };

//   const [chats, setChats] = useState([]);
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
//   const [error, setError] = useState(null);

//   // New state for chat menu and deletion popup
//   const [openMenuChatId, setOpenMenuChatId] = useState(null);
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [chatToDelete, setChatToDelete] = useState(null);

//   // New state for chat sharing modal
//   const [showChatShareModal, setShowChatShareModal] = useState(false);
//   const [shareChatId, setShareChatId] = useState("");

//   // For scroll-to-bottom button
//   const conversationContainerRef = useRef(null);
//   const [showScrollDown, setShowScrollDown] = useState(false);

//   const [showShareModal, setShowShareModal] = useState(false);

//   const token = localStorage.getItem("token");

//   // List of available speakers
//   const speakers = {
//     en: [
//       { name: "John", id: "p374" },
//       { name: "Daniel", id: "p250" },
//       { name: "Michael", id: "p231" },
//       { name: "Sophia", id: "p232" },
//       { name: "Emma", id: "p228" },
//       { name: "Olivia", id: "p243" },
//     ],
//     hi: [
//       { name: "Rahul", id: "v2/hi_speaker_1" },
//       { name: "Amit", id: "v2/hi_speaker_0" },
//       { name: "Sita", id: "v2/hi_speaker_2" },
//       { name: "Priya", id: "v2/hi_speaker_5" },
//     ],
//     mr: [
//       { name: "Aarohi", id: "mr-IN-AarohiNeural" },
//       { name: "Manohar", id: "mr-IN-ManoharNeural" },
//     ],
//     gu: [
//       { name: "Dhwani", id: "gu-IN-DhwaniNeural" },
//       { name: "Niranjan", id: "gu-IN-NiranjanNeural" },
//     ],
//     es: [
//       { name: "Carlos", id: "v2/es_speaker_0" },
//       { name: "Sofia", id: "v2/es_speaker_8" },
//       { name: "Diego", id: "v2/es_speaker_3" },
//       { name: "Lucia", id: "v2/es_speaker_9" }
//     ],
//     fr: [
//       { name: "Pierre", id: "v2/fr_speaker_4" },
//       { name: "Marie", id: "v2/fr_speaker_5" },
//       { name: "Julien", id: "v2/fr_speaker_3" },
//       { name: "Camille", id: "v2/fr_speaker_2" }
//     ],
//     de: [
//       { name: "Hans", id: "v2/de_speaker_0" },
//       { name: "Anna", id: "v2/de_speaker_3" },
//       { name: "Fritz", id: "v2/de_speaker_2" },
//       { name: "Greta", id: "v2/de_speaker_8" }
//     ],
//     it: [
//       { name: "Luca", id: "v2/it_speaker_0" },
//       { name: "Giulia", id: "v2/it_speaker_2" },
//       { name: "Marco", id: "v2/it_speaker_3" },
//       { name: "Francesca", id: "v2/it_speaker_7" }
//     ],
//     ja: [
//       { name: "Hiroshi", id: "v2/ja_speaker_2" },
//       { name: "Yuki", id: "v2/ja_speaker_4" },
//       { name: "Takumi", id: "v2/ja_speaker_6" },
//       { name: "Sakura", id: "v2/ja_speaker_8" }
//     ],
//     zh: [
//       { name: "Wei", id: "v2/zh_speaker_0" },
//       { name: "Mei", id: "v2/zh_speaker_4" },
//       { name: "Li", id: "v2/zh_speaker_8" },
//       { name: "Xia", id: "v2/zh_speaker_9" }
//     ],
//      ru: [
//       { name: "Ivan", id: "v2/ru_speaker_0" },
//       { name: "Anastasia", id: "v2/ru_speaker_5" },
//       { name: "Dmitry", id: "v2/ru_speaker_1" },
//       { name: "Ekaterina", id: "v2/ru_speaker_9" }
//     ],
//     pt: [
//       { name: "João", id: "v2/pt_speaker_0" },
//       { name: "Miguel", id: "v2/pt_speaker_1" },
//       { name: "Carlos", id: "v2/pt_speaker_2" },
//       { name: "Rafael", id: "v2/pt_speaker_3" }
//     ],
//     ko: [
//       { name: "Min-Jun", id: "v2/ko_speaker_0" },
//       { name: "Ji-Young", id: "v2/ko_speaker_1" },
//       { name: "Seung-Hyun", id: "v2/ko_speaker_2" },
//       { name: "Hye-Jin", id: "v2/ko_speaker_3" }
//     ],
//     tr: [
//       { name: "Mehmet", id: "v2/tr_speaker_0" },
//       { name: "Elif", id: "v2/tr_speaker_4" },
//       { name: "Ahmet", id: "v2/tr_speaker_8" },
//       { name: "Zeynep", id: "v2/tr_speaker_5" }
//     ],
//   };
  


//   // ------------------------------------------------------
//   // Load Chats from Backend
//   // ------------------------------------------------------
//   const loadChats = useCallback(async () => {
//     // Prevent multiple simultaneous calls
//     if (loadChats.isLoading) {
//       console.log('Load chats already in progress');
//       return;
//     }
  
//     // Create an abort controller
//     const controller = new AbortController();
  
//     try {
//       // Set loading flag
//       loadChats.isLoading = true;
  
//       // Clear any previous errors
//       setError(null);
  
//       // Check for token
//       if (!token) {
//         setError("Authentication token required. Please log in.");
//         return;
//       }
  
//       // Make API call with abort signal
//       const response = await axios.get(`${backendUrl}/api/chats`, {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: controller.signal
//       });
  
//       // Process chats
//       if (response.data.length === 0) {
//         // Create a new chat if no chats exist
//         const createResponse = await axios.post(
//           `${backendUrl}/api/chats/new`,
//           {},
//           { 
//             headers: { Authorization: `Bearer ${token}` },
//             signal: controller.signal
//           }
//         );
        
//         const newChat = createResponse.data.chat;
//         newChat.title = "New Chat";
        
//         setChats([newChat]);
//         setActiveChatIndex(0);
//         localStorage.setItem("activeChatId", newChat.chatId);
//       } else {
//         // Transform existing chats to ensure they have a title
//         const transformedChats = response.data.map(chat => ({
//           ...chat,
//           title: chat.title && chat.title.trim() !== "" ? chat.title : "New Chat"
//         }));
  
//         setChats(transformedChats);
  
//         // Determine active chat
//         const storedActiveChatId = localStorage.getItem("activeChatId");
//         if (storedActiveChatId) {
//           const activeIndex = transformedChats.findIndex(
//             (chat) => chat.chatId === storedActiveChatId
//           );
          
//           setActiveChatIndex(activeIndex !== -1 ? activeIndex : 0);
//         } else {
//           setActiveChatIndex(0);
//         }
//       }
  
//     } catch (err) {
//       // Handle different types of errors
//       if (axios.isCancel(err)) {
//         console.log('Request canceled', err.message);
//       } else if (err.response) {
//         // The request was made and the server responded with a status code
//         console.error("Error loading chats:", err.response.data);
//         setError(err.response.data.error || "Failed to load chats");
//       } else if (err.request) {
//         // The request was made but no response was received
//         console.error("No response received:", err.request);
//         setError("No response from server");
//       } else {
//         // Something happened in setting up the request
//         console.error("Error", err.message);
//         setError("An unexpected error occurred");
//       }
//     } finally {
//       // Reset loading flag
//       loadChats.isLoading = false;
//     }
  
//     // Return cleanup function
//     return () => {
//       controller.abort(); // Cancel the request if component unmounts
//     };
//   }, [token, backendUrl]);
  
//   // Add a static property to track loading state
//   loadChats.isLoading = false;

//   // ------------------------------------------------------
//   // Create New Chat
//   // ------------------------------------------------------
//   const createNewChat = async () => {
//     if (!token) {
//       setError("Authentication token required. Please log in.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/chats/new`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const newChat = response.data.chat;
//       newChat.title = newChat.title || "New Chat";
//       setChats((prevChats) => {
//         const updated = [...prevChats, newChat];
//         setActiveChatIndex(updated.length - 1);
//         localStorage.setItem("activeChatId", newChat.chatId);
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
//         `${backendUrl}/api/chats/${chatId}/audio`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       if (response.data && response.data.history) {
//         const historyAsConversation = response.data.history.map((file) => ({
//           _id: file._id,
//           query: file.requestedText,
//           audio: `${backendUrl}/api/tts-audio/${file._id}`,
//           timestamp: file.uploadDate,
//         }));
//         setChats((prevChats) =>
//           prevChats.map((c) => {
//             if (c.chatId === chatId) {
//               const existingConversation = c.conversation || [];
//               const merged = [...existingConversation];
//               historyAsConversation.forEach((hc) => {
//                 const duplicate = merged.find((m) => m._id === hc._id);
//                 if (!duplicate) {
//                   merged.push(hc);
//                 }
//               });
//               merged.sort(
//                 (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//               );
//               return { ...c, conversation: merged };
//             }
//             return c;
//           })
//         );
//       }
//     } catch (err) {
//       console.error("Error loading chat audio history:", err);
//       setError(err.response?.data?.error || "Failed to load chat audio history");
//     }
//   };

//   // ------------------------------------------------------
//   // On first mount, load all chats
//   // ------------------------------------------------------
//   // ------------------------------------------------------
//   // On first mount, load all chats
//   // ------------------------------------------------------
//   useEffect(() => {
//     let cleanup;
  
//     const fetchChats = async () => {
//       if (token) {
//         cleanup = await loadChats();
//       }
//     };
  
//     fetchChats();
  
//     // Cleanup function
//     return () => {
//       if (typeof cleanup === 'function') {
//         cleanup();
//       }
//     };
//   }, [loadChats, token]);

//   // ------------------------------------------------------
//   // Whenever activeChatIndex changes, load that chat's audio history
//   // Also store the active chatId in localStorage
//   // ------------------------------------------------------
//   useEffect(() => {
//     if (activeChatIndex !== null && chats[activeChatIndex]) {
//       const chatId = chats[activeChatIndex].chatId;
//       localStorage.setItem("activeChatId", chatId);
//       loadChatAudioHistory(chatId);
//     }
//   }, [activeChatIndex, chats]);

//   // ------------------------------------------------------
//   // Scroll Container: Show "scroll down" button if near the top
//   // ------------------------------------------------------
//   useEffect(() => {
//     const container = conversationContainerRef.current;
//     if (!container) return;
//     const handleScroll = () => {
//       const nearTop = container.scrollTop <= 50;
//       setShowScrollDown(nearTop);
//     };
//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToBottom = () => {
//     if (conversationContainerRef.current) {
//       conversationContainerRef.current.scrollTop =
//         conversationContainerRef.current.scrollHeight;
//     }
//   };

//   const scrollConversationToBottom = () => {
//     if (conversationContainerRef.current) {
//       conversationContainerRef.current.scrollTop =
//         conversationContainerRef.current.scrollHeight;
//     }
//   };

//   // ------------------------------------------------------
//   // On new message or file
//   // ------------------------------------------------------
//   const handleTextChange = (e) => setText(e.target.value);
//   const handleFileUpload = (e) => {
//     if (e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//       setText(`Processing file: ${e.target.files[0].name}`);
//     }
//   };


//     // Sanitize text function to add before handleSend
// const sanitizeText = (text) => {
//   // Remove punctuation and extra whitespaces
//   const sanitized = text
//     .replace(/[.,?!;:()]/g, '')  // Remove specific punctuation marks
//     .trim()  // Remove leading and trailing whitespaces
//     .replace(/\s+/g, ' ');  // Replace multiple spaces with single space

//   // Capitalize first letter, make rest lowercase
//   return sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
// };

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
//     const newTitle = sanitizeText(file ? `Uploaded file: ${file.name}` : text).substring(0, 30) || "Untitled Chat";
//     const currentConversation = currentChat.conversation || [];
//     setChats((prevChats) =>
//       prevChats.map((chat, index) => {
//         if (index === activeChatIndex) {
//           const updatedConversation = [
//             ...currentConversation,
//             {
//               query: userQuery,
//               audio: null,
//               timestamp: new Date().toISOString(),
//             },
//           ];
//           const updatedTitle =
//             !chat.title || chat.title === "New Chat" ? newTitle : chat.title;
//           return {
//             ...chat,
//             conversation: updatedConversation,
//             title: updatedTitle,
//           };
//         }
//         return chat;
//       })
//     );
//     if ((!currentChat.title || currentChat.title === "New Chat") && userQuery) {
//       try {
//         await axios.put(
//           `${backendUrl}/api/chats/${currentChat.chatId}`,
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
//     if (
//       [
//         "en",
//         "hi",
//         "mr",
//         "gu",
//         "es",
//         "fr",
//         "de",
//         "it",
//         "ja",
//         "zh",
//         "ru",
//         "pt",
//         "ko",
//         "tr",
//       ].includes(language)
//     ) {
//       if (speaker1) formData.append("speaker1", speaker1);
//       if (speaker2) formData.append("speaker2", speaker2);
//     }
//     if (duration1 && duration1 > 0) {
//       formData.append("duration1", duration1);
//     }
//     formData.append("chatId", currentChat.chatId);
//     try {
//       const flaskResponse = await axios.post(
//         "http://127.0.0.1:5000/generate",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           responseType: "blob",
//         }
//       );
//       const audioBlob = new Blob([flaskResponse.data], { type: "audio/mpeg" });
//       const tempAudioUrl = URL.createObjectURL(audioBlob);
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
//       const storeFormData = new FormData();
//       storeFormData.append("audio", audioBlob, "tts.mp3");
//       storeFormData.append("text", text);
//       storeFormData.append("chatId", currentChat.chatId);
//       const storeResponse = await axios.post(
//         `${backendUrl}/tts-audio`,
//         storeFormData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const { fileId } = storeResponse.data;
//       const permanentAudioUrl = `${backendUrl}/api/tts-audio/${fileId}`;
//       setChats((prevChats) =>
//         prevChats.map((chat, index) => {
//           if (
//             index === activeChatIndex &&
//             chat.conversation &&
//             chat.conversation.length > 0
//           ) {
//             const updatedConversation = [...chat.conversation];
//             const lastIndex = updatedConversation.length - 1;
//             updatedConversation[lastIndex]._id = fileId;
//             updatedConversation[lastIndex].audio = permanentAudioUrl;
//             return { ...chat, conversation: updatedConversation };
//           }
//           return chat;
//         })
//       );
//       await loadChatAudioHistory(currentChat.chatId);
//       scrollConversationToBottom();
//     } catch (err) {
//       console.error("Error generating/storing speech:", err);
//       setError(err.response?.data?.error || "Failed to generate or store speech");
//     } finally {
//       setLoading(false);
//       setText("");
//       setFile(null);
//     }
//   };

//   const activeChat = activeChatIndex !== null ? chats[activeChatIndex] : null;

//   // ------------------------------------------------------
//   // Handle Chat Share
//   // ------------------------------------------------------
//   const handleShareChat = (chat) => {
//     setShareChatId(chat.chatId);
//     setShowChatShareModal(true);
//     setOpenMenuChatId(null);
//   };


//   // ------------------------------------------------------
//   // Handle Chat Deletion Confirmation
//   // ------------------------------------------------------
//   const confirmDeleteChat = async () => {
//     if (!chatToDelete) return;
//     try {
//       await axios.delete(`${backendUrl}/api/chats/${chatToDelete.chatId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setChats((prevChats) =>
//         prevChats.filter((c) => c.chatId !== chatToDelete.chatId)
//       );
//       if (activeChat && activeChat.chatId === chatToDelete.chatId) {
//         setActiveChatIndex(0);
//         localStorage.removeItem("activeChatId"); // Clear the stored active chat ID
//       }
//       setShowDeletePopup(false);
//       setChatToDelete(null);
//     } catch (err) {
//       console.error("Failed to delete chat", err);
//       setError("Failed to delete chat");
//       setShowDeletePopup(false);
//       setChatToDelete(null);
//     }
//   };

//   const cancelDeleteChat = () => {
//     setShowDeletePopup(false);
//     setChatToDelete(null);
//   };
//   useEffect(() => {
//     // Reset both speakers when language changes      Here 28/3/25 change
//     setSpeaker1('');
//     setSpeaker2('');
//   }, [language])

//   return (
//     <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
//       <div className="layout">
//         <div className={`sidebar-container ${sidebarOpen ? "" : "collapsed"}`}>
//           <div className={`chat-sidebar slide-in ${sidebarOpen ? "open" : "closed"}`}>
//             <div className="sidebar-header">
//               <h3>Chats</h3>
//               <button onClick={createNewChat} className="new-chat-btn">
//                 <PlusCircle size={16} /> New Chat
//               </button>
//             </div>
//             <div className="chat-list">
//         {chats.length === 0 ? (
//           <p>No chats found.</p>
//         ) : (
//           chats.map((chat, index) => {
//             const displayTitle =
//               chat.title && chat.title.trim() !== ""
//                 ? chat.title
//                 : chat.chatId;
//             return (
//               <div
//                 key={chat.chatId}
//                 className={`chat-item ${
//                   activeChatIndex === index ? "active" : ""
//                 } fade-in`}
//                 onClick={() => setActiveChatIndex(index)}
//                 style={{
//                   position: "relative",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center"
//                 }}
//               >
//                 <span>{displayTitle}</span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setOpenMenuChatId(
//                       openMenuChatId === chat.chatId ? null : chat.chatId
//                     );
//                   }}
//                   className="menu-btn"
//                 >
//                   <MoreHorizontal size={16} />
//                 </button>
//                 {openMenuChatId === chat.chatId && (
//                   <div
//                     className="chat-item-menu"
//                     style={{
//                       position: "absolute",
//                       right: "40px",
//                       top: "0",
//                       background: "#fff",
//                       border: "1px solid #ccc",
//                       zIndex: 10
//                     }}
//                   >
//                     <div
//                       className="menu-option"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleShareChat(chat);
//                       }}
//                       style={{
//                         padding: "5px 10px",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center"
//                       }}
//                     >
//                       <Share2 size={16} style={{ marginRight: "5px" }} /> Share Chat
//                     </div>
//                     <div
//                       className="menu-option delete-option"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setChatToDelete(chat);
//                         setShowDeletePopup(true);
//                         setOpenMenuChatId(null);
//                       }}
//                       style={{
//                         padding: "5px 10px",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         color: "red"
//                       }}
//                     >
//                       <Trash2 size={16} style={{ marginRight: "5px" }} /> Delete Chat
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//           </div>
//         </div>
//         <button
//           className="sidebar-toggle-btn"
//           onClick={() => setSidebarOpen((prev) => !prev)}
//           style={{
//             borderRadius: "50%",
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {sidebarOpen ? <ArrowLeft size={16} /> : <Menu size={16} />}
//         </button>
//         <div className="content-container">
//           <div className={`main-content ${sidebarOpen ? "" : "closed-sidebar"}`}>
//             <div className="navbar">
//               <h2>{activeChat ? activeChat.title || activeChat.chatId : "Chat"}</h2>
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className="dark-mode-toggle"
//               >
//                 {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//               </button>
//             </div>
//             {error && (
//               <div className="error-banner fade-in">
//                 <p>{error}</p>
//                 <button onClick={() => setError(null)}>×</button>
//               </div>
//             )}
//             <div className="chat-layout">
//               <div
//                 className="conversation-container"
//                 ref={conversationContainerRef}
//               >
//                 {activeChat &&
//                   activeChat.conversation &&
//                   activeChat.conversation.map((pair, index) => (
//                     <div key={index} className="conversation-pair fade-in">
//                       <div className="user-message">
//                         <p>{pair.query}</p>
//                       </div>
//                       <div className="assistant-message">
//                         {pair.audio ? (
//                           <AudioPlayer src={pair.audio} />
//                         ) : (
//                           <div className="loading-audio">Audio pending...</div>
//                         )}
//                         {pair.timestamp && (
//                           <small className="timestamp">
//                             {new Date(pair.timestamp).toLocaleString()}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//               {showScrollDown && (
//                 <button className="scroll-down-button" onClick={scrollToBottom}>
//                   <ArrowDownCircle size={24} />
//                 </button>
//               )}
//               {loading && (
//                 <div className="chat-bubble assistant fade-in">
//                   <p>Generating speech...</p>
//                 </div>
//               )}
//               <div className="chat-input-fixed">
//                 <textarea
//                   value={text}
//                   onChange={handleTextChange}
//                   placeholder="Type your message here..."
//                   disabled={loading}
//                 />
//                 <div className="input-controls"></div>
//                 <div className="file-upload-wrapper">
//                   <input
//                     type="file"
//                     id="file-upload"
//                     accept=".txt,.pdf"
//                     onChange={handleFileUpload}
//                     disabled={loading}
//                   />
//                   <label htmlFor="file-upload" className="file-upload-label">
//                     {file ? file.name : "Upload File"}
//                   </label>
//                 </div>
//                 <div className="input-controls">
//                 <LanguageDropdown 
//                     language={language}
//                     setLanguage={setLanguage}
//                     loading={loading}
//                     closeDropdowns={closeDropdowns}
//                   />
//                   <select
//                     value={duration1 || ""}
//                     onChange={(e) =>
//                       setDuration1(
//                         e.target.value === "" ? null : Number(e.target.value)
//                       )
//                     }
//                     disabled={loading}
//                   >
//                     <option value="">Select Duration</option>
//                     <option value={30}>30 seconds</option>
//                     <option value={60}>1 minute</option>
//                     <option value={120}>2 minutes</option>
//                     <option value={180}>3 minutes</option>
//                   </select>
//                   {(language === "en" ||
//                     language === "hi" ||
//                     language === "mr" ||
//                     language === "gu" ||
//                     language === "es" ||
//                     language === "fr" ||
//                     language === "de" ||
//                     language === "it" ||
//                     language === "ja" ||
//                     language === "zh" ||
//                     language === "ru" ||
//                     language === "pt" ||
//                     language === "ko" ||
//                     language === "tr") && (
//                     <>
//                       <div className="speaker-selection language-selection">
//                         <div
//                           className="speaker-dropdown"
//                           onClick={() => toggleDropdown("speaker1")}
//                         >
//                           <div className="selected-value">
//                             {speaker1
//                               ? speakers[language].find((sp) => sp.id === speaker1)
//                                   ?.name
//                               : "Select Speaker 1"}
//                           </div>
//                           {dropdownOpen.speaker1 && (
//                             <div className="speaker-options options-above">
//                               {speakers[language] &&
//                                 speakers[language].map((sp) => (
//                                   <div
//                                     key={sp.id}
//                                     className={`speaker-option ${
//                                       speaker1 === sp.id ? "selected" : ""
//                                     }`}
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setSpeaker1(sp.id);
//                                       toggleDropdown("speaker1");
//                                     }}
//                                   >
//                                     <span>{sp.name}</span>
//                                     <span
//                                       className="play-icon"
//                                       data-speaker={sp.id}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         playSample(sp.id);
//                                       }}
//                                     >
//                                       ▶
//                                     </span>
//                                   </div>
//                                 ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="speaker-selection">
//                         <div
//                           className="speaker-dropdown"
//                           onClick={() => toggleDropdown("speaker2")}
//                         >
//                           <div className="selected-value">
//                             {speaker2
//                               ? speakers[language].find((sp) => sp.id === speaker2)
//                                   ?.name
//                               : "Select Speaker 2"}
//                           </div>
//                           {dropdownOpen.speaker2 && (
//                             <div className="speaker-options options-above">
//                               {speakers[language] &&
//                                 speakers[language].map((sp) => (
//                                   <div
//                                     key={sp.id}
//                                     className={`speaker-option ${
//                                       speaker2 === sp.id ? "selected" : ""
//                                     }`}
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setSpeaker2(sp.id);
//                                       toggleDropdown("speaker2");
//                                     }}
//                                   >
//                                     <span>{sp.name}</span>
//                                     <span
//                                       className="play-icon"
//                                       data-speaker={sp.id}
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         playSample(sp.id);
//                                       }}
//                                     >
//                                       ▶
//                                     </span>
//                                   </div>
//                                 ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                   <button
//                     onClick={() => {
//                       handleSend();
//                       setText("");
//                     }}
//                     disabled={loading}
//                   >
//                     {loading ? "Generating..." : "Send"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {showDeletePopup && (
//         <div className="modal-overlay" style={{ position: "fixed", top:0, left:0, right:0, bottom:0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
//           <div className="modal-content" style={{ background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
//             <p>Are you sure you want to delete this chat?</p>
//             <div className="modal-actions" style={{ marginTop: "15px", display:"flex", justifyContent:"space-around" }}>
//               <button onClick={confirmDeleteChat} className="confirm-delete" style={{ background: "red", color: "#fff", padding:"10px", border:"none", borderRadius:"4px", display:"flex", alignItems:"center", gap:"5px" }}>
//                 <Trash2 size={16} /> Yes, Delete
//               </button>
//               <button onClick={cancelDeleteChat} style={{ padding:"10px", border:"none", borderRadius:"4px" }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//             {showChatShareModal && (
//         <ShareModal
//           type="chat"
//           id={shareChatId}
//           onClose={() => setShowChatShareModal(false)}
//         />
//       )}
//     </div>
//   );
  
// };

// export default TextToSpeech;


import  { useState, useEffect, useRef, useCallback } from "react";
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
  ArrowDownCircle,
  MoreHorizontal,
  Share2,
  Trash2,
  Copy,
  Search
  
  
} from "lucide-react";
import "./TextToSpeech.css";
import ShareModal from "./ShareModal";




//Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

// ------------------------------------------------------
// Utility: Format seconds as mm:ss
// ------------------------------------------------------
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
};


// Helper to extract fileId from audio URL.
const extractFileIdFromSrc = (src) => {
  const parts = src.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart.split("?")[0];
};


// ------------------------------------------------------
// AudioPlayer Component
// ------------------------------------------------------
const AudioPlayer = ({ src }) => {
  const token = localStorage.getItem("token");
  let effectiveSrc = src;
  if (src && token && !src.startsWith("blob:") && !src.includes("token=")) {
    effectiveSrc = src.includes("?")
      ? `${src}&token=${token}`
      : `${src}?token=${token}`;
  }
  if (!effectiveSrc) return <div>Loading audio...</div>;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  


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

  const skipBackward = (e) => {
    e.preventDefault();
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
 


  const skipForward = (e) => {
    e.preventDefault();
    if (audioRef.current) {
      const dur = audioRef.current.duration || 0;
      const newTime = Math.min(audioRef.current.currentTime + 10, dur);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(effectiveSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = 'Podcast.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
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
        onError={() => setFallback(true)}
        controls={fallback}
      >
        <source src={effectiveSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="audio-controls">
        <button type="button" onClick={togglePlay} className="control-btn">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button type="button" onClick={skipBackward} className="control-btn">
          <SkipBack size={16} />
        </button>
        <button type="button" onClick={skipForward} className="control-btn">
          <SkipForward size={16} />
        </button>
        <button type="button" onClick={toggleMute} className="control-btn">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button type="button" onClick={handleDownload} className="control-btn">
          <Download size={16} />
        </button>
        <button type="button" onClick={() => setShowShareModal(true)} className="control-btn share-btn">
          <Share2 size={16} />
        </button>

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
      {showShareModal && (
        <ShareModal type="audio" id={extractFileIdFromSrc(src)} onClose={() => setShowShareModal(false)} />
)}

    </div>
  );
};

AudioPlayer.propTypes = {
  src: PropTypes.string,
  text: PropTypes.string
};
const LanguageDropdown = ({ language, setLanguage, loading, closeDropdowns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState('down');
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'hi', name: 'Hindi', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'mr', name: 'Marathi', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'gu', name: 'Gujarati', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'es', name: 'Spanish', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'de', name: 'German', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'it', name: 'Italian', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'ja', name: 'Japanese', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: 'zh', name: 'Chinese', flag: 'https://flagcdn.com/w40/cn.png' },
    { code: 'ru', name: 'Russian', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: 'pt', name: 'Portuguese', flag: 'https://flagcdn.com/w40/pt.png' },
    { code: 'ko', name: 'Korean', flag: 'https://flagcdn.com/w40/kr.png' },
    { code: 'tr', name: 'Turkish', flag: 'https://flagcdn.com/w40/tr.png' }
  ];
  

  useEffect(() => {
    const checkDropdownPosition = () => {
      if (!dropdownRef.current) return;

      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Determine drop direction based on available space
      setDropDirection(spaceBelow > 300 ? 'down' : 'up');
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Check position when opening dropdown
    if (isOpen) {
      checkDropdownPosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', checkDropdownPosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkDropdownPosition);
    };
  }, [isOpen]);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    closeDropdowns && closeDropdowns();
    setIsOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!loading) {
      setIsOpen(!isOpen);
    }
  };
  

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div 
      className={`language-dropdown ${dropDirection}`} 
      ref={dropdownRef}
    >
      <div 
        className={`dropdown-header ${loading ? 'disabled' : ''}`} 
        onClick={toggleDropdown}
      >
        <img 
          src={selectedLanguage.flag} 
          alt={`${selectedLanguage.name} flag`} 
          className="flag-icon"
        />
        <span className="language-name">{selectedLanguage.name}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && !loading && (
        <ul className="dropdown-list">
          {languages.map((lang) => (
            <li 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={language === lang.code ? 'selected' : ''}
            >
              <img 
                src={lang.flag} 
                alt={`${lang.name} flag`} 
                className="flag-icon"
              />
              <span className="language-name">{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ------------------------------------------------------
// Main TextToSpeech Component
// ------------------------------------------------------
const TextToSpeech = () => {
  const renderClock = (seconds) => {
    const secondHandClass = `second-hand-${seconds}`;
    const minuteHandClass = `minute-hand-${seconds}`;
    
    return (
      <div className="clock-container">
        <svg viewBox="0 0 40 40" width="24" height="24">
          {/* Clock face */}
          <circle cx="20" cy="20" r="18" className="clock-face" />
          
          {/* Clock ticks */}
          <line x1="20" y1="4" x2="20" y2="6" className="clock-tick" />
          <line x1="36" y1="20" x2="34" y2="20" className="clock-tick" />
          <line x1="20" y1="36" x2="20" y2="34" className="clock-tick" />
          <line x1="4" y1="20" x2="6" y2="20" className="clock-tick" />
          
          {/* Minute hand - only shown for durations >= 60s */}
          {seconds >= 60 && (
            <line x1="20" y1="20" x2="20" y2="8" className={`minute-hand ${minuteHandClass}`} />
          )}
          
          {/* Second hand */}
          <line x1="20" y1="20" x2="20" y2="6" className={`second-hand ${secondHandClass}`} />
          
          {/* Center dot */}
          <circle cx="20" cy="20" r="1.5" className="clock-center" />
        </svg>
      </div>
    );
  };
  
  
    // Add this near the beginning of your component with other state and ref declarations
  const durationDropdownRef = useRef(null);
  
  // Add this useEffect to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDropdownOpen(prev => ({ ...prev, duration: false }));
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Speaker dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    speaker1: false,
    speaker2: false,
    duration:false
  });
  const toggleDropdown = (speakerKey) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [speakerKey]: !prev[speakerKey],
    }));
  };
  const closeDropdowns = () => {
    setDropdownOpen({ speaker1: false, speaker2: false });
  };
  
  //For generating sample audios
  // const playSample = async (speakerId) => {
  //   try {
  //     const playIconElements = document.querySelectorAll(
  //       `.play-icon[data-speaker="${speakerId}"]`
  //     );
  //     if (!playIconElements.length) return;
  //     playIconElements.forEach((playIconElement) => {
  //       const originalContent = playIconElement.innerHTML;
  //       const sampleUrl = `/assets/Voices/sample_voice_${language}_${speakerId.replace("/","_")}.wav`;
  //       const audio = new Audio(sampleUrl);
  //       audio.onplay = () => {
  //         const visualizer = document.createElement("div");
  //         visualizer.className = "mini-visualizer";
  //         for (let i = 0; i < 7; i++) {
  //           const bar = document.createElement("div");
  //           bar.className = "mini-bar";
  //           visualizer.appendChild(bar);
  //         }
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
  //       playIconElement.innerHTML = '<span className="loading-dot">...</span>';
  //       audio.play().catch(() => {
  //         playIconElement.innerHTML = originalContent;
  //       });
  //     });
  //   } catch (error) {
  //     console.error("Error playing sample:", error);
  //   }
  // };
  const videoRefs = useRef({});

  const playSample = async (speakerId) => {
    try {
      const video = videoRefs.current[speakerId];
      if (video) {
        video.currentTime = 0;
        video.play();
      }
      const playIconElements = document.querySelectorAll(
        `.play-icon[data-speaker="${speakerId}"]`
      );
      if (!playIconElements.length) return;
      playIconElements.forEach((playIconElement) => {
        const originalContent = playIconElement.innerHTML;
        const sampleUrl = `/assets/Voices/sample_voice_${language}_${speakerId.replace("/","_")}.wav`;
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
          if (video) video.pause();
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

  const [chats, setChats] = useState([]);
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
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("")

  // New state for chat menu and deletion popup
  const [openMenuChatId, setOpenMenuChatId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  // New state for chat sharing modal
  const [showChatShareModal, setShowChatShareModal] = useState(false);
  const [shareChatId, setShareChatId] = useState("");

  // For scroll-to-bottom button
  const conversationContainerRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  const token = localStorage.getItem("token");

  // List of available speakers
  const speakers = {
    en: [
      { name: "Emma", id: "p374", flag: "/assets/avatars/english/emma.mp4" },
      { name: "Sophia", id: "p250", flag: "/assets/avatars/english/sophia.mp4" },
      { name: "Michael", id: "p231", flag: "/assets/avatars/english/michael.mp4" },
      { name: "John", id: "p232", flag: "/assets/avatars/english/john.mp4" },
      { name: "Daniel", id: "p228", flag: "/assets/avatars/english/daniel.mp4" },
      { name: "Olivia", id: "p243", flag: "/assets/avatars/english/olivia.mp4" }
    ],
     hi: [
      { name: "Sita", id: "v2/hi_speaker_1" ,flag: "/assets/avatars/Hindi/sita.mp4"},
      { name: "Priya", id: "v2/hi_speaker_0" , flag: "/assets/avatars/Hindi/priya.mp4"},
      { name: "Amit", id: "v2/hi_speaker_2",flag: "/assets/avatars/Hindi/amit.mp4" },
      { name: "Rahul", id: "v2/hi_speaker_5",flag: "/assets/avatars/Hindi/rahul.mp4"},
    ],
    mr: [
      { name: "Aarohi", id: "mr-IN-AarohiNeural", flag: "/assets/avatars/mr/arohi.mp4" },
      { name: "Manohar", id: "mr-IN-ManoharNeural", flag: "/assets/avatars/mr/manohar.mp4" }
    ],
    gu: [
      { name: "Dhwani", id: "gu-IN-DhwaniNeural", flag: "/assets/avatars/gu/dhwani.mp4" },
      { name: "Niranjan", id: "gu-IN-NiranjanNeural", flag: "/assets/avatars/gu/nira.mp4" }
    ],
    es: [
      { name: "Carlos", id: "v2/es_speaker_0", flag: "/assets/avatars/es/carlos.mp4" },
      { name: "Sofia", id: "v2/es_speaker_8", flag: "/assets/avatars/es/sophia.mp4" },
      { name: "Diego", id: "v2/es_speaker_3", flag: "/assets/avatars/es/diego.mp4" },
      { name: "Lucia", id: "v2/es_speaker_9", flag: "/assets/avatars/es/lucia.mp4" }
    ],
    fr: [
      { name: "Pierre", id: "v2/fr_speaker_4", flag: "/assets/avatars/french/Pierrefinal.mp4" },
      { name: "Marie", id: "v2/fr_speaker_5", flag: "/assets/avatars/french/marie.mp4" },
      { name: "Julien", id: "v2/fr_speaker_3", flag: "/assets/avatars/french/julien.mp4" },
      { name: "Camille", id: "v2/fr_speaker_2", flag: "/assets/avatars/french/camilie.mp4" }
    ],
    de: [
      { name: "Hans", id: "v2/de_speaker_0", flag: "/assets/avatars/German/Hans.mp4"},
      { name: "Anna", id: "v2/de_speaker_3" ,flag: "/assets/avatars/German/Anna.mp4"},
      { name: "Fritz", id: "v2/de_speaker_2" ,flag: "/assets/avatars/German/Fritz.mp4"},
      { name: "Greta", id: "v2/de_speaker_8",flag: "/assets/avatars/German/Greta.mp4" }
    ],
    it: [
      { name: "Luca", id: "v2/it_speaker_0", flag: "/assets/avatars/Italian/Luca.mp4"},
      { name: "Giulia", id: "v2/it_speaker_2", flag: "/assets/avatars/Italian/Giulia.mp4"},
      { name: "Marco", id: "v2/it_speaker_3", flag: "/assets/avatars/Italian/Marco.mp4"},
      { name: "Francesca", id: "v2/it_speaker_7", flag: "/assets/avatars/Italian/Francesca.mp4"}
    ],
    ja: [
      { name: "Hiroshi", id: "v2/ja_speaker_2",flag: "/assets/avatars/Japanese/Hiroshi.mp4" },
      { name: "Yuki", id: "v2/ja_speaker_4",flag: "/assets/avatars/Japanese/Yuki.mp4" },
      { name: "Takumi", id: "v2/ja_speaker_6",flag: "/assets/avatars/Japanese/Takumi.mp4" },
      { name: "Sakura", id: "v2/ja_speaker_8",flag: "/assets/avatars/Japanese/Sakura.mp4" }
    ],
    zh: [
      { name: "Wei", id: "v2/zh_speaker_0" ,flag: "/assets/avatars/Chinese/Wei.mp4"},
      { name: "Mei", id: "v2/zh_speaker_4" ,flag: "/assets/avatars/Chinese/Mei.mp4"},
      { name: "Li", id: "v2/zh_speaker_8", flag: "/assets/avatars/Chinese/Li.mp4"},
      { name: "Xia", id: "v2/zh_speaker_9",flag: "/assets/avatars/Chinese/Xia.mp4" }
    ],
    ru: [
      { name: "Ivan", id: "v2/ru_speaker_0", flag: "/assets/avatars/ru/ivan.mp4" },
      { name: "Anastasia", id: "v2/ru_speaker_5", flag: "/assets/avatars/ru/Anastasia.mp4" },
      { name: "Dmitry", id: "v2/ru_speaker_1", flag: "/assets/avatars/ru/dmitry.mp4" },
      { name: "Ekaterina", id: "v2/ru_speaker_9", flag: "/public/assets/avatars/ru/Ekaterina.mp4" }
    ],
    pt: [
      { name: "João", id: "v2/pt_speaker_0", flag: "/assets/avatars/pt/João.mp4" },
      { name: "Miguel", id: "v2/pt_speaker_1", flag: "/assets/avatars/pt/Miguel.mp4" },
      { name: "Carlos", id: "v2/pt_speaker_2", flag: "/assets/avatars/pt/Carlos.mp4" },
      { name: "Rafael", id: "v2/pt_speaker_3", flag: "/assets/avatars/pt/Rafael.mp4" }
    ],
    ko: [
      { name: "Min-Jun", id: "v2/ko_speaker_0", flag: "/assets/avatars/ko/Jun.mp4" },//female
      { name: "Ji-Young", id: "v2/ko_speaker_1", flag: "/assets/avatars/ko/Young.mp4" },//male
      { name: "Seung-Hyun", id: "v2/ko_speaker_2", flag: "/assets/avatars/ko/Hyun.mp4" },//male
      { name: "Hye-Jin", id: "v2/ko_speaker_3", flag: "/assets/avatars/ko/Hye-Jin.mp4" }//male
    ],
    tr: [
      { name: "Mehmet", id: "v2/tr_speaker_0", flag: "/assets/avatars/tr/mehmet.mp4"},
      { name: "Elif", id: "v2/tr_speaker_4", flag: "/assets/avatars/tr/elif.mp4" },
      { name: "Ahmet", id: "v2/tr_speaker_8", flag: "/assets/avatars/tr/ahmet.mp4" },
      { name: "Zeynep", id: "v2/tr_speaker_5", flag: "/assets/avatars/tr/zeynep.mp4" }
    ]
  };
  const selectedSpeaker1 = speakers[language]?.find((sp) => sp.id === speaker1);
  const selectedSpeaker2 = speakers[language]?.find((sp) => sp.id === speaker2);
  


  // ------------------------------------------------------
  // Load Chats from Backend
  // ------------------------------------------------------
  const loadChats = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadChats.isLoading) {
      console.log('Load chats already in progress');
      return;
    }
  
    // Create an abort controller
    const controller = new AbortController();
  
    try {
      // Set loading flag
      loadChats.isLoading = true;
  
      // Clear any previous errors
      setError(null);
  
      // Check for token
      if (!token) {
        setError("Authentication token required. Please log in.");
        return;
      }
  
      // Make API call with abort signal
      const response = await axios.get(`${backendUrl}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
  
      // Process chats
      if (response.data.length === 0) {
        // Create a new chat if no chats exist
        const createResponse = await axios.post(
          `${backendUrl}/api/chats/new`,
          {},
          { 
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          }
        );
        
        const newChat = createResponse.data.chat;
        newChat.title = "New Chat";
        
        setChats([newChat]);
        setActiveChatIndex(0);
        localStorage.setItem("activeChatId", newChat.chatId);
      } else {
        // Transform existing chats to ensure they have a title
        const transformedChats = response.data.map(chat => ({
          ...chat,
          title: chat.title && typeof chat.title === 'string' && chat.title.trim() !== "" 
            ? chat.title.trim() 
            : "New Chat"
        }));
        setChats(transformedChats);
  
        // Determine active chat
        const storedActiveChatId = localStorage.getItem("activeChatId");
        if (storedActiveChatId) {
          const activeIndex = transformedChats.findIndex(
            (chat) => chat.chatId === storedActiveChatId
          );
          
          setActiveChatIndex(activeIndex !== -1 ? activeIndex : 0);
        } else {
          setActiveChatIndex(0);
        }
      }
  
    } catch (err) {
      // Handle different types of errors
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else if (err.response) {
        // The request was made and the server responded with a status code
        console.error("Error loading chats:", err.response.data);
        setError(err.response.data.error || "Failed to load chats");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server");
      } else {
        // Something happened in setting up the request
        console.error("Error", err.message);
        setError("An unexpected error occurred");
      }
    } finally {
      // Reset loading flag
      loadChats.isLoading = false;
    }
  
    // Return cleanup function
    return () => {
      controller.abort(); // Cancel the request if component unmounts
    };
  }, [token, backendUrl]);
  
  // Add a static property to track loading state
  loadChats.isLoading = false;

  // ------------------------------------------------------
  // Create New Chat
  // ------------------------------------------------------
  const createNewChat = async () => {
    if (!token) {
      setError("Authentication token required. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/chats/new`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newChat = response.data.chat;
      newChat.title = newChat.title || "New Chat";
      setChats((prevChats) => {
        const updated = [...prevChats, newChat];
        setActiveChatIndex(updated.length - 1);
        localStorage.setItem("activeChatId", newChat.chatId);
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
        `${backendUrl}/api/chats/${chatId}/audio`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.history) {
        const historyAsConversation = response.data.history.map((file) => ({
          _id: file._id,
          query: file.requestedText,
          audio: `${backendUrl}/api/tts-audio/${file._id}`,
          timestamp: file.uploadDate,
        }));
        setChats((prevChats) =>
          prevChats.map((c) => {
            if (c.chatId === chatId) {
              const existingConversation = c.conversation || [];
              const merged = [...existingConversation];
              historyAsConversation.forEach((hc) => {
                const duplicate = merged.find((m) => m._id === hc._id);
                if (!duplicate) {
                  merged.push(hc);
                }
              });
              merged.sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
              );
              return { ...c, conversation: merged };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error("Error loading chat audio history:", err);
      setError(err.response?.data?.error || "Failed to load chat audio history");
    }
  };

  // ------------------------------------------------------
  // On first mount, load all chats
  // ------------------------------------------------------
  // ------------------------------------------------------
  // On first mount, load all chats
  // ------------------------------------------------------
  useEffect(() => {
    let cleanup;
  
    const fetchChats = async () => {
      if (token) {
        cleanup = await loadChats();
      }
    };
  
    fetchChats();
  
    // Cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [loadChats, token]);

  // ------------------------------------------------------
  // Whenever activeChatIndex changes, load that chat's audio history
  // Also store the active chatId in localStorage
  // ------------------------------------------------------
  useEffect(() => {
    if (activeChatIndex !== null && chats[activeChatIndex]) {
      const chatId = chats[activeChatIndex].chatId;
      localStorage.setItem("activeChatId", chatId);
      loadChatAudioHistory(chatId);
    }
  }, [activeChatIndex, chats]);

  // ------------------------------------------------------
  // Scroll Container: Show "scroll down" button if near the top
  // ------------------------------------------------------
  useEffect(() => {
    const container = conversationContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const nearTop = container.scrollTop <= 50;
      setShowScrollDown(nearTop);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  };

  const scrollConversationToBottom = () => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  };
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ------------------------------------------------------
  // On new message or file
  // ------------------------------------------------------
  const handleTextChange = (e) => setText(e.target.value);
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setText(`Processing file: ${e.target.files[0].name}`);
    }
  };


    // Sanitize text function to add before handleSend
const sanitizeText = (text) => {
  // Remove punctuation and extra whitespaces
  const sanitized = text
    .replace(/[.,?!;:()]/g, '')  // Remove specific punctuation marks
    .trim()  // Remove leading and trailing whitespaces
    .replace(/\s+/g, ' ');  // Replace multiple spaces with single space

  // Capitalize first letter, make rest lowercase
  return sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
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
    const newTitle = sanitizeText(file ? `Uploaded file: ${file.name}` : text).substring(0, 80) || "Untitled Chat";
    const currentConversation = currentChat.conversation || [];
    setChats((prevChats) =>
      prevChats.map((chat, index) => {
        if (index === activeChatIndex) {
          const updatedConversation = [
            ...currentConversation,
            {
              query: userQuery,
              audio: null,
              timestamp: new Date().toISOString(),
            },
          ];
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
    if ((!currentChat.title || currentChat.title === "New Chat") && userQuery) {
      try {
        await axios.put(
          `${backendUrl}/api/chats/${currentChat.chatId}`,
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
      [
        "en",
        "hi",
        "mr",
        "gu",
        "es",
        "fr",
        "de",
        "it",
        "ja",
        "zh",
        "ru",
        "pt",
        "ko",
        "tr",
      ].includes(language)
    ) {
      if (speaker1) formData.append("speaker1", speaker1);
      if (speaker2) formData.append("speaker2", speaker2);
    }
    if (duration1 && duration1 > 0) {
      formData.append("duration1", duration1);
    }
    formData.append("chatId", currentChat.chatId);
    try {
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
      const storeFormData = new FormData();
      storeFormData.append("audio", audioBlob, "tts.mp3");
      storeFormData.append("text", text);
      storeFormData.append("chatId", currentChat.chatId);
      const speaker1Name = speakers[language].find(sp => sp.id === speaker1)?.name;
      if (speaker1Name) {
        storeFormData.append("speaker1Name", speaker1Name);
        console.log('Added speaker1Name to FormData:', speaker1Name);
      }
      const speaker2Name = speakers[language].find(sp => sp.id === speaker2)?.name;
        if (speaker2Name) {
    storeFormData.append("speaker2Name", speaker2Name);
    console.log('Added speakerName to FormData:', speaker2Name);
  } 

      const storeResponse = await axios.post(
        `${backendUrl}/tts-audio`,
        storeFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { fileId } = storeResponse.data;
      const permanentAudioUrl = `${backendUrl}/api/tts-audio/${fileId}`;
      setChats((prevChats) =>
        prevChats.map((chat, index) => {
          if (
            index === activeChatIndex &&
            chat.conversation &&
            chat.conversation.length > 0
          ) {
            const updatedConversation = [...chat.conversation];
            const lastIndex = updatedConversation.length - 1;
            updatedConversation[lastIndex]._id = fileId;
            updatedConversation[lastIndex].audio = permanentAudioUrl;
            return { ...chat, conversation: updatedConversation };
          }
          return chat;
        })
      );
      await loadChatAudioHistory(currentChat.chatId);
      scrollConversationToBottom();
    } catch (err) {
      console.error("Error generating/storing speech:", err);
      setError(err.response?.data?.error || "Failed to generate or store speech");
    } finally {
      setLoading(false);
      setText("");
      setFile(null);
    }
  };

  const activeChat = activeChatIndex !== null ? chats[activeChatIndex] : null;

  // ------------------------------------------------------
  // Handle Chat Share
  // ------------------------------------------------------
  const handleShareChat = (chat) => {
    setShareChatId(chat.chatId);
    setShowChatShareModal(true);
    setOpenMenuChatId(null);
  };

 // Sample Questions
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
 const SAMPLE_QUESTIONS = [
  "Can you explain how photosynthesis works?",
  "What are the main causes of climate change?",
  "Tell me about the history of the Roman Empire.",
  "How does quantum computing differ from classical computing?",
  "What are the health benefits of regular exercise?",
  "Explain the theory of relativity in simple terms.",
  "What's the process of cell division in biology?",
  "How do black holes form in space?",
  "What are the key principles of machine learning?",
  "Describe the water cycle and its importance.",
  "What is the difference between DNA and RNA?",
  "How does blockchain technology work?",
  "What led to the fall of the Berlin Wall?",
  "How do vaccines help prevent diseases?",
  "What is the significance of the Fibonacci sequence in nature?",
  "Can you explain the basics of cryptocurrency?",
  "What are the different types of renewable energy sources?",
  "How did the Industrial Revolution change the world?",
  "Why is biodiversity important for ecosystems?",
  "What are Newton's three laws of motion?"
];

// Add this handler function
const handleSampleQuestion = () => {
  setText(SAMPLE_QUESTIONS[currentQuestionIndex]);
  setCurrentQuestionIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
};

  // ------------------------------------------------------
  // Handle Chat Deletion Confirmation
  // ------------------------------------------------------
  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      await axios.delete(`${backendUrl}/api/chats/${chatToDelete.chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats((prevChats) =>
        prevChats.filter((c) => c.chatId !== chatToDelete.chatId)
      );
      if (activeChat && activeChat.chatId === chatToDelete.chatId) {
        setActiveChatIndex(0);
        localStorage.removeItem("activeChatId"); // Clear the stored active chat ID
      }
      setShowDeletePopup(false);
      setChatToDelete(null);
    } catch (err) {
      console.error("Failed to delete chat", err);
      setError("Failed to delete chat");
      setShowDeletePopup(false);
      setChatToDelete(null);
    }
  };

  const cancelDeleteChat = () => {
    setShowDeletePopup(false);
    setChatToDelete(null);
  };
  useEffect(() => {
    // Reset both speakers when language changes      Here 28/3/25 change
    setSpeaker1('');
    setSpeaker2('');
  }, [language])
  

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((prev) => !prev)}
        style={{
          position: 'relative ',
          left: sidebarOpen ? 'calc(250px - 40px)' : '20px', // Adjust based on sidebar width
          top: '50px',
         zIndex:1,
          transition: 'left 0.3s ease'
        }}
      >
        {sidebarOpen ? <ArrowLeft size={16} /> : <Menu size={16} />}
      </button>
      <div className="layout">
        <div className={`sidebar-container ${sidebarOpen ? "" : "collapsed"}`}>
          <div className={`chat-sidebar slide-in ${sidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
              <h3>Chats</h3>
              <button onClick={createNewChat} className="new-chat-btn">
                <PlusCircle size={16} /> New Chat
              </button>
            </div>
            {/* Add this search container */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="search-icon" />
              </div>
              </div>
            <div className="chat-list">
        {filteredChats.length === 0 ? (
          <p>No chats found.</p>
        ) : (
          filteredChats.map((chat, index) => {
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
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>{displayTitle}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuChatId(
                      openMenuChatId === chat.chatId ? null : chat.chatId
                    );
                  }}
                  className="menu-btn"
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenuChatId === chat.chatId && (
                  <div
                    className="chat-item-menu"
                    style={{
                      position: "absolute",
                      right: "40px",
                      top: "0",
                      background: "#fff",
                      border: "1px solid #ccc",
                      zIndex: 10
                    }}
                  >
                    <div
                      className="menu-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareChat(chat);
                      }}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Share2 size={16} style={{ marginRight: "5px" }} /> Share Chat
                    </div>
                    <div
                      className="menu-option delete-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatToDelete(chat);
                        setShowDeletePopup(true);
                        setOpenMenuChatId(null);
                      }}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        color: "red"
                      }}
                    >
                      <Trash2 size={16} style={{ marginRight: "5px" }} /> Delete Chat
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
          </div>
        </div>
    
        <div className="content-container">
          <div className={`main-content ${sidebarOpen ? "" : "closed-sidebar"}`}>
            <div className="tts-navbar">
              <h2>{activeChat ? activeChat.title || activeChat.chatId : "Chat"}</h2>
              {/* <button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button> */}
            </div>
            {error && (
              <div className="error-banner fade-in">
                <p>{error}</p>
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}
            <div className="chat-layout">
            <div
              className="conversation-container"
              ref={conversationContainerRef}
    >
    {activeChat &&
      activeChat.conversation &&
      activeChat.conversation.map((pair, index) => (
        <div key={index} className="conversation-pair fade-in">
          <div className="user-message-container">
            <button
              className="copy-button"
              onClick={async () => {
                await navigator.clipboard.writeText(pair.query);
                const button = document.querySelector(`.copy-button[data-id="${index}"]`);
                if (button) {
                  button.classList.add('copied');
                  setTimeout(() => {
                    button.classList.remove('copied');
                  }, 2000);
                }
              }}
              title="Copy text"
              data-id={index}
            >
              <Copy size={16} className="copy-icon" />
              <span className="copied-message">Copied!</span>
            </button>
            <div className="user-message">
              <p>{pair.query}</p>
            </div>
          </div>
          <div className="assistant-message">
            {pair.audio ? (
              <>
              <AudioPlayer src={pair.audio} />
              <small className="timestamp">
              {new Date(pair.timestamp).toLocaleString()}
            </small>
            </>
              
            ) : (

              <div className="loading-audio">Audio pending...</div>
            )}
            
          </div>
        </div>
      ))}
  </div>
              {/* Here are changes are done for scroll down*/}
              {showScrollDown && activeChat && activeChat.conversation && 
               activeChat.conversation.length > 0 && (
                <button className="scroll-down-button" onClick={scrollToBottom}>
                <ArrowDownCircle size={24} />
                </button>
)}
{/*                                
                               <div className="inspire-button-container">
                               <button 
  onClick={handleSampleQuestion}
  disabled={loading}
  title="Get inspired with sample questions"
  className="inspire-button"
>
  <span className="button-icon">🎯</span>
  <span className="button-text">Inspire Me!</span>
  <span className="hover-effect"></span>
</button>
</div> */}

              <div className="chat-input-fixed">
              <div className="textarea-with-inspire">
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Type your message here...."
                  disabled={loading}
                  style={{ paddingRight: '120px' }} // Make space for the button
                />
                <button 
                  onClick={handleSampleQuestion}
                  disabled={loading}
                  className="inspire-inside-button"
                  title="Get sample questions"
                >
                  <span className="icon">🧠</span>
                  Inspire Me
                </button>
              </div>
                
                <div className="input-controls"></div>
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
                <LanguageDropdown 
                    language={language}
                    setLanguage={setLanguage}
                    loading={loading}
                    closeDropdowns={closeDropdowns}
                  />
                 {/* <div className="custom-dropdown-container" ref={durationDropdownRef}>
  <div className="selected-option" onClick={() => setDropdownOpen(prev => ({ ...prev, duration: !prev.duration }))}>
    {duration1 ? (
      <>
        {renderClock(duration1)}
        <span>
          {duration1 === 30 ? "30 seconds" : 
           duration1 === 60 ? "1 minute" : 
           duration1 === 120 ? "2 minutes" : 
           "3 minutes"}
        </span>
      </>
    ) : (
      <span>Select Duration</span>
    )}
    <span className="dropdown-arrow">{dropdownOpen.duration ? '▲' : '▼'}</span>
  </div>
  
  {dropdownOpen.duration && (
    <div className="options-dropdown">
      <div 
        className={`dropdown-option ${duration1 === 30 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(30);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(30)}
        <span>30 seconds</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 60 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(60);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(60)}
        <span>1 minute</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 120 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(120);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(120)}
        <span>2 minutes</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 180 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(180);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(180)}
        <span>3 minutes</span>
      </div>
    </div>
  )}
</div> */}
<div className="custom-dropdown-container" ref={durationDropdownRef}>
  {dropdownOpen.duration && (
    <div className="options-dropdown" style={{ bottom: '100%', top: 'auto', marginBottom: '4px' }}>
      <div 
        className={`dropdown-option ${duration1 === 30 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(30);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(30)}
        <span>30 seconds</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 60 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(60);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(60)}
        <span>1 minute</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 120 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(120);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(120)}
        <span>2 minutes</span>
      </div>
      <div 
        className={`dropdown-option ${duration1 === 180 ? "selected" : ""}`}
        onClick={() => {
          setDuration1(180);
          setDropdownOpen(prev => ({ ...prev, duration: false }));
        }}
      >
        {renderClock(180)}
        <span>3 minutes</span>
      </div>
    </div>
  )}
  
  <div className="selected-option" onClick={() => setDropdownOpen(prev => ({ ...prev, duration: !prev.duration }))}>
    {duration1 ? (
      <>
        {renderClock(duration1)}
        <span>
          {duration1 === 30 ? "30 seconds" : 
           duration1 === 60 ? "1 minute" : 
           duration1 === 120 ? "2 minutes" : 
           "3 minutes"}
        </span>
      </>
    ) : (
      <span>Select Duration</span>
    )}
    <span className="dropdown-arrow">{dropdownOpen.duration ? '▲' : '▼'}</span>
  </div>
</div>

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
                      <div className="speaker-selection language-selection">
                        <div
                          className="speaker-dropdown"
                          onClick={() => toggleDropdown("speaker1")}
                        >
                          
                          <div className="dropdown-content">

                                            <div className="selected-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {selectedSpeaker1 ? (
                      <>
                        <video
                          src={selectedSpeaker1.flag}
                          muted
                          playsInline
                          className="selected-speaker-avatar"
                          preload="metadata"
                          onLoadedMetadata={(e) => e.target.pause()}
                          
                        />
                        <span>{selectedSpeaker1.name}</span>
                      </>
                    ) : (
                      "Select Speaker 1"
                    )}
                          </div>
                          <span className="dropdown-arrow1">{dropdownOpen.speaker1 ? '▲' : '▼'}</span>
                          </div>
                          {dropdownOpen.speaker1 && (
                            <div className="speaker-options options-above">
                              {speakers[language] &&
                                speakers[language].map((sp) => (
                                  <div
                                    key={sp.id}
                                    className={`speaker-option ${
                                      speaker1 === sp.id ? "selected" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSpeaker1(sp.id);
                                      toggleDropdown("speaker1");
                                    }}
                                  >
                                    <video
                                  src={sp.flag}
                                  muted
                                  loop
                                  className="tts-avatar-video "
                                  
                                  playsInline
                                  ref={(el) => (videoRefs.current[sp.id] = el)}
                                />
                                    <span>{sp.name}</span>
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
                          )}
                        </div>
                      </div>
                      <div className="speaker-selection">
                        <div
                          className="speaker-dropdown"
                          onClick={() => toggleDropdown("speaker2")}
                        >
                          <div className="dropdown-content">

                      <div className="selected-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {selectedSpeaker2 ? (
                      <>
                      <video
                      src={selectedSpeaker2.flag}
                      muted
                      playsInline
                      className="selected-speaker-avatar"
                      preload="metadata"
                      onLoadedMetadata={(e) => e.target.pause()}

                      />
                      <span>{selectedSpeaker2.name}</span>
                      </>
                      ) : (
                      "Select Speaker 2"
                      )}
                      </div>
                      <span className="dropdown-arrow2">{dropdownOpen.speaker2 ? '▲' : '▼'}</span>
                      </div>
                                                {dropdownOpen.speaker2 && (
                            <div className="speaker-options options-above">
                              {speakers[language] &&
                                speakers[language].map((sp) => (
                                  <div
                                    key={sp.id}
                                    className={`speaker-option ${
                                      speaker2 === sp.id ? "selected" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSpeaker2(sp.id);
                                      toggleDropdown("speaker2");
                                    }}
                                  >
                                    <video
                                  src={sp.flag}
                                  muted
                                  loop
                                  className="tts-avatar-video "
                                  
                                  playsInline
                                  ref={(el) => (videoRefs.current[sp.id] = el)}
                                />
                                    <span>{sp.name}</span>
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
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleSend();
                      setText("");
                    }}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeletePopup && (
        <div className="modal-overlay" style={{ position: "fixed", top:0, left:0, right:0, bottom:0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div className="modal-content" style={{ background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center", color:"black" }}>
            <p>Are you sure you want to delete this chat?</p>
            <div className="modal-actions" style={{ marginTop: "15px", display:"flex", justifyContent:"space-around" }}>
              <button onClick={confirmDeleteChat} className="confirm-delete" style={{ background: "red", color: "#fff", padding:"10px", border:"none", borderRadius:"4px", display:"flex", alignItems:"center", gap:"5px" }}>
                <Trash2 size={16} /> Yes, Delete
              </button>
              <button onClick={cancelDeleteChat} style={{ padding:"10px", border:"none", borderRadius:"4px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
            {showChatShareModal && (
        <ShareModal
          type="chat"
          id={shareChatId}
          onClose={() => setShowChatShareModal(false)}
        />
      )}
    </div>
    
  );
  
};

export default TextToSpeech;


