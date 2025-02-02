import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import calculateWinner from '../utils/calculateWinner';

export default function useGameLogic(player1, player2) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [currentRoundWins, setCurrentRoundWins] = useState({
    player1Wins: 0,
    player2Wins: 0,
    draws: 0
  });
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

  const handlePlay = async (nextSquares, location) => {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winnerInfo = calculateWinner(nextSquares);
    if (winnerInfo || nextSquares.every(Boolean)) {
      setShowDialog(true);
      
      // Update stats
      setCurrentRoundWins(prev => {
        const newStats = { ...prev };
        if (winnerInfo) {
          if (winnerInfo.winner === 'X') {
            newStats.player1Wins += 1;
          } else {
            newStats.player2Wins += 1;
          }
        } else if (nextSquares.every(Boolean)) {
          newStats.draws += 1;
        }
        return newStats;
      });
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

  return {
    history,
    currentMove,
    xIsNext,
    currentSquares,
    isAscending,
    showDialog,
    currentRoundWins,
    setShowDialog,
    setIsAscending,
    setCurrentMove,
    handlePlay,
    endGame,
    resetGame,
  };
}
