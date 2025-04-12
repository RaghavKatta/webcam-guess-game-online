import React, { useState } from 'react';
import { Play, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from './GameProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
const GameControls = () => {
  const {
    gameState,
    startGame,
    endGame,
    score,
    username,
    setUsername
  } = useGame();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
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
  const saveUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim());
    }
    setEditingUsername(false);
  };
  return <Card className="w-full">
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
        <CardDescription>
          Start a new round or change your username
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={handleStartGame} disabled={gameState === 'playing'} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Play className="mr-2 h-4 w-4" />
            Start Round
          </Button>
          
          <Button onClick={handleEndGame} disabled={gameState !== 'playing'} variant="outline" className="flex-1 border-red-300 text-red-500 hover:bg-red-50">
            <StopCircle className="mr-2 h-4 w-4" />
            End Round
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Your Name:</div>
          {editingUsername ? <div className="flex gap-2 flex-1">
              <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} className="flex-1" />
              <Button size="sm" onClick={saveUsername} className="bg-game-primary hover:bg-game-primary/90">
                Save
              </Button>
            </div> : <div className="flex justify-between flex-1">
              <span className="font-semibold">{username}</span>
              <Button variant="ghost" size="sm" onClick={() => setEditingUsername(true)}>
                Edit
              </Button>
            </div>}
        </div>
        
        
      </CardContent>
    </Card>;
};
export default GameControls;