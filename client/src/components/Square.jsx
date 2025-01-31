import PropTypes from 'prop-types';

function Square({ value = null, onClick, highlight = false }) {
  return (
    <button 
      className={`square ${highlight ? 'highlight' : ''}`} 
      onClick={onClick}
    >
      {value}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  highlight: PropTypes.bool,
};

export default Square;