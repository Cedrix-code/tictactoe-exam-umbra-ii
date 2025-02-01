import PropTypes from 'prop-types';

const MoveList = ({ history, currentMove, jumpTo, isAscending }) => {
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
  
      return <ol>{isAscending ? moves : moves.reverse()}</ol>;
    };
    
  MoveList.propTypes = {
    history: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.number,
      })
    ).isRequired,
    currentMove: PropTypes.number.isRequired,
    jumpTo: PropTypes.func.isRequired,
    isAscending: PropTypes.bool.isRequired,
  };
  
  export default MoveList;
  