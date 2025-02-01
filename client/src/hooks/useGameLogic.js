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

  return {
    history,
    currentMove,
    xIsNext,
    currentSquares,
    gameStats,
    isAscending,
    showDialog,
    setShowDialog,
    setIsAscending,
    setCurrentMove,
    handlePlay,
    endGame,
  };
}
