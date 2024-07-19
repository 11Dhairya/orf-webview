import React from 'react';
import './RecordingPlaybackPopup.css';
import CustomAudioPlayer from '../CustomAudioPlayer/CustomAudioPlayer';

const RecordingPlaybackPopup = ({ audioSrc, onRetake, onSave, onDelete, recordingTime }) => (
  <div className="recording-popup">
    <div className="recording-header">
      <img src="../../src/assets/vol_icon.png" alt="Mic Icon" className="icon" />
      <div className="message">Listen to the Recording!</div>
    </div>
    <div className="audio-container">
      <div className="audio-content">
        <div className="recording-text">Recording</div>
        <div className="player-delete-container">
          <CustomAudioPlayer src={audioSrc} timer={recordingTime} />
          <img src="../../src/assets/dustbin.png" alt="Trash Icon" className="delete-icon" onClick={onDelete} />
        </div>
      </div>
    </div>
    <div className="button-container">
      <button onClick={onSave} className="save-button">Submit</button>
      <button onClick={onRetake} className="retake-button">Retake</button>
    </div>
  </div>
);

export default RecordingPlaybackPopup;
