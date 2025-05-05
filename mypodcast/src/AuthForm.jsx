// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import { GOOGLE_CLIENT_ID } from "./config";
// import "./AuthForm.css";

// const AuthForm = ({ mode }) => {
//   const { login, register, googleSignIn } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [notice, setNotice] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const redirectTo = location.state?.redirectTo || "/";

//   useEffect(() => {
//     if (window.google && window.google.accounts) {
//       window.google.accounts.id.initialize({
//         client_id: GOOGLE_CLIENT_ID,
//         callback: handleGoogleCallback,
//       });
//       window.google.accounts.id.renderButton(
//         document.getElementById("googleSignInDiv"),
//         { theme: "outline", size: "large" }
//       );
//     }
//   }, []);

//   const handleGoogleCallback = async (response) => {
//     try {
//       const idToken = response.credential;
//       await googleSignIn(idToken);
//       navigate(redirectTo);
//     } catch (err) {
//       setNotice("Google sign in failed.");
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotice("");
//     setLoading(true);
//     try {
//       if (mode === "login") {
//         await login(formData.email, formData.password);
//         navigate(redirectTo);
//       } else {
//         if (formData.password !== formData.confirmPassword) {
//           setNotice("Passwords do not match.");
//           setLoading(false);
//           return;
//         }
//         await register(formData.username, formData.email, formData.password);
//         navigate(redirectTo);
//       }
//     } catch (error) {
//       setNotice(error.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2 className="form-title">
//           {mode === "login" ? "Welcome to Podverse" : "Join PodVerse"}
//         </h2>
//         {notice && <div className="notice">{notice}</div>}
//         {mode === "signup" && (
//           <div className="form-group">
           
//             <input
//               type="text"
//               name="username"
//               id="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Enter your username"
//               className="input-field"
//               required
//             />
//           </div>
//         )}
//         <div className="form-group">
         
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="you@example.com"
//             className="input-field"
//             required
//           />
//         </div>
//         <div className="form-group">
          
//           <input
//             type="password"
//             name="password"
//             id="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//             className="input-field"
//             required
//           />
//         </div>
//         {mode === "signup" && (
//           <div className="form-group">
            
//             <input
//               type="password"
//               name="confirmPassword"
//               id="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm your password"
//               className="input-field"
//               required
//             />
//           </div>
//         )}
//         <button type="submit" className="button primary-button" disabled={loading}>
//           {loading ? "Please wait..." : (mode === "login" ? "Login" : "Sign Up")}
//         </button>
//         <div className="auth-switch">
//           {mode === "login" ? (<>
//             <p>
//               New to Podverse?{" "}
//               <Link to="/signup" className="link">
//                 Create an account
//               </Link>
//             </p>
//             <p>
//             <Link to="/forgot-password" className="link">
//               Forgot Password?
//             </Link>
//           </p>
//           </>
//           ) : (
//             <p>
//               Already have an account?{" "}
//               <Link to="/login" className="link">
//                 Log in
//               </Link>
//             </p>
//           )}
//         </div>
//         <div className="separator">
//           <span>OR</span>
//         </div>
//         <div className="google-signin-section">
//           <div id="googleSignInDiv" className="google-btn"></div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AuthForm;


