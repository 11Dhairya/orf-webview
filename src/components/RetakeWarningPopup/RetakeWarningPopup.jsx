import React from 'react';
import './RetakeWarningPopup.css';
import warningIcon from '../../assets/warning.png'; 

const RetakeWarningPopup = ({
    onRejectReRecordingAudio,
    onConfirmReRecordingAudio,
    showDeletePopup,
    onCancelDeleteRecording,
    onDeleteRecording
  }) => (
    <div>
      {!showDeletePopup ? (
        <div className="warning-popup">
          <div className="heading">ORF Assessment</div>
          <div className="content">
            <div className="warning-container">
              <div className="warning-content">
                <img src={warningIcon} alt="Warning" className="warning-icon" />
                <div className="warning-text">Warning</div>
              </div>
              <div className="warning-message">
                This will delete the existing recording. Are you sure you want to
                record the audio again?
              </div>
              <div className="button-container">
                <button onClick={onRejectReRecordingAudio} className="cancel-button">
                  No
                </button>
                <button onClick={onConfirmReRecordingAudio} className="confirm-button">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="warning-popup">
          <div className="heading">ORF Assessment</div>
          <div className="content">
            <div className="warning-container">
              <div className="warning-content">
                <img src={warningIcon} alt="Warning" className="warning-icon" />
                <div className="warning-text">Warning</div>
              </div>
              <div className="warning-message">
                Are you sure you want to delete the recording?
              </div>
              <div className="button-container">
                <button onClick={onCancelDeleteRecording} className="cancel-button-1">
                  Cancel
                </button>
                <button onClick={onDeleteRecording} className="confirm-button-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  export default RetakeWarningPopup;