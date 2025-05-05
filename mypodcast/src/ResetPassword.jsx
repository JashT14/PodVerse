// import  { useState, useEffect } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import "./AuthForm.css";

// const ResetPassword = () => {
//   const { resetPassword, verifyResetToken } = useAuth();
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [notice, setNotice] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tokenValid, setTokenValid] = useState(false);
//   const [tokenChecked, setTokenChecked] = useState(false);
//   const { token } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkToken = async () => {
//       if (token) {
//         try {
//           const isValid = await verifyResetToken(token);
//           setTokenValid(isValid);
//         // eslint-disable-next-line no-unused-vars
//         } catch (error) {
//           setTokenValid(false);
//         }
//         setTokenChecked(true);
//       }
//     };

//     checkToken();
//   }, [token, verifyResetToken]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotice("");
//     setLoading(true);

//     if (password !== confirmPassword) {
//       setNotice("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       await resetPassword(token, password);
//       navigate("/login", { state: { notice: "Password has been reset successfully. You can now login with your new password." } });
//     } catch (error) {
//       setNotice(error.message);
//     }
    
//     setLoading(false);
//   };

//   if (!tokenChecked) {
//     return (
//       <div className="auth-container fade-in">
//         <div className="auth-form slide-up">
//           <h2>Verifying...</h2>
//           <p>Please wait while we verify your reset token.</p>
//         </div>
//       </div>
//     );
//   }

//   if (!tokenValid) {
//     return (
//       <div className="auth-container fade-in">
//         <div className="auth-form slide-up">
//           <h2>Invalid or Expired Link</h2>
//           <p>
//             This password reset link is invalid or has expired. Please request a new one.
//           </p>
//           <div className="auth-switch">
//             <Link to="/forgot-password" className="link">
//               Request New Reset Link
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="auth-container fade-in">
//       <form className="auth-form slide-up" onSubmit={handleSubmit}>
//         <h2>Reset Password</h2>
//         {notice && <div className="notice">{notice}</div>}
//         <div className="form-group">
//           <label htmlFor="password">New Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your new password"
//             className="input-field"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="confirmPassword">Confirm New Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm your new password"
//             className="input-field"
//             required
//           />
//         </div>
//         <button type="submit" className="button primary-button">
//           {loading ? "Please wait..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

//By neel 3/425
import  { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthForm.css";

const ResetPassword = () => {
  const { resetPassword, verifyResetToken } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const isValid = await verifyResetToken(token);
          setTokenValid(isValid);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          setTokenValid(false);
        }
        setTokenChecked(true);
      }
    };

    checkToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    setLoading(true);

    if (password !== confirmPassword) {
      setNotice("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      navigate("/login", { state: { notice: "Password has been reset successfully. You can now login with your new password." } });
    } catch (error) {
      setNotice(error.message);
    }
    
    setLoading(false);
  };

  if (!tokenChecked) {
    return (
      <div className="auth-container fade-in">
        <div className="auth-form slide-up">
          <h2>Verifying...</h2>
          <p>Please wait while we verify your reset token.</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container fade-in">
        <div className="auth-form slide-up">
          <h2>Invalid or Expired Link</h2>
          <p>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="auth-switch">
            <Link to="/forgot-password" className="link">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container fade-in">
      <form className="auth-form slide-up" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {notice && <div className="notice">{notice}</div>}
        <div className="form-group">
          
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="button primary-button">
          {loading ? "Please wait..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;