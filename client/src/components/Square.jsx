import PropTypes from 'prop-types';

function Square({ value = null, onClick, highlight = false }) {
  return (
    <button 
      className={`
        w-[140px] 
        h-[140px] 
        border-2 
        border-light-100 
        text-4xl 
        font-bold 
        flex 
        items-center 
        justify-center 
        text-white 
        transition-colors
        ${highlight ? 'bg-light-100/20' : 'hover:bg-light-100/10'}
      `}
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