import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Instructions.css';
import imagepath from '../../assets/talking.png';
const Instructions = () => {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate('/vachan-assessment');
  };
  return (
    <div className="container">
      <div className="illustration">
        <img src={imagepath} alt="Illustration" />
      </div>
      <div className="text-section">
        <div className="text-line">
          <i className="icon mic-icon"></i>
          <span>Make sure your microphone is working properly</span>
        </div>
        <div className="text-line">
          <i className="icon wave-icon"></i>
          <span>Try to avoid background noise while recording.</span>
        </div>
        <div className="text-line">
          <i className="icon timer-icon"></i>
          <span>Keep the recording lighter than 5 seconds</span>
        </div>
        <div className="text-line">
          <i className="icon phone-icon"></i>
          <span>Keep the phone near the balcony for better reception.</span>
        </div>
      </div>
      <button className="start-button" onClick={handleStartClick}>Start</button>
    </div>
  );
}

export default Instructions;
