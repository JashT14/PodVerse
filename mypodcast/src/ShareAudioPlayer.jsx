import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download,
  Share2
} from "lucide-react";
import ShareModal from "./ShareModal";
import "./ShareAudioPlayer.css";

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

const AudioPlayer = ({ src }) => {
    const token = localStorage.getItem("token");
    let effectiveSrc = src;
    // If the src contains a shareToken, assume it's public and use it as-is.
    if (src && src.includes("shareToken=")) {
      effectiveSrc = src;
    } else if (src && token && !src.startsWith("blob:") && !src.includes("token=")) {
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
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
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
      link.download = "Podcast.mp3";
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
        <ShareModal
          type="audio"
          id={extractFileIdFromSrc(src)}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

AudioPlayer.propTypes = {
  src: PropTypes.string,
};

export default AudioPlayer;
