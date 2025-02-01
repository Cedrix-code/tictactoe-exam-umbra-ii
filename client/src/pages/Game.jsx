import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Board from '../components/Board';
import MoveList from '../components/MoveList';
import GameDialog from '../components/GameDialog';
import calculateWinner from '../utils/calculateWinner';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { player1, player2 } = location.state || {};

  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [gameStats, setGameStats] = useState({ player1Wins: 0, player2Wins: 0, draws: 0 });

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  useEffect(() => {
    const startGame = async () => {
      if (!player1 || !player2) {
        alert('Player names are missing. Redirecting to onboarding.');
        navigate('/');
        return;
      }

      try {
        const response = await api.post('/start-game', { player1Name: player1, player2Name: player2 });
        setGameId(response.data._id);
      } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Please try again.');
      }
    };
    startGame();
  }, [player1, player2, navigate]);

  const updateGameStats = async (winnerInfo, squares) => {
    if (!gameId) return;
    if (!(winnerInfo || squares.every(Boolean))) return;

    try {
      const response = await api.post('/record-round', {
        gameId,
        winnerId: winnerInfo ? winnerInfo.winner : null,
        isDraw: !winnerInfo && squares.every(Boolean),
      });

      setGameStats({
        player1Wins: response.data.updatedPlayer1.wins,
        player2Wins: response.data.updatedPlayer2.wins,
        draws: response.data.updatedPlayer1.draws + response.data.updatedPlayer2.draws,
      });
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const handlePlay = async (nextSquares, i) => {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location: i }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winnerInfo = calculateWinner(nextSquares);
    if (winnerInfo || nextSquares.every(Boolean)) {
      setShowDialog(true);
      await updateGameStats(winnerInfo, nextSquares);
    }
  };

  const endGame = async () => {
    if (!gameId) return;
    try {
      await api.post('/end-game', { gameId });
      navigate('/');
    } catch (error) {
      console.error('Error ending game:', error);
      alert('Failed to end game. Please try again.');
    }
  };

  const resetGame = () => {
    setHistory([{ squares: Array(9).fill(null), location: null }]);
    setCurrentMove(0);
    setShowDialog(false);
  };

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
      <h1 className="text-gradient pt-4">Tic Tac Ohh</h1>
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
          onPlayAgain={handlePlayAgain}
          resetGame={resetGame}
          isDraw={isDraw}
        />
      </div>
    </main>
  );
}

export default Game;
