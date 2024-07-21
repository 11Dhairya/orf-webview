import React, { useState, useEffect } from 'react';
import './Recording.css';

const Recording = ({ onStart, onStop, isRecording, autoStartModal, recordingTime, countdown }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (autoStartModal) {
      handleStart();
    }
  }, [autoStartModal]);

  const handleStart = () => {
    setShowModal(true);
    onStart();
  };

  return (
    <div className="recording-container">
      <div className="recording-content">
        {showModal ? (
          <div className="recording-modal">
            <p className="recording-status">
              {countdown > 0 ? `Recording Starts in ${countdown} sec` : 'Recording in progress'}
            </p>
            <div className="recording-timer-container">
              <span className="recording-dot"></span>
              <span>{countdown > 0 ? '00:00' : `${String(Math.floor(recordingTime / 60)).padStart(2, '0')}:${String(recordingTime % 60).padStart(2, '0')}`}</span>
            </div>
            <button onClick={onStop} className="recording-stop-button">Stop</button>
            <p className="recording-stop-text">Tap on “Stop” to stop recording</p>
          </div>
        ) : (
          <div className="recording-modal">
            <p className="recording-status hidden">
              {countdown > 0 ? `Recording Starts in ${countdown} sec` : 'Recording in progress'}
            </p>
            <div className="recording-timer-container hidden">
              <span className="recording-dot"></span>
              <span>{countdown > 0 ? '00:00' : `${String(Math.floor(recordingTime / 60)).padStart(2, '0')}:${String(recordingTime % 60).padStart(2, '0')}`}</span>
            </div>
            <button onClick={handleStart} className="recording-start-button">Start</button>
            <p className="recording-start-text">Tap on “Start” to start recording</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recording;
