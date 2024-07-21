import React from 'react';
import './Header.css';
import speakingIcon from '../../assets/speaking.png';

const Header = () => (
  <div className="header-container">
    <h1 className="header-title">ORF Assessment</h1>
    <div className="header-content">
      <div className="header-speak-container">
        <img src={speakingIcon} alt="Speak the Following" className="header-voice-icon" />
        <span className="header-speak-text">Speak the Following</span>
      </div>
      <a href="landing-page" className="header-instructions">Instructions</a>
    </div>
  </div>
);

export default Header;
