import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RecentGames from '../components/RecentGames';
import GameHistory from '../components/GameHistory';
import Card from '../components/Card';

function Home() {
  const [games, setGames] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        const completedGames = response.data.filter((game) => game.completed);
        setGames(completedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main>
      <h1>Tic Tac Ohh</h1>
      <Card>
        <div className="wrapper items-center justify-center">
          <h2>Recent Games</h2>
          {games.length === 0 ? (
            <p>No games played yet</p>
          ) : (
            <>
              <RecentGames games={games} />
              {!showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-blue-500 underline cursor-pointer mt-2"
                >
                  View More Games
                </button>
              )}

              {showAll && (
                <GameHistory
                  games={games}
                  onClose={() => setShowAll(false)}
                />
              )}
            </>
          )}
          <button
            className="mt-4 px-6 py-2 text-white bg-gradient-to-r from-blue-500           to-purple-500 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600          transition-all"
            onClick={() => navigate('/onboarding')}
          >
            Start New Game
          </button>
        </div>
      </Card>
    </main>
  );
}

export default Home;
