export const getGameStatus = (game) => {
  if (!game || !game.rounds) return 'Invalid Game';
  if (!game.completed) return 'In Progress';

  const xWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player1._id
  ).length;
  
  const oWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player2._id
  ).length;

  // Compare total wins
  if (xWins > oWins) {
    return `Winner: ${game.player1.name}`;
  } else if (oWins > xWins) {
    return `Winner: ${game.player2.name}`;
  } else {
    return "It's a Draw";
  }
};

export const getGameSummary = (game) => {
  if (!game || !game.rounds) return null;

  const xWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player1._id
  ).length;
  
  const oWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player2._id
  ).length;
  
  const draws = game.rounds.filter(round => round.draw).length;

  return `(X: ${xWins}, O: ${oWins})`;
};