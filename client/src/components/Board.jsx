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
      className="w-[150px] h-[150px] border-2 border-light-100 text-4xl font-bold flex items-center justify-center text-white hover:bg-light-100/10"
    />
  );

  const boardRows = Array.from({ length: 3 }, (_, row) => (
    <div key={row} className="board-row flex">
      {Array.from({ length: 3 }, (_, col) => renderSquare(row * 3 + col))}
    </div>
  ));

  return (
    <div className="flex justify-center items-center w-full">
      <div className="board w-[450px] h-[450px] bg-dark-100/50 p-4 rounded-lg">
        <div className="flex flex-col justify-between h-full">
          {boardRows}
        </div>
      </div>
    </div>
  );
}
Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default Board;