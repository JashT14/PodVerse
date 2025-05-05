import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './PublicAvatarView.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

const PublicAvatarView = () => {
  const { id } = useParams();
  const location = useLocation();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the shareToken from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const shareToken = searchParams.get('shareToken');

  useEffect(() => {
    // Immediately return an error if shareToken is missing
    if (!shareToken) {
      setError("Share token is required");
      setLoading(false);
      return;
    }

    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/public-avatar/${id}?shareToken=${shareToken}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load avatar');
        }
        
        const data = await response.json();
        console.log(data);
        setAvatar(data.avatar);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [id, location.search, shareToken]);

  if (loading) {
    return (
      <div className="public-avatar-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-avatar-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="public-avatar-container">
      <div className="avatar-content">
        <h1 className="avatar-title">{avatar.name}</h1>
        {avatar.description && (
          <p className="avatar-description">{avatar.description}</p>
        )}
        
        <div className="video-container">
          <video
            controls
            autoPlay
            poster={avatar.thumbnailUrl}
            className="avatar-video"
          >
            <source 
              src={`${backendUrl}/api/public-avatar/${id}/video?shareToken=${shareToken}`} 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* <div className="metadata">
          <span className="created-at">
            Created: {new Date(avatar.createdAt).toLocaleDateString()}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default PublicAvatarView;
