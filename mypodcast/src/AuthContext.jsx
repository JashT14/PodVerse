// // import React, { createContext, useContext, useEffect, useState } from "react";
// // import { default as jwt_decode } from "jwt-decode";  // Use named default import

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   // Initialize currentUser from localStorage token, if available.
// //   const [currentUser, setCurrentUser] = useState(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       try {
// //         const decoded = jwt_decode(token);
// //         return { token, ...decoded };
// //       } catch (e) {
// //         console.error("Error decoding token:", e);
// //         return null;
// //       }
// //     }
// //     return null;
// //   });

// //   const login = async (email, password) => {
// //     const res = await fetch("http://localhost:5257/api/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email, password }),
// //     });
// //     const data = await res.json();
// //     if (res.ok) {
// //       localStorage.setItem("token", data.token);
// //       const decoded = jwt_decode(data.token);
// //       setCurrentUser({ token: data.token, ...decoded, email });
// //       return true;
// //     } else {
// //       throw new Error(data.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     const res = await fetch("http://localhost:5257/api/register", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ username, email, password }),
// //     });
// //     const data = await res.json();
// //     if (res.ok) {
// //       localStorage.setItem("token", data.token);
// //       const decoded = jwt_decode(data.token);
// //       setCurrentUser({ token: data.token, ...decoded, email, displayName: username });
// //       return true;
// //     } else {
// //       throw new Error(data.error || "Registration failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };












// // import React, { createContext, useContext, useState } from "react";
// // import axios from "axios";

// // // A simple function to decode a JWT token (decodes the payload)
// // function decodeToken(token) {
// //   try {
// //     const payload = token.split('.')[1];
// //     const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
// //     const jsonPayload = decodeURIComponent(
// //       atob(base64)
// //         .split('')
// //         .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
// //         .join('')
// //     );
// //     return JSON.parse(jsonPayload);
// //   } catch (e) {
// //     console.error("Failed to decode token:", e);
// //     return null;
// //   }
// // }

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   // Initialize currentUser from localStorage token if available.
// //   const [currentUser, setCurrentUser] = useState(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       const decoded = decodeToken(token);
// //       return { token, ...decoded };
// //     }
// //     return null;
// //   });

// //   const login = async (email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/login", { email, password });
// //       const data = res.data;
// //       localStorage.setItem("token", data.token);
// //       const decoded = decodeToken(data.token);
// //       setCurrentUser({ token: data.token, ...decoded, email });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/register", { username, email, password });
// //       const data = res.data;
// //       localStorage.setItem("token", data.token);
// //       const decoded = decodeToken(data.token);
// //       setCurrentUser({ token: data.token, ...decoded, email, displayName: username });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Registration failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };




// // // src/AuthContext.jsx
// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import axios from "axios";

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [currentUser, setCurrentUser] = useState(null);

// //   // On initial load, if a token exists in localStorage, load the user's profile.
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       axios
// //         .post("http://localhost:5257/api/profile", { token })
// //         .then((res) => {
// //           setCurrentUser({ token, ...res.data });
// //         })
// //         .catch(() => {
// //           localStorage.removeItem("token");
// //         });
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/login", { email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile from Firestore
// //       const profileRes = await axios.post("http://localhost:5257/api/profile", { token });
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/register", { username, email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile from Firestore so that displayName is correctly loaded
// //       const profileRes = await axios.post("http://localhost:5257/api/profile", { token });
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Registration failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };


// // change on 21-02-25
// // // src/AuthContext.jsx
// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import axios from "axios";

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [currentUser, setCurrentUser] = useState(null);

// //   // On initial load, if a token exists in localStorage, load the user's profile.
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       axios
// //         .post("http://localhost:5257/api/profile", { token })
// //         .then((res) => {
// //           setCurrentUser({ token, ...res.data });
// //         })
// //         .catch(() => {
// //           localStorage.removeItem("token");
// //         });
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/login", { email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile so that displayName and other details are loaded
// //       const profileRes = await axios.post("http://localhost:5257/api/profile", { token });
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/register", { username, email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile so that displayName and other details are loaded correctly
// //       const profileRes = await axios.post("http://localhost:5257/api/profile", { token });
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Registration failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };









