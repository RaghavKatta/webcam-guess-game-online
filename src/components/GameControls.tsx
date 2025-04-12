
import React from 'react';
import { Play, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from './GameProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GameControls = () => {
  const {
    gameState,
    startGame,
    endGame,
    score,
    username
  } = useGame();

  const handleStartGame = () => {
    if (gameState !== 'playing') {
      startGame();
    }
  };

  const handleEndGame = () => {
    if (gameState === 'playing') {
      endGame();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
        <CardDescription>
          Start a new round or end the current one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={handleStartGame} disabled={gameState === 'playing'} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Play className="mr-2 h-4 w-4" />
            New Round
          </Button>
          
          <Button onClick={handleEndGame} disabled={gameState !== 'playing'} variant="outline" className="flex-1 border-red-300 text-red-500 hover:bg-red-50">
            <StopCircle className="mr-2 h-4 w-4" />
            End Round
          </Button>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="text-sm font-medium">Playing as:</div>
          <div className="font-semibold">{username}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;
