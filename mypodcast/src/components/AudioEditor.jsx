// src/components/AudioEditor.jsx
import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioEditor = ({ file }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#333',
        cursorColor: '#ff0000',
        height: 200,
      });

      // Create a blob URL for the uploaded file and load it into WaveSurfer
      const blobUrl = URL.createObjectURL(file);
      wavesurferRef.current.load(blobUrl);
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [file]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="audio-editor">
      <div ref={waveformRef} className="waveform" />
      <button onClick={handlePlayPause} className="control-btn">
        Play / Pause
      </button>
      {/* Additional controls (cut, trim, effects) can be added here */}
    </div>
  );
};

export default AudioEditor;
