import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { RotatingLines } from 'react-loader-spinner';
import './Submit.css';

const SubmitModal = ({ isOpen, isLoading, onRequestClose }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="submit-modal"
      overlayClassName="submit-modal-overlay"
      ariaHideApp={false}
    >
      <div className="submit-modal-content">
        {isLoading ? (
          <>
          <h2>Uploading audio...</h2>
          <div className="loader-container">
            <RotatingLines
              strokeColor="blue"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
            <p>Please wait while we upload your audio</p>
          </div>
          </>
        ) : (
          <div className="success-container">
            <svg className="tick-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="tick-mark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="tick-mark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <p>Recording submitted successfully.</p>
            <p>Your audio audition is being evaluated.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SubmitModal;
