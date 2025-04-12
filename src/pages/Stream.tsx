
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WebcamDisplay from '@/components/WebcamDisplay';
import ChatBox from '@/components/ChatBox';
import { GameProvider } from '@/components/GameProvider';
import { Button } from '@/components/ui/button';
import { Users, WifiOff, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socketService from '@/services/socketService';

const Stream = () => {
  const navigate = useNavigate();
  const [isMockMode, setIsMockMode] = useState(false);
  
  useEffect(() => {
    // Check if we're in mock mode
    setIsMockMode(socketService.isMockMode());
  }, []);

  const resetMockMode = () => {
    socketService.resetMockMode();
    setIsMockMode(false);
    window.location.reload();
  };

  return (
    <GameProvider>
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
        <Header />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Streaming Mode</h2>
          <p className="text-white">You are the host. Show objects on your webcam for others to guess!</p>
          
          {isMockMode && (
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
              <WifiOff className="h-4 w-4" />
              <span>
                Network connection issues detected. Running in local mode.
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2 h-7 text-xs border-yellow-800 text-yellow-800 hover:bg-yellow-200"
                onClick={resetMockMode}
              >
                <Wifi className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WebcamDisplay isStreamer={true} />
          </div>
          
          <div className="h-[600px]">
            <ChatBox />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate('/view')}
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Users className="mr-2 h-5 w-5" />
            Switch to Viewing Mode
          </Button>
        </div>
        
        <footer className="mt-12 text-center text-white text-sm">
          <p>© 2025 Webcam.io - A fun guessing game for everyone!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Stream;
