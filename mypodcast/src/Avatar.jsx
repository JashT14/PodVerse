// /* eslint-disable no-irregular-whitespace */
// //FROM NEEL - 9-10/04/2025
// import  { useState, useRef, useEffect } from 'react';
// import { Share2, Trash2, Edit } from 'lucide-react';
// import {
//   Menu,
//   ArrowRight,
// } from "lucide-react";
// import ShareModal from './ShareModal';
// // import CustomVideoPlayer from './CustomVideoPlayer';
// import './Avatar.css';

// const NODE_BACKEND_URL = 'http://localhost:5257';
// const FLASK_BACKEND_URL = 'http://localhost:5002';

// const generateThumbnail = (videoBlob) => {
//   return new Promise((resolve, reject) => {
//     const video = document.createElement('video');
//     video.autoplay = false;
//     video.muted = true;
//     video.src = URL.createObjectURL(videoBlob);
//     video.currentTime = 0.1;
    
//     video.onloadeddata = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       canvas.toBlob((blob) => {
//         resolve(blob);
//         URL.revokeObjectURL(video.src);
//       }, 'image/jpeg', 0.8);
//     };
    
//     video.onerror = () => {
//       reject(new Error('Failed to load video for thumbnail generation'));
//       URL.revokeObjectURL(video.src);
//     };
//   });
// };

// const Avatar = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedAudio, setSelectedAudio] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
//   const [scriptText, setScriptText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingVideos, setIsLoadingVideos] = useState(false);
//   const [error, setError] = useState(null);
//   const [userAvatars, setUserAvatars] = useState([]);
//   const [selectedPreviousVideo, setSelectedPreviousVideo] = useState(null);
//   const [selectedAvatarId, setSelectedAvatarId] = useState(null);
//   const [resultVideoUrl, setResultVideoUrl] = useState(null);
//   const [resultVideoId, setResultVideoId] = useState(null);
//   const [shareLink, setShareLink] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('text');
//   const [detectedGender, setDetectedGender] = useState(null); // 'male' or 'female'
//   const [isDetectingGender, setIsDetectingGender] = useState(false);
//   const [activeOptionsMenuId, setActiveOptionsMenuId] = useState(null);
//   const [shareId, setShareId] = useState(null);
//   const fileInputRef = useRef(null);
//   const audioInputRef = useRef(null);
//   const optionsMenuRef = useRef(null);

//   const detectGenderFromImage = async (imageFile) => {
//     setIsDetectingGender(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', imageFile);
      
//       const response = await fetch(`${FLASK_BACKEND_URL}/detect-gender`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Gender detection failed');
//       }

//       const data = await response.json();
//       setDetectedGender(data.gender);
//     } catch (err) {
//       console.error('Gender detection error:', err);
//       setDetectedGender(null);
//     } finally {
//       setIsDetectingGender(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserAvatars();
    
//     // Handle clicks outside of options menu
//     const handleClickOutside = (event) => {
//       if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
//         setActiveOptionsMenuId(null);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

// // Update fetchVideoWithAuth to handle video streaming better
// const fetchVideoWithAuth = async (videoId) => {
//   try {
//     const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${videoId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch video: ${response.statusText}`);
//     }

//     const blob = await response.blob();
//     const blobUrl = URL.createObjectURL(blob);
    
//     // Update the video source for this specific video
//     const videoElement = document.querySelector(`video[data-id="${videoId}"]`);
//     if (videoElement) {
//       videoElement.src = blobUrl;
//       videoElement.load(); // Important - tells the browser to load the new source
//     }
    
//     setSelectedPreviousVideo(blobUrl);
//     setSelectedAvatarId(videoId);
//   } catch (error) {
//     console.error("Error fetching video:", error);
//     setError("Error fetching video. Please try again.");
//   }
// };

  
//   const fetchUserAvatars = async () => {
//     setIsLoadingVideos(true);
//     try {
//       const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-videos`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         console.warn('Expected JSON response but received another format');
//         if (process.env.NODE_ENV === 'development') {
//           setUserAvatars([
//             {
//               _id: 'sample1',
//               title: 'Business Introduction (Sample)',
//               createdAt: new Date().toISOString(),
//               videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample1.mp4`
//             },
//             {
//               _id: 'sample2',
//               title: 'Product Demo (Sample)',
//               createdAt: new Date(Date.now() - 86400000).toISOString(),
//               videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample2.mp4`
//             }
//           ]);
//           setIsLoadingVideos(false);
//           return;
//         }
//       }

//       if (!response.ok) {
//         throw new Error('Failed to fetch avatar videos');
//       }

//       const data = await response.json();
//       setUserAvatars(data.videos || []);
//     } catch (err) {
//       console.error('Error fetching avatar videos:', err);
//       if (process.env.NODE_ENV === 'development') {
//         setUserAvatars([
//           {
//             _id: 'sample1',
//             title: 'Business Introduction (Sample)',
//             createdAt: new Date().toISOString(),
//             videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample1.mp4`
//           },
//           {
//             _id: 'sample2',
//             title: 'Product Demo (Sample)',
//             createdAt: new Date(Date.now() - 86400000).toISOString(),
//             videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample2.mp4`
//           }
//         ]);
//       } else {
//         setError('Failed to load your avatars. Please try again later.');
//       }
//     } finally {
//       setIsLoadingVideos(false);
//     }
//   };

//   const handleFileSelection = (file) => {
//     if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
//       setSelectedFile(file);
//       const fileReader = new FileReader();
//       fileReader.onload = () => {
//         setPreviewUrl(fileReader.result);
//       };
//       fileReader.readAsDataURL(file);
//       setError(null);
//       setDetectedGender(null);
//       detectGenderFromImage(file); 
//     } else {
//       setError('Please upload a valid JPEG or PNG image');
//     }
//   };

