
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { useGame } from './GameProvider';

interface Player {
  id: string;
  name: string;
  score: number;
}

const Leaderboard = () => {
  const { score, username } = useGame();
  
  // Sample leaderboard data - in a real app, this would come from a database
  const [leaderboard, setLeaderboard] = React.useState<Player[]>([
    { id: '1', name: 'Leonardo', score: 1500 },
    { id: '2', name: 'Alice', score: 1200 },
    { id: '3', name: 'Bob', score: 1000 },
  ]);
  
  // Add current player to leaderboard if they have a score
  React.useEffect(() => {
    if (score > 0) {
      // Check if player already exists in leaderboard
      const existingPlayerIndex = leaderboard.findIndex(
        player => player.name === username
      );
      
      const updatedLeaderboard = [...leaderboard];
      
      if (existingPlayerIndex >= 0) {
        // Update existing player's score if higher than current
        if (score > updatedLeaderboard[existingPlayerIndex].score) {
          updatedLeaderboard[existingPlayerIndex].score = score;
        }
      } else {
        // Add new player
        updatedLeaderboard.push({
          id: Date.now().toString(),
          name: username,
          score: score
        });
      }
      
      // Sort by score descending and limit to top 5
      const sortedLeaderboard = updatedLeaderboard
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      setLeaderboard(sortedLeaderboard);
    }
  }, [score, username]);

  return (
    <div className="border-4 border-white rounded-xl bg-white shadow-md overflow-hidden">
      <div className="p-2 bg-game-primary text-white font-bold text-lg flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Leaderboard
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center py-1">Rank</TableHead>
              <TableHead className="py-1">Player</TableHead>
              <TableHead className="text-right py-1">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((player, index) => (
              <TableRow key={player.id} className={player.name === username ? "bg-game-accent/10" : ""}>
                <TableCell className="text-center font-medium py-1">
                  {index === 0 ? (
                    <span className="text-yellow-500">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-gray-400">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-amber-700">🥉</span>
                  ) : (
                    `#${index + 1}`
                  )}
                </TableCell>
                <TableCell className={`${player.name === username ? "font-bold" : ""} py-1`}>
                  {player.name} {player.name === username && "(You)"}
                </TableCell>
                <TableCell className="text-right font-mono py-1">{player.score}</TableCell>
              </TableRow>
            ))}
            {leaderboard.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-2 text-gray-500">
                  No scores yet. Start playing to get on the leaderboard!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
