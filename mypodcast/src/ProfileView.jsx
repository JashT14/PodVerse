// // import React, { useState, useEffect } from "react";
// // import { useAuth } from "./AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import "./ProfileView.css";

// // // Define backend URL
// // const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

// // const ProfileView = () => {
// //   const { currentUser } = useAuth();
// //   const navigate = useNavigate();
// //   const [profile, setProfile] = useState(null);
// //   const [error, setError] = useState("");

// //   // Check if the user signed in via Google
// //   const isGoogleUser = currentUser && currentUser.provider === "google";

// //   // Handlers for additional actions
// //   const handleChangePassword = () => {
// //     navigate("/profile-edit");
// //   };

// //   const handleUpdateEmail = () => {
// //     navigate("/profile-edit");
// //   };

// //   // Format duration to show minutes if > 60 seconds, otherwise show seconds
// //   const formatDuration = (seconds) => {
// //     if (!seconds && seconds !== 0) return "0";
    
// //     if (seconds > 60) {
// //       const minutes = Math.floor(seconds / 60);
// //       return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
// //     } else {
// //       return `${seconds} second${seconds !== 1 ? 's' : ''}`;
// //     }
// //   };

// //   // Fetch the profile details from the backend using the Firebase ID token.
// //   useEffect(() => {
// //     if (!currentUser || !currentUser.token) {
// //       navigate("/profile-view");
// //       return;
// //     }
// //     axios
// //       .post(`${backendUrl}/api/profile`, { token: currentUser.token })
// //       .then((response) => {
// //         setProfile(response.data);
// //       })
// //       .catch((err) => {
// //         setError(err.response?.data?.error || err.message);
// //       });
// //   }, [currentUser, navigate]);

// //   if (!currentUser) {
// //     return <div className="profile-login-message">Please login to view your profile.</div>;
// //   }

// //   if (error) {
// //     return <div className="profile-error-display">Error: {error}</div>;
// //   }

// //   if (!profile) {
// //     return (
// //       <div className="profile-loading-wrapper">
// //         <div className="profile-loading-spinner"></div>
// //         <p className="profile-loading-text">Loading profile...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className={`profile-view-wrapper ${isGoogleUser ? "profile-google-account" : ""}`}>
// //       <div className="profile-main-container">
// //         <header className="profile-title-header">
// //           <h2 className="profile-title-text">Profile Details</h2>
// //         </header>
        
// //         <div className="profile-details-card">
// //           <div className="profile-details-row">
// //             <label className="profile-field-label">Name:</label>
// //             <span className="profile-field-value">{profile.displayName || "N/A"}</span>
// //           </div>
// //           <div className="profile-details-row">
// //             <label className="profile-field-label">Email:</label>
// //             <span className="profile-field-value">{profile.email}</span>
// //           </div>
// //           <div className="profile-details-row">
// //             <label className="profile-field-label">Total Prompts:</label>
// //             <span className="profile-field-value">{profile.totalPrompts || 0}</span>
// //           </div>
// //           <div className="profile-details-row">
// //             <label className="profile-field-label">Total Duration:</label>
// //             <span className="profile-field-value">{formatDuration(profile.totalDuration)}</span>
// //           </div>
// //         </div>
        
// //         <div className="profile-primary-actions">
// //           <button className="profile-edit-button" onClick={() => navigate("/profile-edit")}>
// //             Edit Profile
// //           </button>
// //         </div>
        
// //         <div className="profile-secondary-actions">
// //           <button 
// //             className={`profile-password-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
// //             onClick={handleChangePassword}
// //             disabled={isGoogleUser}
// //           >
// //             Change Password
// //           </button>
// //           <button 
// //             className={`profile-email-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
// //             onClick={handleUpdateEmail}
// //             disabled={isGoogleUser}
// //           >
// //             Update Email
// //           </button>
// //         </div>
        
// //         {isGoogleUser && (
// //           <div className="profile-google-notice">
// //             Email and password changes are not available for Google sign-in accounts.
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfileView;


// import  { useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ProfileView.css";

// // Define backend URL
// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

// const ProfileView = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState("");
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageSrc, setImageSrc] = useState('/assets/default-avatar.png');

//   // Check if the user signed in via Google
//   const isGoogleUser = currentUser && currentUser.provider === "google";

//   // Handlers for additional actions
//   const handleChangePassword = () => {
//     navigate("/profile-edit");
//   };