import  { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { GOOGLE_CLIENT_ID } from "./config";
import "./AuthForm.css";
import { Eye, EyeOff } from "lucide-react";

const AuthForm = ({ mode }) => {
  const { login, register, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [emailValid, setEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const redirectTo = location.state?.redirectTo || "/";

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
    hasValidLength: false
  });

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  // Password validation function
  useEffect(() => {
    const validatePassword = (password) => {
      const hasCapital = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
      const hasValidLength = password.length >= 8 && password.length <= 18;

      setPasswordValidation({
        hasCapital,
        hasNumber,
        hasSpecial,
        hasValidLength
      });
    };

    validatePassword(formData.password);
  }, [formData.password]);

  useEffect(() => {
    // Clear form data when mode changes
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    
    // Clear any error messages
    setNotice("");
    setEmailError(false);
    setEmailValid(true);
    
    // Hide any showing passwords
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  const handleGoogleCallback = async (response) => {
    try {
      const idToken = response.credential;
      await googleSignIn(idToken);
      navigate(redirectTo);
    } catch (err) {
      setNotice("Google sign in failed.");
      console.error(err);
    }
  };

// Prevent copying password
  const preventCopy = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent right-click context menu
  const preventContextMenu = (e) => {
    e.preventDefault();
    return false;
  };


  const handleEmailBlur = () => {
    if (formData.email !== '' && !validateEmail(formData.email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Validate email when it changes
    if (e.target.name === 'email') {
      setEmailValid(validateEmail(e.target.value) || e.target.value === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    let isValid = true;
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setNotice("Please enter a valid email address.");
      setEmailValid(false);
      isValid = false;
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        navigate(redirectTo);
      } else {
        // Password validation for signup
        const { hasCapital, hasNumber, hasSpecial, hasValidLength } = passwordValidation;
        if (!(hasCapital && hasNumber && hasSpecial && hasValidLength)) {
          setNotice("Password does not meet requirements.");
          setLoading(false);
          isValid = false;
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setNotice("Passwords do not match.");
          setLoading(false);
          // Clear confirm password field
          setFormData(prev => ({
            ...prev,
            confirmPassword: ""
          }));
          isValid = false;
          
          return;
        }
        await register(formData.username, formData.email, formData.password);
        navigate(redirectTo);
      }
      
    } catch (error) {
      setNotice(error.message);
      // Clear password fields on authentication error
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    }
    if (!isValid) return;
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="form-title">
          {mode === "login" ? "Welcome to Podverse" : "Join PodVerse"}
        </h2>
        {notice && (
          <div className="notice">
            <span>{notice}</span>
            <button 
              type="button" 
              className="dismiss-notice" 
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        {mode === "signup" && (
          <div className="form-group">
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="input-field"
              required
            />
          </div>
        )}
        <div className="form-group">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`input-field ${!emailValid && formData.email !== '' ? 'invalid-input' : ''}`}
            required
          />
          {emailError && (
            <div className="validation-error animate-in">
              Please enter a valid email address
            </div>
          )}
        </div>
        <div className="form-group">
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onCopy={preventCopy}
              onPaste={preventCopy}
              onContextMenu={preventContextMenu}
              placeholder="Enter your password"
              className="input-field no-select"
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {mode === "signup" && passwordFocused && (
            <div className="password-requirements">
              <p>Password must have:</p>
              <ul>
                <li className={passwordValidation.hasCapital ? "valid" : "invalid"}>
                  At least 1 capital letter
                </li>
                <li className={passwordValidation.hasNumber ? "valid" : "invalid"}>
                  At least 1 number
                </li>
                <li className={passwordValidation.hasSpecial ? "valid" : "invalid"}>
                  At least 1 special character
                </li>
                <li className={passwordValidation.hasValidLength ? "valid" : "invalid"}>
                  Between 8-18 characters
                </li>
              </ul>
            </div>
          )}
        </div>
        {mode === "signup" && (
          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onCopy={preventCopy}
                onPaste={preventCopy}
                onContextMenu={preventContextMenu}
                placeholder="Confirm your password"
                className="input-field no-select"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}
        <button type="submit" className="button primary-button" disabled={loading}>
          {loading ? "Please wait..." : (mode === "login" ? "Login" : "Sign Up")}
        </button>
        <div className="auth-switch">
          {mode === "login" ? (
            <>
              <p>
                New to Podverse?{" "}
                <Link to="/signup" className="link">
                  Create an account
                </Link>
              </p>
              <p>
                <Link to="/forgot-password" className="link">
                  Forgot Password?
                </Link>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link">
                Log in
              </Link>
            </p>
          )}
        </div>
        <div className="separator">
          <span>OR</span>
        </div>
        <div className="google-signin-section">
          <div id="googleSignInDiv" className="google-btn"></div>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;