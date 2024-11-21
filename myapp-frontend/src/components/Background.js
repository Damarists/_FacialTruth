import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import './Background.css';

const Background = ({ children }) => {
  return (
    <div className="background">
      <AnimatedBackground />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Background;