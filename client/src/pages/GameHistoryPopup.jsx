import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function GameHistoryPopup({ games, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-dark-100 p-4 rounded-lg shadow-lg w-[500px] h-[300px] relative overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent
dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <button 
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
          onClick={onClose}
        >
          X
        </button>
        <ul className="space-y-4">
          {games.map((game) => (
            <li key={game._id} className="history-centered">
              <div className="game-players">
                <span className="player-x">{game.player1?.name || 'Player 1'}</span>
                <span> vs </span>
                <span className="player-o">{game.player2?.name || 'Player 2'}</span>
              </div>
              <div className="game-details">
                <span>Rounds: {game.rounds.length} </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

GameHistoryPopup.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    player1: PropTypes.shape({ name: PropTypes.string }),
    player2: PropTypes.shape({ name: PropTypes.string }),
    rounds: PropTypes.arrayOf(PropTypes.object).isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};
