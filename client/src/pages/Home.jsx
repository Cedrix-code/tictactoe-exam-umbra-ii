import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import GameHistoryPopup from '../components/GameHistoryPopup';
import { getGameStatus, getGameSummary } from '../utils/gameUtils';

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

      <div className="wrapper">
        <h2>
          Game <span className="text-gradient">History</span>
        </h2>
        {games.length === 0 ? (
          <p>No games played yet</p>
        ) : (
          <>
            <ul className="space-y-4">
              {games.slice(0, 3).map((game) => (
                <li key={game._id} className="history-centered">
                  <div className="game-players">
                    <span className="player-x">
                      {game.player1?.name || 'Player 1'}
                    </span>
                    <span> vs </span>
                    <span className="player-o">
                      {game.player2?.name || 'Player 2'}
                    </span>
                  </div>
                  <div className="game-details">
                    <span>Rounds: {game.rounds.length} </span>
                    {game.rounds.length > 0 && (
                      <span className="game-summary">
                        {getGameSummary(game)}
                      </span>
                    )}
                  </div>
                  <div className="game-status">
                    Status: {getGameStatus(game)}
                  </div>
                </li>
              ))}
            </ul>
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-blue-500 underline cursor-pointer mt-2"
              >
                View More
              </button>
            )}

            {showAll && (
              <GameHistoryPopup
                games={games}
                onClose={() => setShowAll(false)}
              />
            )}
          </>
        )}

        <button
          className="text-gradient mt-4"
          onClick={() => navigate('/onboarding')}
        >
          Start New Game
        </button>
      </div>
    </main>
  );
}

export default Home;
