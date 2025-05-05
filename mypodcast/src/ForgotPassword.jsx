// import  { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import "./AuthForm.css";

// const ForgotPassword = () => {
//   const { requestPasswordReset } = useAuth();
//   const [email, setEmail] = useState("");
//   const [notice, setNotice] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotice("");
//     setLoading(true);
    
//     try {
//       await requestPasswordReset(email);
//       setSuccess(true);
//     } catch (error) {
//       setNotice(error.message);
//     }
    
//     setLoading(false);
//   };

//   if (success) {
//     return (
//       <div className="auth-container fade-in">
//         <div className="auth-form slide-up">
//           <h2>Check Your Email</h2>
//           <p>
//             We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
//           </p>
//           <div className="auth-switch">
//             <Link to="/login" className="link">
//               Return to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="auth-container fade-in">
//       <form className="auth-form slide-up" onSubmit={handleSubmit}>
//         <h2>Forgot Password</h2>
//         {notice && <div className="notice">{notice}</div>}
//         <p>Enter your email address to receive a password reset link.</p>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="you@example.com"
//             className="input-field"
//             required
//           />
//         </div>
//         <button type="submit" className="button primary-button">
//           {loading ? "Please wait..." : "Send Reset Link"}
//         </button>
//         <div className="auth-switch">
//           <Link to="/login" className="link">
//             Back to Login
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;

import  { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthForm.css";

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    setLoading(true);
    
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      setNotice(error.message);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container fade-in">
        <div className="auth-form slide-up">
          <h2>Check Your Email</h2>
          <p>
            We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
          </p>
          <div className="auth-switch">
            <Link to="/login" className="link">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container fade-in">
      <form className="auth-form slide-up" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        {notice && <div className="notice">{notice}</div>}
        <p>Enter your email address to receive a password reset link.</p>
        <div className="form-group">
          
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="button primary-button">
          {loading ? "Please wait..." : "Send Reset Link"}
        </button>
        <div className="auth-switch">
          <Link to="/login" className="link">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;