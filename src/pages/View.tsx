
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import WebcamDisplay from '@/components/WebcamDisplay';
import { GameProvider } from '@/components/GameProvider';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const View = () => {
  const navigate = useNavigate();

  return (
    <GameProvider>
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
        <Header />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Viewing Mode</h2>
          <p className="text-white">You are watching someone's stream. Try to guess what they're showing!</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WebcamDisplay isStreamer={false} />
          </div>
          
          <div className="h-[600px]">
            <ChatBox />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate('/stream')}
            className="bg-game-primary hover:bg-game-primary/90 text-white"
          >
            <Camera className="mr-2 h-5 w-5" />
            Become a Streamer
          </Button>
        </div>
        
        <footer className="mt-12 text-center text-white text-sm">
          <p>© 2025 Webcam.io - A fun guessing game for everyone!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default View;
