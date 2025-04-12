
import React from 'react';
import Header from '@/components/Header';
import WebcamDisplay from '@/components/WebcamDisplay';
import ChatBox from '@/components/ChatBox';
import GameControls from '@/components/GameControls';
import Leaderboard from '@/components/Leaderboard';
import { GameProvider } from '@/components/GameProvider';

const Index = () => {
  return (
    <GameProvider>
      <div className="h-screen flex flex-col max-w-7xl mx-auto px-4 py-4">
        <Header />
        
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <WebcamDisplay />
            <div className="bg-white border-4 border-white p-4 rounded-xl shadow-md">
              <GameControls />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <Leaderboard />
            <div className="flex-grow overflow-hidden">
              <ChatBox />
            </div>
          </div>
        </div>
        
        <footer className="mt-4 text-center text-white text-sm py-2">
          <p>© 2025 Guess Leonardo - A fun guessing game with Leonardo!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
