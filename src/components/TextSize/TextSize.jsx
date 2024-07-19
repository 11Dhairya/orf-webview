import React, { useState } from 'react';
import './TextSize.css';

const TextSize = ({ setTextSize }) => {
  const [activeSize, setActiveSize] = useState('14px');

  const handleSizeChange = (size) => {
    setTextSize(size);
    setActiveSize(size);
  };

  return (
    <div className="text-size">
      <span>Text Size</span>
      <button
        className={`size-14 ${activeSize === '14px' ? 'active' : ''}`}
        onClick={() => handleSizeChange('14px')}
      >
        A
      </button>
      <button
        className={`size-20 ${activeSize === '20px' ? 'active' : ''}`}
        onClick={() => handleSizeChange('20px')}
      >
        A
      </button>
    </div>
  );
};

export default TextSize;
