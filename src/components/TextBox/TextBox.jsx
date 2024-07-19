import React from 'react';
import './TextBox.css';

const TextBox = ({ text, textSize }) => (
  <div className="text-box">
    <p style={{ fontSize: textSize }} >{text}</p>
  </div>
);

export default TextBox;
