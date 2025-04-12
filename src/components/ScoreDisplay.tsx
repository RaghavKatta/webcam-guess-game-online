
import React from 'react';
import { useGame } from './GameProvider';
import { Award } from 'lucide-react';

const ScoreDisplay = () => {
  const { score } = useGame();

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-game-primary/90 text-white rounded-xl shadow-md backdrop-blur-sm border border-white">
      <Award className="h-5 w-5" />
      <div className="font-bold text-sm">Score:</div>
      <div className="bg-white text-game-primary rounded-lg px-3 py-1 font-mono font-bold text-lg">
        {score}
      </div>
    </div>
  );
};

export default ScoreDisplay;
