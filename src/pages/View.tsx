
import React from 'react';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
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
            <div className="flex flex-col items-center gap-4">
              <div className="webcam-container w-full max-w-2xl bg-white border-4 border-white rounded-xl">
                <div className="stream-placeholder h-[400px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold mb-4">Waiting for stream...</h3>
                    <p className="text-gray-600 mb-4">The streamer will appear here once connected.</p>
                  </div>
                </div>
              </div>
            </div>
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