// // // src/AuthContext.jsx
// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import axios from "axios";

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [currentUser, setCurrentUser] = useState(null);

// //   // On initial load, if a token exists in localStorage, load the user's profile.
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       axios
// //         .post(
// //           "http://localhost:5257/api/profile",
// //           {},
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         )
// //         .then((res) => {
// //           setCurrentUser({ token, ...res.data });
// //         })
// //         .catch(() => {
// //           localStorage.removeItem("token");
// //         });
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/login", { email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile using the token in headers.
// //       const profileRes = await axios.post(
// //         "http://localhost:5257/api/profile",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/register", { username, email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile using the token in headers.
// //       const profileRes = await axios.post(
// //         "http://localhost:5257/api/profile",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Registration failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };













// //NEW GOOGLE SIGN IN: 10/3/25
// // src/AuthContext.jsx
// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import axios from "axios";

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [currentUser, setCurrentUser] = useState(null);

// //   // On initial load, if a token exists in localStorage, load the user's profile.
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       axios
// //         .post(
// //           "http://localhost:5257/api/profile",
// //           {},
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         )
// //         .then((res) => {
// //           setCurrentUser({ token, ...res.data });
// //         })
// //         .catch(() => {
// //           localStorage.removeItem("token");
// //         });
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/login", { email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       const profileRes = await axios.post(
// //         "http://localhost:5257/api/profile",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Login failed");
// //     }
// //   };

// //   const register = async (username, email, password) => {
// //     try {
// //       const res = await axios.post("http://localhost:5257/api/register", { username, email, password });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       const profileRes = await axios.post(
// //         "http://localhost:5257/api/profile",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Registration failed");
// //     }
// //   };

// //   const googleSignIn = async (idToken) => {
// //     try {
// //       // Send the Google ID token to your backend endpoint.
// //       const res = await axios.post("http://localhost:5257/api/google-signin", { idToken });
// //       const { token } = res.data;
// //       localStorage.setItem("token", token);
// //       // Fetch user profile using your backend's JWT token.
// //       const profileRes = await axios.post(
// //         "http://localhost:5257/api/profile",
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCurrentUser({ token, ...profileRes.data });
// //       return true;
// //     } catch (error) {
// //       throw new Error(error.response?.data?.error || "Google sign in failed");
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("token");
// //     setCurrentUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, register, googleSignIn, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthContext;


// //Added provider segeration - local for email/password - google for google login/register
// // src/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   // On initial load, if a token exists in localStorage, load the user's profile.
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const provider = localStorage.getItem("provider") || "local";
//     if (token) {
//       axios
//         .post(
//           `${backendUrl}/api/profile`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((res) => {
//           setCurrentUser({ token, provider, ...res.data });
//         })
//         .catch(() => {
//           localStorage.removeItem("token");
//           localStorage.removeItem("provider");
//         });
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await axios.post(`${backendUrl}/api/login`, { email, password });
//       const { token } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("provider", "local");
//       const profileRes = await axios.post(
//         `${backendUrl}/api/profile`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCurrentUser({ token, provider: "local", ...profileRes.data });
//       return true;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || "Login failed");
//     }
//   };

//   const register = async (username, email, password) => {
//     try {
//       const res = await axios.post(`${backendUrl}/api/register`, { username, email, password });
//       const { token } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("provider", "local");
//       const profileRes = await axios.post(
//         `${backendUrl}/api/profile`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCurrentUser({ token, provider: "local", ...profileRes.data });
//       return true;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || "Registration failed");
//     }
//   };

