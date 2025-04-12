
import React from 'react';
import Header from '@/components/Header';
import WebcamDisplay from '@/components/WebcamDisplay';
import ChatBox from '@/components/ChatBox';
import GameControls from '@/components/GameControls';
import { GameProvider } from '@/components/GameProvider';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WebcamDisplay />
            <GameControls />
          </div>
          
          <div className="h-[600px]">
            <ChatBox />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Webcam Guess Game. All rights reserved.</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
