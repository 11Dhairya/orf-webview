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
    <div className="instructions-container">
      <h1 className="title">ORF Assessment</h1>
      <hr className="divider" />
      <div className="illustration">
        <img src={imagepath} alt="Illustration" />
      </div>
      <ul className="text-section">
        <li>Make sure your microphone is working properly</li>
        <li>Try to avoid background noise while recording</li>
        <li>Keep the recording lighter than 5 seconds</li>
        <li>Keep the phone near the balcony for better reception</li>
      </ul>
      <button className="start-button" onClick={handleStartClick}>
        Start
      </button>
    </div>
  );
}

export default Instructions;