//   const handleUpdateEmail = () => {
//     navigate("/profile-edit");
//   };

//   // Format duration to show minutes if > 60 seconds, otherwise show seconds
//   const formatDuration = (seconds) => {
//     if (!seconds && seconds !== 0) return "0";
    
//     if (seconds > 60) {
//       const minutes = Math.floor(seconds / 60);
//       return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
//     } else {
//       return `${seconds} second${seconds !== 1 ? 's' : ''}`;
//     }
//   };

//   // Fetch the profile details from the backend using the Firebase ID token.
//   useEffect(() => {
//     if (!currentUser || !currentUser.token) {
//       navigate("/profile-view");
//       return;
//     }
//     axios
//       .post(`${backendUrl}/api/profile`, { token: currentUser.token })
//       .then((response) => {
//         setProfile(response.data);
//       })
//       .catch((err) => {
//         setError(err.response?.data?.error || err.message);
//       });
//   }, [currentUser, navigate]);

//   // Effect to preload the profile image
//   useEffect(() => {
//     if (profile && profile.profilePicture) {
//       // Reset image loading state when profile image URL changes
//       setImageLoaded(false);
      
//       // Create a new image element to preload
//       const img = new Image();
      
//       img.onload = () => {
//         console.log("Image successfully preloaded:", profile.profilePicture);
//         setImageSrc(profile.profilePicture);
//         setImageLoaded(true);
//       };
      
//       img.onerror = () => {
//         console.log("Failed to preload image:", profile.profilePicture);
//         setImageSrc('/assets/default-avatar.png');
//         setImageLoaded(true);
//       };
      
//       // Start loading the image
//       img.src = profile.profilePicture;
//     }
//   }, [profile]);

//   useEffect(() => {
//     if (profile) {
//       console.log("Profile data:", profile);
//       console.log("Profile picture URL:", profile.profilePicture);
//     }
//   }, [profile]);

//   if (!currentUser) {
//     return <div className="profile-login-message">Please login to view your profile.</div>;
//   }

//   if (error) {
//     return <div className="profile-error-display">Error: {error}</div>;
//   }

//   if (!profile) {
//     return (
//       <div className="profile-loading-wrapper">
//         <div className="profile-loading-spinner"></div>
//         <p className="profile-loading-text">Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`profile-view-wrapper ${isGoogleUser ? "profile-google-account" : ""}`}>
//       <div className="profile-main-container">
//         <header className="profile-title-header">
//           <h2 className="profile-title-text">Profile Details</h2>
//         </header>

//         <div className="profile-avatar-container">
//           {!imageLoaded && (
//             <div className="profile-avatar-loading">
//               <div className="profile-avatar-spinner"></div>
//             </div>
//           )}
//           <img 
//             src={imageSrc}
//             alt="Profile" 
//             className={`profile-avatar-image ${imageLoaded ? 'profile-avatar-loaded' : 'profile-avatar-loading'}`}
//             style={{ display: imageLoaded ? 'block' : 'none' }}
//           />
//         </div>
        
//         <div className="profile-details-card">
//           <div className="profile-details-row">
//             <label className="profile-field-label">Name:</label>
//             <span className="profile-field-value">{profile.displayName || "N/A"}</span>
//           </div>
//           <div className="profile-details-row">
//             <label className="profile-field-label">Email:</label>
//             <span className="profile-field-value">{profile.email}</span>
//           </div>
//           <div className="profile-details-row">
//             <label className="profile-field-label">Total Prompts:</label>
//             <span className="profile-field-value">{profile.totalPrompts || 0}</span>
//           </div>
//           <div className="profile-details-row">
//             <label className="profile-field-label">Total Duration:</label>
//             <span className="profile-field-value">{formatDuration(profile.totalDuration)}</span>
//           </div>
//         </div>
        
//         <div className="profile-primary-actions">
//           <button className="profile-edit-button" onClick={() => navigate("/profile-edit")}>
//             Edit Profile
//           </button>
//         </div>
        
//         <div className="profile-secondary-actions">
//           <button 
//             className={`profile-password-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
//             onClick={handleChangePassword}
//             disabled={isGoogleUser}
//           >
//             Change Password
//           </button>
//           <button 
//             className={`profile-email-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
//             onClick={handleUpdateEmail}
//             disabled={isGoogleUser}
//           >
//             Update Email
//           </button>
//         </div>
        