//   const handleAudioSelection = (file) => {
//     if (file && (file.type === 'audio/wav' || file.type === 'audio/mpeg' || file.type === 'audio/mp4')) {
//       setSelectedAudio(file);
//       const fileReader = new FileReader();
//       fileReader.onload = () => {
//         setAudioPreviewUrl(fileReader.result);
//       };
//       fileReader.readAsDataURL(file);
//       setError(null);
//     } else {
//       setError('Please upload a valid WAV, MP3, or M4A audio file');
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     handleFileSelection(file);
//   };

//   const handleAudioChange = (event) => {
//     const file = event.target.files[0];
//     handleAudioSelection(file);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     const file = event.dataTransfer.files[0];
//     if (file.type.startsWith('image/')) {
//       handleFileSelection(file);
//     }
//   };

//   const handleAudioDrop = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     const file = event.dataTransfer.files[0];
//     if (file.type.startsWith('audio/')) {
//       handleAudioSelection(file);
//     }
//   };

//   const removeAudio = () => {
//     setSelectedAudio(null);
//     setAudioPreviewUrl(null);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//   const triggerAudioInput = () => {
//     audioInputRef.current.click();
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     if (!selectedFile) {
//       setError('Please select an image file');
//       return;
//     }
  
//     if (activeTab === 'text' && !scriptText.trim()) {
//       setError('Please enter a script or switch to audio upload');
//       return;
//     }
  
//     if (activeTab === 'audio' && !selectedAudio) {
//       setError('Please upload an audio file or switch to text input');
//       return;
//     }
  
//     setIsLoading(true);
//     setError(null);
//     setResultVideoUrl(null);
//     setResultVideoId(null);
  
//     try {
//       const formData = new FormData();
//       formData.append('image', selectedFile);
      
//       if (activeTab === 'text') {
//         formData.append('script', scriptText);
//       } else {
//         formData.append('audio', selectedAudio);
//       }
  
//       const flaskResponse = await fetch(`${FLASK_BACKEND_URL}/upload`, {
//         method: 'POST',
//         body: formData,
//       });
  
//       if (!flaskResponse.ok) {
//         throw new Error(`Flask backend error: ${flaskResponse.status}`);
//       }
  
//       const flaskData = await flaskResponse.json();
      
//       // Log response for debugging
//       console.log('Flask response:', flaskData);
      
//       // Check for error in response
//       if (flaskData.error) {
//         throw new Error(flaskData.error);
//       }
      
//       const videoUrl = 
//         flaskData.videoUrl || 
//         flaskData.videourl ||
//         flaskData['video.url'] || 
//         flaskData['video_url'] || 
//         flaskData.video_url;
        
//       if (!videoUrl) {
//         throw new Error('No video URL received from Flask backend');
//       }
  
//       setResultVideoUrl(videoUrl);
      
//       try {
//         // Test that the video URL is actually accessible
//         const videoTestResponse = await fetch(videoUrl, { method: 'HEAD' });
//         if (!videoTestResponse.ok) {
//           console.warn('Warning: Video URL may not be directly accessible:', videoUrl);
//         }
        
//         const proxyUrl = `${NODE_BACKEND_URL}/api/proxy-video?url=${encodeURIComponent(videoUrl)}`;
//         const videoResponse = await fetch(proxyUrl);
//         if (!videoResponse.ok) {
//           throw new Error('Failed to fetch video from Flask URL');
//         }
        
//         const videoBlob = await videoResponse.blob();
        
//         const nodeFormData = new FormData();
//         nodeFormData.append('video', videoBlob, 'avatar.mp4');
        
//         const title = activeTab === 'text' 
//           ? scriptText.substring(0, 50) 
//           : `Audio Avatar ${new Date().toLocaleDateString()}`;
        
//         nodeFormData.append('title', title);
//         nodeFormData.append('fullScript', activeTab === 'text' ? scriptText : 'Created from audio file');
  
//         const nodeResponse = await fetch(`${NODE_BACKEND_URL}/api/avatar-video`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           body: nodeFormData,
//         });
        
//         if (!nodeResponse.ok) {
//           throw new Error(`Node.js backend error: ${nodeResponse.status}`);
//         }
        
//         const nodeData = await nodeResponse.json();
        
//         if (nodeData.fileId) {
//           setResultVideoId(nodeData.fileId);
//           fetchUserAvatars();
//         } else {
//           throw new Error('No file ID received from Node.js backend');
//         }
//       } catch (nodeErr) {
//         console.error('Error storing to Node.js backend:', nodeErr);
//         const tempId = 'temp_' + Math.random().toString(36).substring(2, 15);
//         setResultVideoId(tempId);
//         setError('Video created but not saved permanently. Try again or check connection to storage server.');
//       }
      
//       // Scroll to the result section if needed
//       const resultSection = document.getElementById('result-section');
//       if (resultSection) {
//         resultSection.scrollIntoView({ behavior: 'smooth' });
//       }
//     } catch (err) {
//       console.error('Upload error:', err);
//       setError(err.message || 'Failed to process image');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePreviousVideoSelect = (videoId) => {
//     if (videoId.startsWith('sample')) {
//       setSelectedPreviousVideo(`${NODE_BACKEND_URL}/sample-videos/${videoId}.mp4`);
//       setSelectedAvatarId(videoId);
//       return;
//     }
  
//     if (videoId.startsWith('temp_')) {
//       if (resultVideoId === videoId && resultVideoUrl) {
//         setSelectedPreviousVideo(resultVideoUrl);
//         setSelectedAvatarId(videoId);
//       } else {
//         setError('This video is only temporarily available and cannot be retrieved.');
//       }
//       return;
//     }
  
//     fetchVideoWithAuth(videoId);
//   };

//   // const SidebarToggle = ({ sidebarOpen, setSidebarOpen }) => {
//   //   // Toggle sidebar function
//   //   const toggleSidebar = () => {
//   //     // If sidebar is currently open, we need to add a closing animation class before setting it to closed
//   //     if (sidebarOpen) {
//   //       const sidebar = document.querySelector('.avatar-sidebar');
//   //       sidebar.classList.add('closing');
        
//   //       // Wait for animation to finish before updating state
//   //       setTimeout(() => {
//   //         setSidebarOpen(false);
//   //         sidebar.classList.remove('closing');
//   //       }, 500); // Match animation duration (0.5s)
//   //     } else {
//   //       setSidebarOpen(true);
//   //     }
//   //   };
  
//   //   return (
//   //     <button 
//   //       className={`sidebar-toggle-button ${!sidebarOpen ? 'sidebar-closed' : ''}`} 
//   //       onClick={toggleSidebar}
//   //       aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//   //       title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//   //     >
//   //     {sidebarOpen ? (
//   //       <ArrowRight />
//   //     ) : (
//   //       <Menu />
//   //     )}
//   //     </button>
//   //   );
//   // };

//   const SidebarToggle = ({ sidebarOpen, setSidebarOpen }) => {
//     const [isVisible, setIsVisible] = useState(true);
//     const [lastScrollY, setLastScrollY] = useState(0);
  
//     // Handle scroll events to hide/show the toggle button
//     useEffect(() => {
//       const controlNavbar = () => {
//         // How far down the user has scrolled
//         const currentScrollY = window.scrollY;
        
//         // If scrolled down more than 20px, hide the button
//         // If scrolled up, show the button
//         if (currentScrollY > lastScrollY && currentScrollY > 20) {
//           setIsVisible(false);
//         } else {
//           setIsVisible(true);
//         }
        
//         // Update the last scroll position
//         setLastScrollY(currentScrollY);
//       };
  
//       // Add scroll event listener
//       window.addEventListener('scroll', controlNavbar);
  
//       // Clean up
//       return () => {
//         window.removeEventListener('scroll', controlNavbar);
//       };
//     }, [lastScrollY]);
  
//     // Toggle sidebar function
//     const toggleSidebar = () => {
//       // If sidebar is currently open, we need to add a closing animation class before setting it to closed
//       if (sidebarOpen) {
//         const sidebar = document.querySelector('.avatar-sidebar');
//         sidebar.classList.add('closing');
        
//         // Wait for animation to finish before updating state
//         setTimeout(() => {
//           setSidebarOpen(false);
//           sidebar.classList.remove('closing');
//         }, 500); // Match animation duration (0.5s)
//       } else {
//         setSidebarOpen(true);
//       }
//     };
  
//     return (
//       <button 
//         className={`sidebar-toggle-button ${!sidebarOpen ? 'sidebar-closed' : ''} ${!isVisible ? 'button-hidden' : ''}`} 
//         onClick={toggleSidebar}
//         aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//         title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//       >
//         {sidebarOpen ? (
//           <ArrowRight />
//         ) : (
//           <Menu />
//         )}
//       </button>
//     );
//   };
//   const handleDeleteAvatar = async (id) => {
//     if (id.startsWith('sample') || id.startsWith('temp_')) {
//       setUserAvatars(userAvatars.filter(avatar => avatar._id !== id));
//       if (selectedAvatarId === id) {
//         setSelectedPreviousVideo(null);
//         setSelectedAvatarId(null);
//       }
//       return;
//     }

//     try {
//       const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete avatar: ${response.status}`);
//       }

//       setUserAvatars(userAvatars.filter(avatar => avatar._id !== id));
      
//       if (selectedAvatarId === id) {
//         setSelectedPreviousVideo(null);
//         setSelectedAvatarId(null);
//       }
      
//       if (resultVideoId === id) {
//         setResultVideoUrl(null);
//         setResultVideoId(null);
//       }
//     } catch (err) {
//       console.error('Error deleting avatar:', err);
//       setError('Failed to delete avatar. Please try again.');
//     }
//   };

//   const handleRenameAvatar = async (avatar) => {
//     const newTitle = prompt("Enter new title for avatar", avatar.title);
//     if (!newTitle || newTitle.trim() === "") return;
//     try {
//       const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${avatar._id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem("token")}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ title: newTitle })
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update avatar title");
//       }
//       fetchUserAvatars();
//     } catch(err) {
//       console.error('Error renaming avatar:', err);
//       setError(err.message || 'Failed to rename avatar');
//     }
//   };

//   const openShareModal = async (videoId) => {
//     // Use the passed videoId, or fallback to resultVideoId or selectedAvatarId
//     const idToShare = videoId || resultVideoId || selectedAvatarId;
//     if (!idToShare) return;  // No valid ID, so do nothing
//     console.log(idToShare);
  
//     // Set shareId so that ShareModal gets the correct avatar ID
//     setShareId(idToShare);
    
//     // Optionally, generate the share link if your API expects a URL based on the id
//     // For example:
//     // setShareLink(`${NODE_BACKEND_URL}/api/shared-video/${idToShare}`);
    
//     // Open the share modal
//     setShowShareModal(true);
//   };
  

//   const closeShareModal = () => {
//     setShowShareModal(false);
//   };

//   const toggleOptionsMenu = (avatarId) => {
//     setActiveOptionsMenuId(activeOptionsMenuId === avatarId ? null : avatarId);
//   };

//   const getAvatarVideoUrl = (avatar) => {
//     if (avatar._id.startsWith('sample')) {
//       return `${NODE_BACKEND_URL}/sample-videos/${avatar._id}.mp4`;
//     }
//     if (avatar._id.startsWith('temp_') && avatar._id === resultVideoId) {
//       return resultVideoUrl;
//     }
//     // For regular videos, we need to set up a way to get the URL
//     return avatar.videoUrl || `${NODE_BACKEND_URL}/api/avatar-video/${avatar._id}`;
//   };

//   // Update the sidebar video rendering
// const renderVideoElement = (avatar) => {
//   const videoUrl = getAvatarVideoUrl(avatar);
  
//   return (
//     <video 
//       key={`video-${avatar._id}`}
//       controls 
//       src={videoUrl}
//       className="sidebar-video"
//       onClick={(e) => {
//         // Prevent click from triggering other handlers
//         e.stopPropagation();
//         // Toggle play/pause
//         const videoElement = e.target;
//         if (videoElement.paused) {
//           videoElement.play();
//         } else {
//           videoElement.pause();
//         }
//       }}
//       onError={(e) => {
//         console.error(`Error loading video ${avatar._id}:`, e);
//         // Try to reload once with authorization header
//         if (!e.target.dataset.retried) {
//           e.target.dataset.retried = "true";
//           fetchVideoWithAuth(avatar._id);
//         }
//       }}
//       data-id={avatar._id}
//     >
//       Your browser does not support the video tag.
//     </video>
//   );
// };

// const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className={`avatar-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>

// <SidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
// {sidebarOpen && (
//       <div className="avatar-sidebar">
//         <div className="sidebar-header">
//           <h2>Your Avatar</h2>
//           <button 
//             className="refresh-avatars-button"
//             onClick={fetchUserAvatars}
//             disabled={isLoadingVideos}
//           >
//             {isLoadingVideos ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
        
//         {/* Video players list in sidebar */}
//         <div className="sidebar-videos-list">
//           {isLoadingVideos ? (
//             <div className="loading-videos">Loading...</div>
//           ) : userAvatars.length === 0 ? (
//             <div className="no-avatars">No avatars available</div>
//           ) : (
//             userAvatars.map(avatar => (
//               <div key={avatar._id} className="sidebar-video-item">
//                 <div className="sidebar-video-wrapper">
//                   <div className="video-options-menu">
//                     <button 
//                       className="avatar-options-button"
//                       onClick={() => toggleOptionsMenu(avatar._id)}
//                     >
//                       ⋮
//                     </button>
//                     {activeOptionsMenuId === avatar._id && (
//                       <div className="avatar-options-dropdown" ref={optionsMenuRef}>
//                         <button 
//                           className="dropdown-item" 
//                           onClick={() => {
//                             openShareModal(avatar._id);
//                             setActiveOptionsMenuId(null);
//                           }}
//                         >
//                           <Share2 size={16} />
//                           <span>Share</span>
//                         </button>
//                         <button 
//                           className="dropdown-item" 
//                           onClick={() => {
//                             handleRenameAvatar(avatar);
//                             setActiveOptionsMenuId(null);
//                           }}
//                         >
//                           <Edit size={16} />
//                           <span>Rename</span>
//                         </button>
//                         <button 
//                           className="dropdown-item" 
//                           onClick={() => {
//                             handleDeleteAvatar(avatar._id);
//                             setActiveOptionsMenuId(null);
//                           }}
//                         >
//                           <Trash2 size={16} />
//                           <span>Delete</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   {renderVideoElement(avatar)}
//                   <div className="video-title">
//                     {avatar.title}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       )}

//       <div className="avatar-content">
//         <div className="avatar-header">
//           <h1>AI Avatar Creator</h1>
//           <p className="header-subtitle">Transform your image into a speaking digital avatar</p>
//         </div>
        
//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//             <button 
//               className="dismiss-error-button" 
//               onClick={() => setError(null)}
//             >
//               Dismiss
//             </button>
//           </div>
//         )}
        
//         <div className="avatar-workflow">
//           <form onSubmit={handleSubmit} className="avatar-creation-form">
//             <div className="upload-section">
//               <h2 className="section-title">1. Upload Your Image</h2>
//               <div 
//                 className="image-upload-area"
//                 onClick={triggerFileInput}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//               >
//                 <input 
//                   type="file" 
//                   ref={fileInputRef}
//                   accept="image/jpeg,image/png" 
//                   onChange={handleFileChange}
//                   style={{display: 'none'}}
//                 />
//                 {!previewUrl ? (
//                   <div className="upload-placeholder">
//                     <div className="upload-icon">📷</div>
//                     <p className="upload-text">Click to select or drag an image here</p>
//                     <small className="upload-subtext">(JPEG or PNG only)</small>
//                   </div>
//                 ) : (
//                   <div className="preview-container">
//                     <img 
//                       src={previewUrl} 
//                       alt="Preview" 
//                       className="uploaded-image-preview" 
//                     />
//                     <div className="preview-overlay">
//                       <span className="change-image-text">Click to change image</span>
//                       {isDetectingGender ? (
//                         <span className="gender-detection-loading">Detecting gender...</span>
//                       ) : detectedGender && (
//                         <span className={`gender-badge ${detectedGender}`}>
//                           {detectedGender === 'male' ? 'Male' : 'Female'}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="input-method-section">
//               <h2 className="section-title">2. Choose Input Method</h2>
//               <div className="tab-container">
//                 <button 
//                   type="button"
//                   className={`avatar-tab-button ${activeTab === 'text' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('text')}
//                 >
//                   Text
//                 </button>
//                 <button 
//                   type="button"
//                   className={`avatar-tab-button ${activeTab === 'audio' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('audio')}
//                 >
//                   Audio
//                 </button>
//               </div>
              
//               {activeTab === 'text' ? (
//                 <div className="script-section">
//                   <textarea
//                     placeholder="Enter what you want your avatar to say..."
//                     value={scriptText}
//                     onChange={(e) => setScriptText(e.target.value)}
//                     className="script-input"
//                     rows="5"
//                   />
//                   <div className="script-helper">
//                     <span className="script-counter">{scriptText.length} characters</span>
//                     <span className="script-tip">Keep it short for best results</span>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="audio-container">
//                   <input 
//                     type="file" 
//                     ref={audioInputRef}
//                     id="audio-upload" 
//                     className="file-input"
//                     accept="audio/wav,audio/mpeg,audio/mp4" 
//                     onChange={handleAudioChange}
//                     style={{ display: 'none' }}
//                   />
//                   <div 
//                     className="audio-upload-area" 
//                     onDragOver={handleDragOver}
//                     onDrop={handleAudioDrop}
//                     onClick={triggerAudioInput}
//                   >
//                     {!selectedAudio ? (
//                       <div className="audio-upload-content">
//                         <div className="audio-icon">🎤</div>
//                         <button type="button" className="audio-upload-btn">Upload Audio</button>
//                         <p className="audio-hint">Supported formats: WAV, MP3, M4A</p>
//                       </div>
//                     ) : (
//                       <div className="audio-preview">
//                         <audio controls src={audioPreviewUrl} className="audio-preview-player" />
//                         <button 
//                           type="button" 
//                           className="change-audio-btn"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             removeAudio();
//                           }}
//                         >
//                           Change Audio
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="button-section">
//               <button 
//                 type="submit" 
//                 className="generate-avatar-button"
//                 disabled={isLoading || !selectedFile || (activeTab === 'text' && !scriptText.trim()) || (activeTab === 'audio' && !selectedAudio)}
//               >
//                 {isLoading ? (
//                   <div className="loading-state">
//                     <span className="loading-spinner"></span>
//                     <span className="loading-text">Generating Avatar...</span>
//                   </div>
//                 ) : 'Generate Avatar'}
//               </button>
//             </div>
//           </form>

//           {resultVideoUrl && (
//             <div id="result-section" className="result-section">
//               <h2 className="section-title">3. Your Generated Avatar</h2>
//               <div className="result-video-container">
//               <video 
//                 controls 
//                 src={resultVideoUrl}
//                 className="result-video-player"
//               >
//                 Your browser does not support the video  tag.
//               </video>
             
//               </div>
//               <div className="result-actions">
//                 <button 
//                   className="share-button"
//                   onClick={() => openShareModal()}
//                   disabled={!resultVideoId}
//                 >
//                   <Share2 size={16} />
//                   Share Avatar
//                 </button>
//               </div>
//               <div className="result-details">
//                 <p className="result-info">
//                   {resultVideoId && !resultVideoId.startsWith('temp_') ? 
//                     'Video saved to your account' : 
//                     'Temporary video (will not be saved after session)'}
//                 </p>
//                 <p className="result-info">Generated on: {new Date().toLocaleDateString()}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showShareModal && (
//         <ShareModal 
//           isOpen={showShareModal}
//           type="avatar" 
//           id={shareId} 
//           shareUrl={shareLink}
//           onClose={closeShareModal} 
//         />
//       )}
//     </div>
//   );
// };

// export default Avatar;


//FROM NEEL - 9-10/04/2025
import  { useState, useRef, useEffect } from 'react';
import { Share2, Trash2, Edit } from 'lucide-react';
import {
  Menu,
  ArrowRight,
} from "lucide-react";
import ShareModal from './ShareModal';
// import CustomVideoPlayer from './CustomVideoPlayer';
import './Avatar.css';

const NODE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257"  ;
const FLASK_BACKEND_URL = 'http://localhost:5002';

const generateThumbnail = (videoBlob) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.autoplay = false;
    video.muted = true;
    video.src = URL.createObjectURL(videoBlob);
    video.currentTime = 0.1;
    
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(blob);
        URL.revokeObjectURL(video.src);
      }, 'image/jpeg', 0.8);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail generation'));
      URL.revokeObjectURL(video.src);
    };
  });
};

