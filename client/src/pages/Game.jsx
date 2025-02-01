import { useLocation } from 'react-router-dom';
import useGameLogic from '../hooks/useGameLogic';
import Board from '../components/Board';
import MoveList from '../components/MoveList';
import GameDialog from '../components/GameDialog';
import calculateWinner from '../utils/calculateWinner';

function Game() {
  const location = useLocation();
  const { player1, player2 } = location.state || {};

  const {
    history,
    currentMove,
    xIsNext,
    currentSquares,
    isAscending,
    showDialog,
    setShowDialog,
    setIsAscending,
    setCurrentMove,
    handlePlay,
    endGame,
    resetGame,
    gameStats,
    currentGameStats,
  } = useGameLogic(player1, player2);

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const isDraw = !winner && currentSquares.every(Boolean);
  const status = winner
    ? `Winner: ${winner === 'X' ? player1 : player2}`
    : isDraw
    ? 'Draw!'
    : `Next player: ${xIsNext ? player1 : player2} (${xIsNext ? 'X' : 'O'})`;

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleGameEnd = async () => {
    await endGame();
    closeDialog();
  };

  const handlePlayAgain = () => {
    resetGame();
    closeDialog();
  };

  return (
    <main>
      <h1 className="pt-4">Tic Tac Ohh</h1>
        <div className="wrapper items-center justify-center bg-primary">
          <div className="flex gap-8 items-start mt-8">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl mb-4">{status}</h2>
              <div className="game-board mb-4">
                <Board squares={currentSquares} onPlay={handlePlay} xIsNext={xIsNext} />
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={resetGame} 
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 w-28"
                >
                  Reset
                </button>
                <button 
                  onClick={endGame} 
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-28"
                >
                  Stop
                </button>
              </div>
            </div>
              <MoveList 
                history={history} 
                currentMove={currentMove} 
                setCurrentMove={setCurrentMove} 
                isAscending={isAscending}
                setIsAscending={setIsAscending}
              />
          </div>

          <GameDialog 
            showDialog={showDialog}
            winner={winner}
            player1={player1}
            player2={player2}
            closeDialog={closeDialog}
            onEndGame={handleGameEnd}
            gameStats={gameStats}
            currentGameStats={currentGameStats}
            onPlayAgain={handlePlayAgain}
            resetGame={resetGame}
            isDraw={isDraw}
          />
        </div>
    </main>
  );
}

export default Game;
