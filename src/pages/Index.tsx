
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
            <div className="bg-white border-4 border-white p-4 rounded-xl shadow-md">
              <GameControls />
            </div>
          </div>
          
          <div className="h-[600px]">
            <ChatBox />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-white text-sm">
          <p>© 2025 Webcam.io - A fun guessing game for everyone!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
