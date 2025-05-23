
import React from 'react';
import Header from '@/components/Header';
import WebcamDisplay from '@/components/WebcamDisplay';
import ChatBox from '@/components/ChatBox';
import GameControls from '@/components/GameControls';
import Leaderboard from '@/components/Leaderboard';

const GamePage = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-2 transform scale-80 origin-top">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <WebcamDisplay />
          <div className="bg-white border-4 border-white p-4 rounded-xl shadow-md">
            <GameControls />
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <Leaderboard />
          <div className="flex-grow">
            <ChatBox />
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-white text-sm">
        <p>© 2025 Guess Leonardo - A fun guessing game with Leonardo!</p>
      </footer>
    </div>
  );
};

export default GamePage;
