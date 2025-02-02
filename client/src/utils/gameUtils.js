export const getGameStatus = (game) => {
  if (!game || !game.rounds) return 'Invalid Game';
  
  // Check if the game is completed first
  if (game.completed) {
    if (game.isDraw) return "It's a Draw";
    if (game.finalWinner) return `Winner: ${game.finalWinner.name}`;
  }
  
  // For in-progress games
  const xWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player1._id
  ).length;
  
  const oWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player2._id
  ).length;

  return 'In Progress';
};

export const getGameSummary = (game) => {
  if (!game || !game.rounds) return '';

  const xWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player1._id
  ).length;
  
  const oWins = game.rounds.filter(round => 
    round.winner && round.winner._id === game.player2._id
  ).length;
  
  const draws = game.rounds.filter(round => round.draw).length;

  // Ensure numbers are valid
  const validXWins = isNaN(xWins) ? 0 : xWins;
  const validOWins = isNaN(oWins) ? 0 : oWins;
  const validDraws = isNaN(draws) ? 0 : draws;

  return `(X: ${validXWins}, O: ${validOWins}, Draws: ${validDraws})`;
};