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
        <div className="retakepopup-warning-popup">
          <div className="retakepopup-heading">ORF Assessment</div>
          <div className="retakepopup-content">
            <div className="retakepopup-warning-container">
              <div className="retakepopup-warning-content">
                <img src={warningIcon} alt="Warning" className="retakepopup-warning-icon" />
                <div className="retakepopup-warning-text">Warning</div>
              </div>
              <div className="retakepopup-warning-message">
                This will delete the existing recording. Are you sure you want to
                record the audio again?
              </div>
              <div className="retakepopup-button-container">
                <button onClick={onRejectReRecordingAudio} className="retakepopup-cancel-button">
                  No
                </button>
                <button onClick={onConfirmReRecordingAudio} className="retakepopup-confirm-button">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="retakepopup-warning-popup">
          <div className="retakepopup-heading">ORF Assessment</div>
          <div className="retakepopup-content">
            <div className="retakepopup-warning-container">
              <div className="retakepopup-warning-content">
                <img src={warningIcon} alt="Warning" className="retakepopup-warning-icon" />
                <div className="retakepopup-warning-text">Warning</div>
              </div>
              <div className="retakepopup-warning-message">
                Are you sure you want to delete the recording?
              </div>
              <div className="retakepopup-button-container">
                <button onClick={onCancelDeleteRecording} className="retakepopup-cancel-button-1">
                  Cancel
                </button>
                <button onClick={onDeleteRecording} className="retakepopup-confirm-button-1">
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
