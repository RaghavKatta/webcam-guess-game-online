
import React from 'react';
import { Camera, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-2 mb-2">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold flex">
          <span className="colored-text" style={{ color: '#FF5252' }}>G</span>
          <span className="colored-text" style={{ color: '#FF9800' }}>u</span>
          <span className="colored-text" style={{ color: '#FFEB3B' }}>e</span>
          <span className="colored-text" style={{ color: '#4CAF50' }}>s</span>
          <span className="colored-text" style={{ color: '#00BCD4' }}>s</span>
          <span className="colored-text" style={{ color: '#4A6CFF' }}> </span>
          <span className="colored-text" style={{ color: '#9C27B0' }}>L</span>
          <span className="colored-text" style={{ color: '#FF4081' }}>e</span>
          <span className="colored-text" style={{ color: '#FF5252' }}>o</span>
          <span className="colored-text" style={{ color: '#FF9800' }}>n</span>
          <span className="colored-text" style={{ color: '#FFEB3B' }}>a</span>
          <span className="colored-text" style={{ color: '#4CAF50' }}>r</span>
          <span className="colored-text" style={{ color: '#00BCD4' }}>d</span>
          <span className="colored-text" style={{ color: '#4A6CFF' }}>o</span>
          <span className="ml-2 animate-float">
            <Camera className="h-10 w-10 text-white" />
          </span>
        </h1>
      </div>
      <div className="flex justify-center mt-1">
        <div className="flex space-x-2">
          <div className="avatar" style={{ backgroundColor: '#FF5252' }}>😀</div>
          <div className="avatar" style={{ backgroundColor: '#FF9800' }}>😎</div>
          <div className="avatar" style={{ backgroundColor: '#FFEB3B' }}>🤔</div>
          <div className="avatar" style={{ backgroundColor: '#4CAF50' }}>😮</div>
          <div className="avatar" style={{ backgroundColor: '#00BCD4' }}>😂</div>
          <div className="avatar" style={{ backgroundColor: '#4A6CFF' }}>😴</div>
          <div className="avatar" style={{ backgroundColor: '#9C27B0' }}>🤩</div>
          <div className="avatar" style={{ backgroundColor: '#FF4081' }}>😍</div>
        </div>
      </div>
      <p className="text-center text-white mt-1 text-sm">
        Show objects on your webcam for others to guess in the chat!
      </p>
    </header>
  );
};

export default Header;
