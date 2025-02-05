import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useGameData = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games', {
        params: { 
          timestamp: new Date().getTime() 
        }
      });
      const sortedGames = response.data
        .filter(game => game.rounds && game.rounds.length > 0)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setGames(sortedGames);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 3000);
    return () => clearInterval(interval);
  }, []);

  return { games, loading, error, refreshGames: fetchGames };
};