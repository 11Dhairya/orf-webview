import React from 'react';
import './RecordingPlaybackPopup.css';
import CustomAudioPlayer from '../CustomAudioPlayer/CustomAudioPlayer';

const RecordingPlaybackPopup = ({ audioSrc, onRetake, onSave, onDelete, recordingTime }) => (
  <div className="recordingPlaybackcomponent-recording-popup">
    <div className="recordingPlaybackcomponent-recording-header">
      <img src="../../src/assets/vol_icon.png" alt="Mic Icon" className="recordingPlaybackcomponent-icon" />
      <div className="recordingPlaybackcomponent-message">Listen to the Recording!</div>
    </div>
    <div className="recordingPlaybackcomponent-audio-container">
      <div className="recordingPlaybackcomponent-audio-content">
        <div className="recordingPlaybackcomponent-recording-text">Recording</div>
        <div className="recordingPlaybackcomponent-player-delete-container">
          <CustomAudioPlayer src={audioSrc} timer={recordingTime} />
          <img src="../../src/assets/dustbin.png" alt="Trash Icon" className="recordingPlaybackcomponent-delete-icon" onClick={onDelete} />
        </div>
      </div>
    </div>
    <div className="recordingPlaybackcomponent-button-container">
      <button onClick={onSave} className="recordingPlaybackcomponent-save-button">Submit</button>
      <button onClick={onRetake} className="recordingPlaybackcomponent-retake-button">Retake</button>
    </div>
  </div>
);

export default RecordingPlaybackPopup;
