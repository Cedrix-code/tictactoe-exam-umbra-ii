import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import calculateWinner from '../utils/calculateWinner';
import api from '../api/axios';

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({ player1Wins: 0, player2Wins: 0, draws: 0 });
  const [gameId, setGameId] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const navigate = useNavigate();

  const updateGameStats = async (winnerInfo, squares) => {
    if (!gameId) return;
    
    try {
      const isGameComplete = winnerInfo || squares.every(Boolean);
      if (!isGameComplete) return;

      console.log('Updating game stats:', { winnerInfo, squares });
      const response = await api.post('/record-round', {
        gameId,
        winnerId: winnerInfo ? winnerInfo.winner : null,
        isDraw: !winnerInfo && squares.every(Boolean)
      });
      
      console.log('Game stats response:', response.data);
      const { updatedPlayer1, updatedPlayer2 } = response.data;
      
      setGameStats({
        player1Wins: updatedPlayer1.wins,
        player2Wins: updatedPlayer2.wins,
        draws: updatedPlayer1.draws + updatedPlayer2.draws
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

  const startGame = async () => {
    if (!player1 || !player2) {
      alert('Please enter both player names');
      return;
    }

    try {
      const response = await api.post('/start-game', {
        player1Name: player1,
        player2Name: player2
      });
      
      console.log('Game started:', response.data);
      setGameStarted(true);
      setGameId(response.data._id);
      setGameStats({
        player1Wins: 0,
        player2Wins: 0,
        draws: 0
      });
      setHistory([{ squares: Array(9).fill(null), location: null }]);
      setCurrentMove(0);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  const endGame = async () => {
    if (!gameId) return;

    try {
      await api.post('/end-game', { gameId });
      setGameStarted(false);
      setHistory([{ squares: Array(9).fill(null), location: null }]);
      setCurrentMove(0);
      setShowDialog(false);
      setGameStats({ player1Wins: 0, player2Wins: 0, draws: 0 });
      setGameId(null);
      setPlayer1('');
      setPlayer2('');
    } catch (error) {
      console.error('Error ending game:', error);
      alert('Failed to end game. Please try again.');
    }
  };

  const jumpTo = (nextMove) => setCurrentMove(nextMove);
  const toggleSortOrder = () => setIsAscending(!isAscending);
  const closeDialog = () => setShowDialog(false);

  const moves = history.map((step, move) => {
    const { location } = step;
    const row = location !== null ? Math.floor(location / 3) + 1 : null;
    const col = location !== null ? (location % 3) + 1 : null;
    const description = move > 0 ? `Go to move #${move} (${row}, ${col})` : 'Go to game start';
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move} ({row}, {col})</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  if (!isAscending) moves.reverse();

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const status = winner 
    ? `Winner: ${winner === 'X' ? player1 : player2}` 
    : currentSquares.every(Boolean) 
    ? 'Draw!' 
    : `Next player: ${xIsNext ? player1 : player2} (${xIsNext ? 'X' : 'O'})`;

  const handleExit = () => {
    // Navigate to home page without saving game history
    navigate('/');
  };

  // Add debug logging for game stats
  useEffect(() => {
    console.log('Current game stats:', gameStats);
  }, [gameStats]);

  return (
    <div className="wrapper">
      {!gameStarted ? (
        <div className="onboarding">
          <div className="player-inputs">
            <input
              type="text"
              placeholder="Player 1 Name"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
            />
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="player-input"
            />
            <button 
              onClick={startGame} 
              className="start-button"
              disabled={!player1 || !player2}
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <div className="game-board">
          <div className="game-info">
            <div className="status">{status}</div>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <button onClick={handleExit} className="exit-button">
              Exit Game
            </button>
          </div>
          <div className="game-history">
            <button onClick={toggleSortOrder} className="sort-button">
              {isAscending ? 'Sort Descending' : 'Sort Ascending'}
            </button>
            <ol>{moves}</ol>
          </div>
          {showDialog && (
            <div className="game-dialog">
              <div className="dialog-content">
                <span onClick={closeDialog} className="close-button">&times;</span>
                <p className="dialog-message">{status}</p>
                <div className="dialog-buttons">
                  <button onClick={endGame} className="stop-button">
                    End Game
                  </button>
                  <button 
                    onClick={() => {
                      setHistory([{ squares: Array(9).fill(null), location: null }]);
                      setCurrentMove(0);
                      setShowDialog(false);
                    }} 
                    className="continue-button"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="game-stats">
            <h3>Game Statistics</h3>
            <p>{player1} (X) Wins: {gameStats.player1Wins}</p>
            <p>{player2} (O) Wins: {gameStats.player2Wins}</p>
            <p>Draws: {gameStats.draws}</p>
          </div>
        </div>
      )}
    </div>
  ); 
}

export default Game;