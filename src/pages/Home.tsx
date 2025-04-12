
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
    <div className="min-h-screen bg-game-background text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Guess Leonardo!</h1>
          <p className="text-white/80">Show objects on your webcam for others to guess in the chat!</p>
        </div>
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
