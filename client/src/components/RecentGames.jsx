import PropTypes from "prop-types";
import { getGameStatus, getGameSummary } from '../utils/gameUtils';

export default function RecentGames({ games }) {
  return (
    <ul className="space-y-4">
      {games.slice(0, 3).map((game) => (
        <li key={game._id} className="history-centered">
          <div className="game-players">
            <span className="player-x">
              {game.player1?.name || 'Player 1'}
            </span>
            <span> vs </span>
            <span className="player-o">
              {game.player2?.name || 'Player 2'}
            </span>
          </div>
          <div className="game-details">
            <span>Rounds: {game.rounds.length} </span>
            {game.rounds.length > 0 && (
              <span className="game-summary">{getGameSummary(game)}</span>
            )}
          </div>
          <div className="game-status">
            Status: {getGameStatus(game)}
          </div>
        </li>
      ))}
    </ul>
  );
}

RecentGames.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    player1: PropTypes.shape({ name: PropTypes.string }),
    player2: PropTypes.shape({ name: PropTypes.string }),
    rounds: PropTypes.arrayOf(PropTypes.object).isRequired,
  })).isRequired,
};