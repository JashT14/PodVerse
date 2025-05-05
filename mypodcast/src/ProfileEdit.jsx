import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileEdit.css"; // Import the CSS file

//Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

const ProfileEdit = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for password change modal.
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Load the user's profile details.
  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      navigate("/profile-edit");
      return;
    }
    axios
      .post(
        `${backendUrl}/api/profile`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      )
      .then((response) => {
        const data = response.data;
        setProfile(data);
        setDisplayName(data.displayName);
        setEmail(data.email);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      });
  }, [currentUser, navigate]);

  // Handle profile update form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const confirmUpdate = window.confirm(
      "Are you sure you want to update your profile details?"
    );
    if (!confirmUpdate) return;
    try {
      // For Google users, only update displayName.
      const payload =
        currentUser.provider === "google"
          ? { displayName }
          : { displayName, email };

      const response = await axios.post(
        `${backendUrl}/api/update-profile`,
        payload,
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setSuccess(response.data.message || "Profile updated successfully!");
      if (updateCurrentUser) {
        updateCurrentUser({ ...currentUser, ...payload });
      }
      setTimeout(() => {
        navigate("/profile-view");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Handle password change submission.
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/update-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setPasswordMsg(
        response.data.message || "Password updated successfully!"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
      }, 1500);
    } catch (err) {
      setPasswordMsg(err.response?.data?.error || err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="login-message">
        Please login to edit your profile.
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="loading-message">
        Loading profile for editing...
      </div>
    );
  }

  return (
    <div className="profile-edit container">
      <header className="profile-header">
        <h2>Edit Profile</h2>
      </header>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            className="form-input"
            required
          />
        </div>
        {/* Allow email change only for email/password users */}
        {currentUser.provider !== "google" && (
          <div className="form-group">
           
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
        )}
        <div className="button-group">
          <button type="submit" className="action-btn save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="action-btn cancel-btn"
            onClick={() => navigate("/profile-view")}
          >
            Cancel
          </button>
          {/* Show change password option only for email/password users */}
          {currentUser.provider !== "google" && (
            <button
              type="button"
              className="action-btn password-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          )}
        </div>
      </form>

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            {passwordMsg && (
              <p
                className="password-message"
                style={{
                  color: passwordMsg.includes("successfully")
                    ? "green"
                    : "red",
                }}
              >
                {passwordMsg}
              </p>
            )}
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
               
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="form-input"
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="action-btn update-btn">
                  Update Password
                </button>
                <button
                  type="button"
                  className="action-btn modal-cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
