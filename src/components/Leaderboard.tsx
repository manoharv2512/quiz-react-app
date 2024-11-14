import React, { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const Leaderboard: React.FC = () => {
  const [leaderboard] = useLocalStorage<Array<{ name: string; score: number }>>('leaderboard', []);
  const [sortedLeaderboard, setSortedLeaderboard] = useState<Array<{ name: string; score: number }>>([]);

  useEffect(() => {
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    setSortedLeaderboard(sorted);
    console.log('Leaderboard data:', sorted); 
  }, [leaderboard]);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {sortedLeaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No entries in the leaderboard yet.</p>
      )}
    </div>
  );
};

export default Leaderboard;