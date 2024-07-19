import React from 'react';
import './Header.css';
import speakingIcon from '../../assets/speaking.png'; // Make sure to import the speaking image

const Header = () => (
  <div className="header">
    <h1 className="heading">ORF Assessment</h1>
    <div className="header-content">
      <div className="speak-container">
        <img src={speakingIcon} alt="Speak the Following" className="voice-icon" />
        <span>Speak the Following</span>
      </div>
      <a href="landing-page">Instructions</a>
    </div>
  </div>
);

export default Header;
