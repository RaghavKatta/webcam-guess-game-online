import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/components/GameProvider';

const Home = () => {
  const { setUsername } = useGame();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      setUsername(name.trim());
      navigate('/game');
    }
  };

  return (
    <div 
      className="min-h-screen max-w-7xl mx-auto px-4 py-2 transform scale-80 origin-top bg-cover bg-center" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/c0497966-ffcf-4b0e-b822-46ab2f45bc67.png')` 
      }}
    >
      <div className="w-full max-w-md">
        <header className="w-full py-4 mb-6">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold flex">
              <span className="colored-text" style={{ color: '#FF5252' }}>G</span>
              <span className="colored-text" style={{ color: '#FF9800' }}>u</span>
              <span className="colored-text" style={{ color: '#FFEB3B' }}>e</span>
              <span className="colored-text" style={{ color: '#4CAF50' }}>s</span>
              <span className="colored-text" style={{ color: '#00BCD4' }}>s</span>
              <span className="colored-text" style={{ color: '#4A6CFF' }}> </span>
              <span className="colored-text" style={{ color: '#9C27B0' }}>L</span>
              <span className="colored-text" style={{ color: '#FF4081' }}>e</span>
              <span className="colored-text" style={{ color: '#FF5252' }}>o</span>
              <span className="colored-text" style={{ color: '#FF9800' }}>n</span>
              <span className="colored-text" style={{ color: '#FFEB3B' }}>a</span>
              <span className="colored-text" style={{ color: '#4CAF50' }}>r</span>
              <span className="colored-text" style={{ color: '#00BCD4' }}>d</span>
              <span className="colored-text" style={{ color: '#4A6CFF' }}>o</span>
            </h1>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-2">
              <div className="avatar" style={{ backgroundColor: '#FF5252' }}>😀</div>
              <div className="avatar" style={{ backgroundColor: '#FF9800' }}>😎</div>
              <div className="avatar" style={{ backgroundColor: '#FFEB3B' }}>🤔</div>
              <div className="avatar" style={{ backgroundColor: '#4CAF50' }}>😮</div>
              <div className="avatar" style={{ backgroundColor: '#00BCD4' }}>😂</div>
              <div className="avatar" style={{ backgroundColor: '#4A6CFF' }}>😴</div>
              <div className="avatar" style={{ backgroundColor: '#9C27B0' }}>🤩</div>
              <div className="avatar" style={{ backgroundColor: '#FF4081' }}>😍</div>
            </div>
          </div>
          <p className="text-center text-white mt-2">
            Show objects on your webcam for others to guess in the chat!
          </p>
        </header>
        
        <Card className="w-full bg-white/10 backdrop-blur-lg border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Enter Your Name</CardTitle>
            <CardDescription className="text-white/70">
              Choose a username to start playing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/20 text-white placeholder-white/50 border-white/30 focus:border-white/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-game-green hover:bg-game-green/90 text-white"
                disabled={!name.trim()}
              >
                Start Playing
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