//   const googleSignIn = async (idToken) => {
//     try {
//       // Send the Google ID token to your backend endpoint.
//       const res = await axios.post(`${backendUrl}/api/google-signin`, { idToken });
//       const { token } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("provider", "google");
//       // Fetch user profile using your backend's JWT token.
//       const profileRes = await axios.post(
//         `${backendUrl}/api/profile`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCurrentUser({ token, provider: "google", ...profileRes.data });
//       return true;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || "Google sign in failed");
//     }
//   };
//   const requestPasswordReset = async (email) => {
//     try {
//       await axios.post("http://localhost:5257/api/forgot-password", { email });
//       return true;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || "Failed to send reset email");
//     }
//   };

//  const verifyResetToken = async (token) => {
//   try {
//     const res = await axios.get(`${backendUrl}/api/reset-password/verify/${token}`);
//     return res.data.valid;
//   } catch (error) {
//     throw new Error(error.response?.data?.error || "Invalid or expired token");
//   }
// };

//   const resetPassword = async (token, newPassword) => {
//     try {
//       await axios.post("http://localhost:5257/api/reset-password", { token, newPassword });
//       return true;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || "Failed to reset password");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("provider");
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, login, register, googleSignIn, logout,requestPasswordReset,verifyResetToken,resetPassword }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;




//above working

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // On initial load, if a token exists in localStorage, load the user's profile.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const provider = localStorage.getItem("provider") || "local";
    if (token) {
      try {
        // Decode the token to get immediate access to basic info
        const decoded = jwtDecode(token);
        
        // Set the user immediately with the token data
        setCurrentUser({
          token,
          provider,
          id: decoded.id,
          email: decoded.email,
          displayName: decoded.displayName || decoded.email?.split('@')[0] || "User"
        });
        
        // Fetch the full profile including the profile picture
        axios
          .post(
            `${backendUrl}/api/profile`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            setCurrentUser(prevUser => ({ 
              ...prevUser,
              ...res.data,
            }));
          })
          .catch(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("provider");
            setCurrentUser(null);
          });
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("provider");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/login`, { email, password });
      const { token } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("provider", "local");
      
      // Fetch the full profile
      const profileRes = await axios.post(
        `${backendUrl}/api/profile`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentUser({ 
        token, 
        provider: "local", 
        ...profileRes.data
      });
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/register`, { username, email, password });
      const { token } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("provider", "local");
      
      // Fetch the full profile
      const profileRes = await axios.post(
        `${backendUrl}/api/profile`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentUser({ 
        token, 
        provider: "local", 
        ...profileRes.data
      });
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const googleSignIn = async (idToken) => {
    try {
      // Send the Google ID token to your backend endpoint.
      const res = await axios.post(`${backendUrl}/api/google-signin`, { idToken });
      const { token, profilePicture, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("provider", "google");
      
      // Decode token to get user info immediately
      const decoded = jwtDecode(token);
      
      // Set user immediately with basic info to avoid UI delay/flickering
      setCurrentUser({
        token,
        provider: "google",
        id: decoded.id,
        email: decoded.email,
        profilePicture: profilePicture, // Use profilePicture from direct response
        displayName: user?.displayName || decoded.displayName || decoded.email?.split('@')[0] || "User"
      });
      
      // Then fetch complete profile in the background
      axios.post(
        `${backendUrl}/api/profile`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((profileRes) => {
        // Update with full profile data when available
        setCurrentUser(prevUser => ({ 
          ...prevUser,
          ...profileRes.data,
        }));
      })
      .catch(err => console.error("Error fetching complete profile:", err));
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Google sign in failed");
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await axios.post(`${backendUrl}/api/forgot-password`, { email });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to send reset email");
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const res = await axios.get(`${backendUrl}/api/reset-password/verify/${token}`);
      return res.data.valid;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Invalid or expired token");
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`${backendUrl}/api/reset-password`, { token, newPassword });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to reset password");
    }
  };

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageLoadError(true);
    // Update the user profile to use a default image
    setCurrentUser(prevUser => ({
      ...prevUser,
      profilePicture: '/default-avatar.png' // Path to your default avatar
    }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("provider");
    setCurrentUser(null);
    setImageLoadError(false);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      register, 
      googleSignIn, 
      logout,
      requestPasswordReset,
      verifyResetToken,
      resetPassword,
      handleImageError,
      imageLoadError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;