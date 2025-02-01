import PropTypes from 'prop-types';

const MoveList = ({ history, currentMove, setCurrentMove, isAscending, setIsAscending }) => {
  return (
    <div className="w-[300px] bg-dark-100 p-4 rounded-lg h-full">
      <button 
        onClick={() => setIsAscending(!isAscending)}
        className="w-full mb-4 px-4 py-2 bg-light-100/10 text-white rounded hover:bg-light-100/20"
      >
        {isAscending ? 'Sort Descending' : 'Sort Ascending'}
      </button>
      
      <div className="h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <ol className={`space-y-2 ${isAscending ? '' : 'flex flex-col-reverse'}`}>
          {history.map((step, move) => {
            const row = step.location !== null ? Math.floor(step.location / 3) + 1 : null;
            const col = step.location !== null ? (step.location % 3) + 1 : null;
            const description = move > 0 
              ? `Go to move #${move} (${row}, ${col})` 
              : 'Go to game start';

            return (
              <li key={move} className="px-2">
                {move === currentMove ? (
                  <span className="text-light-100">
                    You are at move #{move} {row && col ? `(${row}, ${col})` : ''}
                  </span>
                ) : (
                  <button 
                    onClick={() => setCurrentMove(move)}
                    className="w-full text-left px-3 py-1 bg-light-100/10 text-white rounded hover:bg-light-100/20"
                  >
                    {description}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

MoveList.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      squares: PropTypes.array.isRequired,
      location: PropTypes.number,
    })
  ).isRequired,
  currentMove: PropTypes.number.isRequired,
  setCurrentMove: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
  setIsAscending: PropTypes.func.isRequired,
};

export default MoveList;