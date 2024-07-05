// src/components/submitModal/submitModal.js

import React from 'react';
import './AudioCheck.css';

const audioCheckModalComponent = ({ isOpen, onRequestClose, onSubmit, audioSrc, isShort, onRetry }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isShort ? "Recording too short!" : "Are you sure you want to submit this recording?"}</h2>
        {isShort ? (
          <p>Your recording is less than 10 seconds. Please try recording again.</p>
        ) : (
          <div>
            <p>Listen to the recording!</p>
            <audio controls src={audioSrc} />
          </div>
        )}
        <div className={`modal-buttons ${isShort ? 'single-button' : ''}`}>
          {isShort ? (
            <button onClick={onRetry} className="retry-button">Try Again</button>
          ) : (
            <>
              <button onClick={onRequestClose} className="discard-button">Discard</button>
              <button onClick={onSubmit} className="submit-button">Submit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default audioCheckModalComponent;
