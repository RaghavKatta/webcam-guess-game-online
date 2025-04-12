
import React from 'react';
import { Camera, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 mb-6">
      <div className="flex items-center justify-center">
        <Camera className="h-8 w-8 text-game-primary mr-2" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-game-primary to-game-secondary bg-clip-text text-transparent">
          Webcam Guess
        </h1>
        <MessageCircle className="h-8 w-8 text-game-secondary ml-2" />
      </div>
      <p className="text-center text-gray-600 mt-2">
        Show objects on your webcam for others to guess in the chat!
      </p>
    </header>
  );
};

export default Header;
