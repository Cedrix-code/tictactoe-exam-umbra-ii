import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { getGameStatus, getGameSummary } from '../utils/gameUtils';
import { useGameData } from '../hooks/useGameData';

export default function GameHistory({ onClose }) {
  const { games, loading, error } = useGameData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-xs z-50"
    >
      <div className="bg-dark-100 p-4 rounded-lg shadow-lg w-[500px] h-[500px] relative overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <div className="sticky -top-1">
          <button 
            className="absolute -right-3 t-0 bg-red-500 text-white px-2.5 py-1 rounded-4xl"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <ul className="space-y-4">
          {games.map((game) => (
            <li key={game._id} className="history-centered">
              <div className="game-players">
                <span className="player-x">
                  {game.player1?.name || 'Player 1'} 
                  <span className="text-blue-500 ml-1">(X)</span>
                </span>
                <span className="mx-2">vs</span>
                <span className="player-o">
                  {game.player2?.name || 'Player 2'}
                  <span className="text-red-500 ml-1">(O)</span>
                </span>
              </div>
              <div className="game-details">
                <span>Rounds: {game.rounds.length} </span>
                {game.rounds.length > 0 && (
                  <span className="game-summary">{getGameSummary(game)}</span>
                )}
              </div>
              <div className="game-status">
                Status: {getGameStatus(game)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

GameHistory.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    player1: PropTypes.shape({ name: PropTypes.string }),
    player2: PropTypes.shape({ name: PropTypes.string }),
    rounds: PropTypes.arrayOf(PropTypes.object).isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};
