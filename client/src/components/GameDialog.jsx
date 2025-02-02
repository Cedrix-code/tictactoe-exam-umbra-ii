import PropTypes from 'prop-types';

const GameDialog = ({
  showDialog,
  winner,
  player1,
  player2,
  onEndGame,
  onPlayAgain,
  currentRoundWins,
  isDraw
}) => {
  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-dark-100 p-6 rounded-lg shadow-lg items-center max-w-md w-sm bounce-in">
        <div className="text-gradient text-xl font-bold mb-4 text-center">
          {isDraw ? "It's a Draw!" : `Winner: ${winner === 'X' ? player1 : player2}`}
        </div>
        <div className="mb-4 pl-6">
          <p>Game Statistics:</p>
          <p>{player1}: {currentRoundWins.player1Wins || 0} wins</p>
          <p>{player2}: {currentRoundWins.player2Wins || 0} wins</p>
          <p>Draws: {currentRoundWins.draws || 0}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onEndGame}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            End Game
          </button>
          <button
            onClick={onPlayAgain}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

GameDialog.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  winner: PropTypes.string,
  player1: PropTypes.string.isRequired,
  player2: PropTypes.string.isRequired,
  onEndGame: PropTypes.func.isRequired,
  onPlayAgain: PropTypes.func.isRequired,
  currentRoundWins: PropTypes.shape({
    player1Wins: PropTypes.number,
    player2Wins: PropTypes.number,
    draws: PropTypes.number
  }).isRequired,
  isDraw: PropTypes.bool.isRequired
};

export default GameDialog;