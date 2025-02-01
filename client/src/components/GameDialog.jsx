import PropTypes from 'prop-types';

const GameDialog = ({ showDialog, winner, player1, player2, closeDialog }) => {
    return showDialog ? (
      <div className="dialog">
        <p>{winner ? `Winner: ${winner === 'X' ? player1 : player2}` : 'It\'s a Draw!'}</p>
        <button onClick={closeDialog}>Close</button>
      </div>
    ) : null;
  };
  
  GameDialog.propTypes = {
    showDialog: PropTypes.bool.isRequired,
    winner: PropTypes.string,
    player1: PropTypes.string.isRequired,
    player2: PropTypes.string.isRequired,
    closeDialog: PropTypes.func.isRequired,
  };
  
  export default GameDialog;
  