
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from './GameProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play } from 'lucide-react';

const JoinGameMenu = () => {
  const { username, setUsername, startGame, gameState } = useGame();
  const [playerName, setPlayerName] = useState(username);
  
  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setUsername(playerName.trim());
      startGame();
    }
  };

  return (
    <Card className="w-full shadow-lg border-2 border-game-primary/20">
      <CardHeader className="bg-game-primary/10 pb-4">
        <CardTitle className="text-center text-xl text-game-primary">Join The Game</CardTitle>
        <CardDescription className="text-center">
          Enter your name to start playing with Leonardo
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleJoinGame} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="playerName" className="block text-sm font-medium">
              Your Name
            </label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-game-primary hover:bg-game-primary/90"
            disabled={gameState === 'playing' || !playerName.trim()}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Playing
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinGameMenu;
