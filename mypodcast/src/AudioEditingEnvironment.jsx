// src/AudioEditingEnvironment.jsx
import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import AudioEditor from './components/AudioEditor';
import './AudioEditingEnvironment.css';

const AudioEditingEnvironment = () => {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileUpload = (file) => {
    setAudioFile(file);
  };

  return (
    <div className="audio-editor-container">
      {!audioFile ? (
        <AudioUploader onFileUpload={handleFileUpload} />
      ) : (
        <AudioEditor file={audioFile} />
      )}
    </div>
  );
};

export default AudioEditingEnvironment;