const Avatar = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [scriptText, setScriptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [error, setError] = useState(null);
  const [userAvatars, setUserAvatars] = useState([]);
  const [selectedPreviousVideo, setSelectedPreviousVideo] = useState(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [resultVideoUrl, setResultVideoUrl] = useState(null);
  const [resultVideoId, setResultVideoId] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const [detectedGender, setDetectedGender] = useState(null); // 'male' or 'female'
  const [isDetectingGender, setIsDetectingGender] = useState(false);
  const [activeOptionsMenuId, setActiveOptionsMenuId] = useState(null);
  const [shareId, setShareId] = useState(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const optionsMenuRef = useRef(null);

  const detectGenderFromImage = async (imageFile) => {
    setIsDetectingGender(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${FLASK_BACKEND_URL}/detect-gender`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gender detection failed');
      }

      const data = await response.json();
      setDetectedGender(data.gender);
    } catch (err) {
      console.error('Gender detection error:', err);
      setDetectedGender(null);
    } finally {
      setIsDetectingGender(false);
    }
  };

  useEffect(() => {
    fetchUserAvatars();
    
    // Handle clicks outside of options menu
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setActiveOptionsMenuId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

// Update fetchVideoWithAuth to handle video streaming better
const fetchVideoWithAuth = async (videoId) => {
  try {
    const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // Update the video source for this specific video
    const videoElement = document.querySelector(`video[data-id="${videoId}"]`);
    if (videoElement) {
      videoElement.src = blobUrl;
      videoElement.load(); // Important - tells the browser to load the new source
    }
    
    setSelectedPreviousVideo(blobUrl);
    setSelectedAvatarId(videoId);
  } catch (error) {
    console.error("Error fetching video:", error);
    setError("Error fetching video. Please try again.");
  }
};

  
  const fetchUserAvatars = async () => {
    setIsLoadingVideos(true);
    try {
      const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-videos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Expected JSON response but received another format');
        if (process.env.NODE_ENV === 'development') {
          setUserAvatars([
            {
              _id: 'sample1',
              title: 'Business Introduction (Sample)',
              createdAt: new Date().toISOString(),
              videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample1.mp4`
            },
            {
              _id: 'sample2',
              title: 'Product Demo (Sample)',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample2.mp4`
            }
          ]);
          setIsLoadingVideos(false);
          return;
        }
      }

      if (!response.ok) {
        throw new Error('Failed to fetch avatar videos');
      }

      const data = await response.json();
      setUserAvatars(data.videos || []);
    } catch (err) {
      console.error('Error fetching avatar videos:', err);
      if (process.env.NODE_ENV === 'development') {
        setUserAvatars([
          {
            _id: 'sample1',
            title: 'Business Introduction (Sample)',
            createdAt: new Date().toISOString(),
            videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample1.mp4`
          },
          {
            _id: 'sample2',
            title: 'Product Demo (Sample)',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            videoUrl: `${NODE_BACKEND_URL}/sample-videos/sample2.mp4`
          }
        ]);
      } else {
        setError('Failed to load your avatars. Please try again later.');
      }
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleFileSelection = (file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setError(null);
      setDetectedGender(null);
      detectGenderFromImage(file); 
    } else {
      setError('Please upload a valid JPEG or PNG image');
    }
  };

  const handleAudioSelection = (file) => {
    if (file && (file.type === 'audio/wav' || file.type === 'audio/mpeg' || file.type === 'audio/mp4')) {
      setSelectedAudio(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setAudioPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please upload a valid WAV, MP3, or M4A audio file');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileSelection(file);
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    handleAudioSelection(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      handleFileSelection(file);
    }
  };

  const handleAudioDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('audio/')) {
      handleAudioSelection(file);
    }
  };

  const removeAudio = () => {
    setSelectedAudio(null);
    setAudioPreviewUrl(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerAudioInput = () => {
    audioInputRef.current.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
  
    if (activeTab === 'text' && !scriptText.trim()) {
      setError('Please enter a script or switch to audio upload');
      return;
    }
  
    if (activeTab === 'audio' && !selectedAudio) {
      setError('Please upload an audio file or switch to text input');
      return;
    }
  
    setIsLoading(true);
    setError(null);
    setResultVideoUrl(null);
    setResultVideoId(null);
  
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      if (activeTab === 'text') {
        formData.append('script', scriptText);
      } else {
        formData.append('audio', selectedAudio);
      }
  
      const flaskResponse = await fetch(`${FLASK_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!flaskResponse.ok) {
        throw new Error(`Flask backend error: ${flaskResponse.status}`);
      }
  
      const flaskData = await flaskResponse.json();
      
      // Log response for debugging
      console.log('Flask response:', flaskData);
      
      // Check for error in response
      if (flaskData.error) {
        throw new Error(flaskData.error);
      }
      
      const videoUrl = 
        flaskData.videoUrl || 
        flaskData.videourl ||
        flaskData['video.url'] || 
        flaskData['video_url'] || 
        flaskData.video_url;
        
      if (!videoUrl) {
        throw new Error('No video URL received from Flask backend');
      }
  
      setResultVideoUrl(videoUrl);
      
      try {
        // Test that the video URL is actually accessible
        const videoTestResponse = await fetch(videoUrl, { method: 'HEAD' });
        if (!videoTestResponse.ok) {
          console.warn('Warning: Video URL may not be directly accessible:', videoUrl);
        }
        
        const proxyUrl = `${NODE_BACKEND_URL}/api/proxy-video?url=${encodeURIComponent(videoUrl)}`;
        const videoResponse = await fetch(proxyUrl);
        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video from Flask URL');
        }
        
        const videoBlob = await videoResponse.blob();
        
        const nodeFormData = new FormData();
        nodeFormData.append('video', videoBlob, 'avatar.mp4');
        
        const title = activeTab === 'text' 
          ? scriptText.substring(0, 50) 
          : `Audio Avatar ${new Date().toLocaleDateString()}`;
        
        nodeFormData.append('title', title);
        nodeFormData.append('fullScript', activeTab === 'text' ? scriptText : 'Created from audio file');
  
        const nodeResponse = await fetch(`${NODE_BACKEND_URL}/api/avatar-video`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: nodeFormData,
        });
        
        if (!nodeResponse.ok) {
          throw new Error(`Node.js backend error: ${nodeResponse.status}`);
        }
        
        const nodeData = await nodeResponse.json();
        
        if (nodeData.fileId) {
          setResultVideoId(nodeData.fileId);
          fetchUserAvatars();
        } else {
          throw new Error('No file ID received from Node.js backend');
        }
      } catch (nodeErr) {
        console.error('Error storing to Node.js backend:', nodeErr);
        const tempId = 'temp_' + Math.random().toString(36).substring(2, 15);
        setResultVideoId(tempId);
        setError('Video created but not saved permanently. Try again or check connection to storage server.');
      }
      
      // Scroll to the result section if needed
      const resultSection = document.getElementById('result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousVideoSelect = (videoId) => {
    if (videoId.startsWith('sample')) {
      setSelectedPreviousVideo(`${NODE_BACKEND_URL}/sample-videos/${videoId}.mp4`);
      setSelectedAvatarId(videoId);
      return;
    }
  
    if (videoId.startsWith('temp_')) {
      if (resultVideoId === videoId && resultVideoUrl) {
        setSelectedPreviousVideo(resultVideoUrl);
        setSelectedAvatarId(videoId);
      } else {
        setError('This video is only temporarily available and cannot be retrieved.');
      }
      return;
    }
  
    fetchVideoWithAuth(videoId);
  };

  const SidebarToggle = ({ sidebarOpen, setSidebarOpen }) => {
    // Toggle sidebar function
    const toggleSidebar = () => {
      // If sidebar is currently open, we need to add a closing animation class before setting it to closed
      if (sidebarOpen) {
        const sidebar = document.querySelector('.avatar-sidebar');
        sidebar.classList.add('closing');
        
        // Wait for animation to finish before updating state
        setTimeout(() => {
          setSidebarOpen(false);
          sidebar.classList.remove('closing');
        }, 500); // Match animation duration (0.5s)
      } else {
        setSidebarOpen(true);
      }
    };
  
    return (
      <button 
        className={`sidebar-toggle-button ${!sidebarOpen ? 'sidebar-closed' : ''}`} 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
      {sidebarOpen ? (
        <ArrowRight />
      ) : (
        <Menu />
      )}
      </button>
    );
  };

  const handleDeleteAvatar = async (id) => {
    if (id.startsWith('sample') || id.startsWith('temp_')) {
      setUserAvatars(userAvatars.filter(avatar => avatar._id !== id));
      if (selectedAvatarId === id) {
        setSelectedPreviousVideo(null);
        setSelectedAvatarId(null);
      }
      return;
    }

    try {
      const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete avatar: ${response.status}`);
      }

      setUserAvatars(userAvatars.filter(avatar => avatar._id !== id));
      
      if (selectedAvatarId === id) {
        setSelectedPreviousVideo(null);
        setSelectedAvatarId(null);
      }
      
      if (resultVideoId === id) {
        setResultVideoUrl(null);
        setResultVideoId(null);
      }
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError('Failed to delete avatar. Please try again.');
    }
  };

  const handleRenameAvatar = async (avatar) => {
    const newTitle = prompt("Enter new title for avatar", avatar.title);
    if (!newTitle || newTitle.trim() === "") return;
    try {
      const response = await fetch(`${NODE_BACKEND_URL}/api/avatar-video/${avatar._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      if (!response.ok) {
        throw new Error("Failed to update avatar title");
      }
      fetchUserAvatars();
    } catch(err) {
      console.error('Error renaming avatar:', err);
      setError(err.message || 'Failed to rename avatar');
    }
  };

  const openShareModal = async (videoId) => {
    // Use the passed videoId, or fallback to resultVideoId or selectedAvatarId
    const idToShare = videoId || resultVideoId || selectedAvatarId;
    if (!idToShare) return;  // No valid ID, so do nothing
    console.log(idToShare);
  
    // Set shareId so that ShareModal gets the correct avatar ID
    setShareId(idToShare);
    
    // Optionally, generate the share link if your API expects a URL based on the id
    // For example:
    // setShareLink(`${NODE_BACKEND_URL}/api/shared-video/${idToShare}`);
    
    // Open the share modal
    setShowShareModal(true);
  };
  

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const toggleOptionsMenu = (avatarId) => {
    setActiveOptionsMenuId(activeOptionsMenuId === avatarId ? null : avatarId);
  };

  const getAvatarVideoUrl = (avatar) => {
    if (avatar._id.startsWith('sample')) {
      return `${NODE_BACKEND_URL}/sample-videos/${avatar._id}.mp4`;
    }
    if (avatar._id.startsWith('temp_') && avatar._id === resultVideoId) {
      return resultVideoUrl;
    }
    // For regular videos, we need to set up a way to get the URL
    return avatar.videoUrl || `${NODE_BACKEND_URL}/api/avatar-video/${avatar._id}`;
  };

  // Update the sidebar video rendering
const renderVideoElement = (avatar) => {
  const videoUrl = getAvatarVideoUrl(avatar);
  
  return (
    <video 
      key={`video-${avatar._id}`}
      controls 
      src={videoUrl}
      className="sidebar-video"
      onClick={(e) => {
        // Prevent click from triggering other handlers
        e.stopPropagation();
        // Toggle play/pause
        const videoElement = e.target;
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }}
      onError={(e) => {
        console.error(`Error loading video ${avatar._id}:`, e);
        // Try to reload once with authorization header
        if (!e.target.dataset.retried) {
          e.target.dataset.retried = "true";
          fetchVideoWithAuth(avatar._id);
        }
      }}
      data-id={avatar._id}
    >
      Your browser does not support the video tag.
    </video>
  );
};

const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`avatar-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>

<SidebarToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
{sidebarOpen && (
      <div className="avatar-sidebar">
        <div className="sidebar-header">
          <h2>Your Avatar</h2>
          <button 
            className="refresh-avatars-button"
            onClick={fetchUserAvatars}
            disabled={isLoadingVideos}
          >
            {isLoadingVideos ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {/* Video players list in sidebar */}
        <div className="sidebar-videos-list">
          {isLoadingVideos ? (
            <div className="loading-videos">Loading...</div>
          ) : userAvatars.length === 0 ? (
            <div className="no-avatars">No avatars available</div>
          ) : (
            userAvatars.map(avatar => (
              <div key={avatar._id} className="sidebar-video-item">
                <div className="sidebar-video-wrapper">
                  <div className="video-options-menu">
                    <button 
                      className="avatar-options-button"
                      onClick={() => toggleOptionsMenu(avatar._id)}
                    >
                      ⋮
                    </button>
                    {activeOptionsMenuId === avatar._id && (
                      <div className="avatar-options-dropdown" ref={optionsMenuRef}>
                        <button 
                          className="dropdown-item" 
                          onClick={() => {
                            openShareModal(avatar._id);
                            setActiveOptionsMenuId(null);
                          }}
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                        <button 
                          className="dropdown-item" 
                          onClick={() => {
                            handleRenameAvatar(avatar);
                            setActiveOptionsMenuId(null);
                          }}
                        >
                          <Edit size={16} />
                          <span>Rename</span>
                        </button>
                        <button 
                          className="dropdown-item" 
                          onClick={() => {
                            handleDeleteAvatar(avatar._id);
                            setActiveOptionsMenuId(null);
                          }}
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {renderVideoElement(avatar)}
                  <div className="video-title">
                    {avatar.title}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}

      <div className="avatar-content">
        <div className="avatar-header">
          <h1>AI Avatar Creator</h1>
          <p className="header-subtitle">Transform your image into a speaking digital avatar</p>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="dismiss-error-button" 
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <div className="avatar-workflow">
          <form onSubmit={handleSubmit} className="avatar-creation-form">
            <div className="upload-section">
              <h2 className="section-title">1. Upload Your Image</h2>
              <div 
                className="image-upload-area"
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/jpeg,image/png" 
                  onChange={handleFileChange}
                  style={{display: 'none'}}
                />
                {!previewUrl ? (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">Click to select or drag an image here</p>
                    <small className="upload-subtext">(JPEG or PNG only)</small>
                  </div>
                ) : (
                  <div className="preview-container">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="uploaded-image-preview" 
                    />
                    <div className="preview-overlay">
                      <span className="change-image-text">Click to change image</span>
                      {isDetectingGender ? (
                        <span className="gender-detection-loading">Detecting gender...</span>
                      ) : detectedGender && (
                        <span className={`gender-badge ${detectedGender}`}>
                          {detectedGender === 'male' ? 'Male' : 'Female'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="input-method-section">
              <h2 className="section-title">2. Choose Input Method</h2>
              <div className="tab-container">
                <button 
                  type="button"
                  className={`avatar-tab-button ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  Text
                </button>
                <button 
                  type="button"
                  className={`avatar-tab-button ${activeTab === 'audio' ? 'active' : ''}`}
                  onClick={() => setActiveTab('audio')}
                >
                  Audio
                </button>
              </div>
              
              {activeTab === 'text' ? (
                <div className="script-section">
                  <textarea
                    placeholder="Enter what you want your avatar to say..."
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    className="script-input"
                    rows="5"
                  />
                  <div className="script-helper">
                    <span className="script-counter">{scriptText.length} characters</span>
                    <span className="script-tip">Keep it short for best results</span>
                  </div>
                </div>
              ) : (
                <div className="audio-container">
                  <input 
                    type="file" 
                    ref={audioInputRef}
                    id="audio-upload" 
                    className="file-input"
                    accept="audio/wav,audio/mpeg,audio/mp4" 
                    onChange={handleAudioChange}
                    style={{ display: 'none' }}
                  />
                  <div 
                    className="audio-upload-area" 
                    onDragOver={handleDragOver}
                    onDrop={handleAudioDrop}
                    onClick={triggerAudioInput}
                  >
                    {!selectedAudio ? (
                      <div className="audio-upload-content">
                        <div className="audio-icon">🎤</div>
                        <button type="button" className="audio-upload-btn">Upload Audio</button>
                        <p className="audio-hint">Supported formats: WAV, MP3, M4A</p>
                      </div>
                    ) : (
                      <div className="audio-preview">
                        <audio controls src={audioPreviewUrl} className="audio-preview-player" />
                        <button 
                          type="button" 
                          className="change-audio-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAudio();
                          }}
                        >
                          Change Audio
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="button-section">
              <button 
                type="submit" 
                className="generate-avatar-button"
                disabled={isLoading || !selectedFile || (activeTab === 'text' && !scriptText.trim()) || (activeTab === 'audio' && !selectedAudio)}
              >
                {isLoading ? (
                  <div className="loading-state">
                    <span className="loading-spinner"></span>
                    <span className="loading-text">Generating Avatar...</span>
                  </div>
                ) : 'Generate Avatar'}
              </button>
            </div>
          </form>

          {resultVideoUrl && (
            <div id="result-section" className="result-section">
              <h2 className="section-title">3. Your Generated Avatar</h2>
              <div className="result-video-container">
              <video 
                controls 
                src={resultVideoUrl}
                className="result-video-player"
              >
                Your browser does not support the video tag.
              </video>
             
              </div>
              <div className="result-actions">
              </div>
              <div className="result-details">
                <p className="result-info">
                  {resultVideoId && !resultVideoId.startsWith('temp_') ? 
                    'Video saved to your account' : 
                    'Temporary video (will not be saved after session)'}
                </p>
                <p className="result-info">Generated on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          isOpen={showShareModal}
          type="avatar" 
          id={shareId} 
          shareUrl={shareLink}
          onClose={closeShareModal} 
        />
      )}
    </div>
  );
};

export default Avatar;