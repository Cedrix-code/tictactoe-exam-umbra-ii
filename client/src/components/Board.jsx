import Square from './Square';
import calculateWinner from '../utils/calculateWinner';
import PropTypes from 'prop-types';

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  };

  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => handleClick(i)}
      highlight={winningLine.includes(i)}
    />
  );

  const boardRows = Array.from({ length: 3 }, (_, row) => (
    <div key={row}>
      {Array.from({ length: 3 }, (_, col) => renderSquare(row * 3 + col))}
    </div>
  ));

  return (
    <>
      <div>
        {winner ? `Winner: ${winner}` : squares.every(Boolean) ? 'Draw' : `Next player: ${xIsNext ? 'X' : 'O'}`}
      </div>
      {boardRows}
    </>
  );
}
Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Board;