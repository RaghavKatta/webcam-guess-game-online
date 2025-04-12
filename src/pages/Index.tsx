
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Camera, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
      <Header />
      
      <div className="flex flex-col items-center justify-center space-y-8 mt-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Mode</h2>
          <p className="text-white text-lg mb-8">Stream your webcam for others to guess, or join as a viewer to play!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-game-primary inline-block p-6 rounded-full mb-6">
              <Camera className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Become a Streamer</h3>
            <p className="mb-6 text-gray-600">Show objects on your webcam for viewers to guess. Start a fun guessing game!</p>
            <Button 
              onClick={() => navigate('/stream')}
              className="bg-game-primary hover:bg-game-primary/90 text-white text-lg py-6 px-8"
              size="lg"
            >
              Start Streaming
            </Button>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-game-green inline-block p-6 rounded-full mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Join as Viewer</h3>
            <p className="mb-6 text-gray-600">Watch a stream and try to guess what's being shown. Test your guessing skills!</p>
            <Button 
              onClick={() => navigate('/view')}
              className="bg-game-green hover:bg-game-green/90 text-white text-lg py-6 px-8"
              size="lg"
            >
              Join Viewing
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 text-center text-white text-sm">
        <p>© 2025 Webcam.io - A fun guessing game for everyone!</p>
      </footer>
    </div>
  );
};

export default Index;
