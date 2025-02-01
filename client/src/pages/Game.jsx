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
  } = useGameLogic(player1, player2);

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const status = winner
    ? `Winner: ${winner === 'X' ? player1 : player2}`
    : currentSquares.every(Boolean)
    ? 'Draw!'
    : `Next player: ${xIsNext ? player1 : player2} (${xIsNext ? 'X' : 'O'})`;

  return (
    <div className="game">
      <h2>{status}</h2>
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} xIsNext={xIsNext} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>Toggle Order</button>
        <MoveList history={history} currentMove={currentMove} jumpTo={setCurrentMove} isAscending={isAscending} />
        <button onClick={endGame}>End Game</button>
      </div>
      <GameDialog showDialog={showDialog} winner={winner} player1={player1} player2={player2} closeDialog={() => setShowDialog(false)} />
    </div>
  );
}

export default Game;
