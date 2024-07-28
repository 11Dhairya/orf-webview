import React, { useState } from 'react';
import './TextSize.css';

const TextSize = ({ setTextSize }) => {
  const [activeSize, setActiveSize] = useState('14px');

  const handleSizeChange = (size) => {
    const width = window.innerWidth;
    if (size === '16px' || size === '20px') {
      size = width < 1024 ? '16px' : '20px';
    }
    setTextSize(size);
    setActiveSize(size);
  };

  return (
    <div className="text-size">
      <span>Text Size</span>
      <button
        id="small-button"
        className={`size-14 ${activeSize === '14px' ? 'active' : ''}`}
        onClick={() => handleSizeChange('14px')}
      >
        A
      </button>
      <button
        id="large-button"
        className={`size-16-20 ${activeSize === '16px' || activeSize === '20px' ? 'active' : ''}`}
        onClick={() => handleSizeChange('16px')} 
      >
        A
      </button>
    </div>
  );
};

export default TextSize;
