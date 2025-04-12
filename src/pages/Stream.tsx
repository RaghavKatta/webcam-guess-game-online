
import React from 'react';
import Header from '@/components/Header';
import WebcamDisplay from '@/components/WebcamDisplay';
import { GameProvider } from '@/components/GameProvider';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Stream = () => {
  const navigate = useNavigate();
  
  const handleShareLink = () => {
    // Generate a viewing link that others can use
    const viewURL = `${window.location.origin}/view`;
    navigator.clipboard.writeText(viewURL);
    alert("Viewing link copied to clipboard! Share this with your friends.");
  };

  return (
    <GameProvider>
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
        <Header />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Streaming Mode</h2>
          <p className="text-white">You are the host. Show objects on your webcam for others to guess!</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6">
            <WebcamDisplay isStreamer={true} />
            <div className="bg-white border-4 border-white p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={handleShareLink}
                  className="bg-game-green hover:bg-game-green/90 text-white"
                >
                  <Share className="mr-2 h-5 w-5" />
                  Share Viewing Link
                </Button>
                
                <Button 
                  onClick={() => navigate('/view')}
                  variant="outline"
                  className="border-game-primary text-game-primary"
                >
                  Switch to Viewing Mode
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-white text-sm">
          <p>© 2025 Webcam.io - A fun guessing game for everyone!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Stream;
