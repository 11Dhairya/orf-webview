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
    <div className="recording">
      {showModal ? (
        <div className="start-footer">
          <p className="recording-message">
            {countdown > 0 ? `Recording Starts in ${countdown} sec` : 'Recording in progress'}
          </p>
          <div className="recording-timer">
            <span className="recording-dot"></span>
            <span>{countdown > 0 ? '00:00' : `${String(Math.floor(recordingTime / 60)).padStart(2, '0')}:${String(recordingTime % 60).padStart(2, '0')}`}</span>
          </div>
          <button onClick={onStop} className="stop-button">Stop</button>
          <p className="stop-text">Tap on “Stop” to stop recording</p>
        </div>
      ) : (
        <div className="start-footer">
          <p className="recording-message hidden">
            {countdown > 0 ? `Recording Starts in ${countdown} sec` : 'Recording in progress'}
          </p>
          <div className="recording-timer hidden">
            <span className="recording-dot"></span>
            <span>{countdown > 0 ? '00:00' : `${String(Math.floor(recordingTime / 60)).padStart(2, '0')}:${String(recordingTime % 60).padStart(2, '0')}`}</span>
          </div>
          <button onClick={handleStart} className="start-button">Start</button>
          <p className="start-text">Tap on “Start” to start recording</p>
        </div>
      )}
    </div>
  );
};

export default Recording;
