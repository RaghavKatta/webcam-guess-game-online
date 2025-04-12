
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
    <div className="border-2 border-white rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-game-primary text-white font-semibold text-base flex items-center gap-2">
        <Trophy className="h-4 w-4" />
        Leaderboard
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center p-2">Rank</TableHead>
              <TableHead className="p-2">Player</TableHead>
              <TableHead className="text-right p-2">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((player, index) => (
              <TableRow key={player.id} className={player.name === username ? "bg-game-accent/10" : ""}>
                <TableCell className="text-center font-medium p-2">
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
                <TableCell className={`p-2 ${player.name === username ? "font-bold" : ""}`}>
                  {player.name} {player.name === username && "(You)"}
                </TableCell>
                <TableCell className="text-right font-mono p-2">{player.score}</TableCell>
              </TableRow>
            ))}
            {leaderboard.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-2 text-gray-500">
                  No scores yet. Start playing!
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
