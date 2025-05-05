// src/components/AudioUploader.jsx
import React from 'react';

const AudioUploader = ({ onFileUpload }) => {
  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <div className="audio-uploader">
      <input type="file" accept="audio/*" onChange={handleChange} />
      <p>Drag and drop an audio file or click to select one.</p>
    </div>
  );
};

export default AudioUploader;
