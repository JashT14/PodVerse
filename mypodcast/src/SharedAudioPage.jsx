import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AudioPlayer from "./ShareAudioPlayer";
import { Download, Headphones, Sun, Moon } from "lucide-react";
import "./SharedAudioPage.css";

const ShareAudioPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const shareToken = queryParams.get("shareToken");
  
  const [audioData, setAudioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Define backend URL and frontend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchAudioData = async () => {
      if (!id || !shareToken) {
        setError("Missing audio ID or share token");
        setLoading(false);
        return;
      }

      try {
        // Fetch audio metadata from /share-audio/:id endpoint
        const response = await fetch(`${backendUrl}/share-audio/${id}?shareToken=${shareToken}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch shared audio data");
        }
        
        const data = await response.json();
        setAudioData(data.audioData);
      } catch (err) {
        console.error("Error fetching shared audio:", err);
        setError("Failed to load shared audio. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudioData();
  }, [id, shareToken, backendUrl]);

  const handleDownload = async () => {
    if (!id || !shareToken) return;
    
    try {
      // Directly use the /public-audio/:id endpoint for downloading
      const audioUrl = `${backendUrl}/public-audio/${id}?shareToken=${shareToken}`;
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = audioData?.filename || "shared_audio.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  if (loading) {
    return (
      <div className="share-audio-container">
        <div className="share-audio-loading">
          <div className="share-audio-spinner"></div>
          <p className="loading-text">Loading shared audio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="share-audio-container">
        <div className="share-audio-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Explicitly construct the audio URL to use /public-audio/:id
  const audioUrl = `${backendUrl}/public-audio/${id}?shareToken=${shareToken}`;

  return (
    <div className="share-audio-container">
      
      
      <div className="share-audio-header">
        <Headphones size={32} className="share-audio-icon" />
        <h1 className="share-audio-title">{audioData?.filename || "Shared Audio"}</h1>
      </div>
      
      {audioData?.requestedText && (
        <div className="share-audio-description">
          <p>{audioData.requestedText}</p>
        </div>
      )}
      
      <div className="share-audio-player-wrapper">
        {/* Explicitly use /public-audio/:id endpoint for streaming */}
        <AudioPlayer src={audioUrl} />
      </div>
      
      <div className="share-audio-info">
        <div className="share-audio-date">
          <span>Created:</span> {audioData?.uploadDate ? new Date(audioData.uploadDate).toLocaleDateString() : "Unknown"}
        </div>
        
        <button className="share-audio-download-btn" onClick={handleDownload}>
          <Download size={16} />
          <span>Download Audio</span>
        </button>
      </div>
      
      <div className="share-audio-teaser">
        <h3>Want to create similar podcasts?</h3>
        <p>Join Podverse today and unlock the power of AI audio creation!</p>
        <button className="share-audio-cta-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      
      <div className="share-audio-footer">
        <p>Shared via Podverse</p>
      </div>
    </div>
  );
};

// Helper function to format duration from seconds
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "Unknown";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

export default ShareAudioPage;