//         {isGoogleUser && (
//           <div className="profile-google-notice">
//             Email and password changes are not available for Google sign-in accounts.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileView;

import  { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import LetterAvatar from './LetterAvatar';
import axios from "axios";
import "./ProfileView.css";

// Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

const ProfileView = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('/assets/default-avatar.png');

  // Check if the user signed in via Google
  const isGoogleUser = currentUser && currentUser.provider === "google";

  // Handlers for additional actions
  const handleChangePassword = () => {
    navigate("/profile-edit");
  };

  const handleUpdateEmail = () => {
    navigate("/profile-edit");
  };

  // Format duration to show minutes if > 60 seconds, otherwise show seconds
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "0";
    
    if (seconds > 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  };

  // Fetch the profile details from the backend using the Firebase ID token.
  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      navigate("/profile-view");
      return;
    }
    axios
      .post(`${backendUrl}/api/profile`, { token: currentUser.token })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      });
  }, [currentUser, navigate]);

  // Effect to preload the profile image
  useEffect(() => {
    if (profile && profile.profilePicture) {
      // Reset image loading state when profile image URL changes
      setImageLoaded(false);
      
      // Create a new image element to preload
      const img = new Image();
      
      img.onload = () => {
        console.log("Image successfully preloaded:", profile.profilePicture);
        setImageSrc(profile.profilePicture);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.log("Failed to preload image:", profile.profilePicture);
        setImageSrc('/assets/default-avatar.png');
        setImageLoaded(true);
      };
      
      // Start loading the image
      img.src = profile.profilePicture;
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      console.log("Profile data:", profile);
      console.log("Profile picture URL:", profile.profilePicture);
    }
  }, [profile]);

  if (!currentUser) {
    return <div className="profile-login-message">Please login to view your profile.</div>;
  }

  if (error) {
    return <div className="profile-error-display">Error: {error}</div>;
  }

  if (!profile) {
    return (
      <div className="profile-loading-wrapper">
        <div className="profile-loading-spinner"></div>
        <p className="profile-loading-text">Loading profile...</p>
      </div>
    );
  }


  return (
    <div className={`profile-view-wrapper ${isGoogleUser ? "profile-google-account" : ""}`}>
      <div className="profile-main-container">
        <header className="profile-title-header">
          <h2 className="profile-title-text">Profile Details</h2>
        </header>
  
        {/* Avatar container should go right after the header */}
        <div className="profile-avatar-container">
          {!imageLoaded && (
            <div className="profile-avatar-loading">
              <div className="profile-avatar-spinner"></div>
            </div>
          )}
          
          {imageLoaded && profile.profilePicture ? (
            <img 
              src={imageSrc}
              alt="Profile" 
              className="profile-avatar-image profile-avatar-loaded"
              style={{ display: 'block' }}
            />
          ) : (
            <LetterAvatar 
              email={profile.email} 
              className="profile-avatar-image profile-avatar-loaded"
            />
          )}
        </div>
        
        <div className="profile-details-card">
          <div className="profile-details-row">
            <label className="profile-field-label">Name:</label>
            <span className="profile-field-value">{profile.displayName || "N/A"}</span>
          </div>
          <div className="profile-details-row">
            <label className="profile-field-label">Email:</label>
            <span className="profile-field-value">{profile.email}</span>
          </div>
          <div className="profile-details-row">
            <label className="profile-field-label">Total Prompts:</label>
            <span className="profile-field-value">{profile.totalPrompts || 0}</span>
          </div>
          <div className="profile-details-row">
            <label className="profile-field-label">Total Duration:</label>
            <span className="profile-field-value">{formatDuration(profile.totalDuration)}</span>
          </div>
        </div>
        
        <div className="profile-primary-actions">
          <button className="profile-edit-button" onClick={() => navigate("/profile-edit")}>
            Edit Profile
          </button>
        </div>
        
        <div className="profile-secondary-actions">
          <button 
            className={`profile-password-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
            onClick={handleChangePassword}
            disabled={isGoogleUser}
          >
            Change Password
          </button>
          <button 
            className={`profile-email-button ${isGoogleUser ? "profile-button-disabled" : ""}`}
            onClick={handleUpdateEmail}
            disabled={isGoogleUser}
          >
            Update Email
          </button>
        </div>
        
        {isGoogleUser && (
          <div className="profile-google-notice">
            Email and password changes are not available for Google sign-in accounts.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
