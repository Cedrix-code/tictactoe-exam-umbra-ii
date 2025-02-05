const countWins = (rounds, playerId) => {
  if (!rounds || !playerId) return 0;
  return rounds.filter(round => 
    round.winner && round.winner._id === playerId
  ).length;
};

export const getGameStatus = (game) => {
  if (!game || !game.rounds) return 'Invalid Game';
  if (!game.player1 || !game.player2) return 'Missing Players';
  
  // Check completed games first
  if (game.completed) {
    if (game.isDraw) return "It's a Draw!";
    return game.finalWinner ? `Winner: ${game.finalWinner.name}` : 'Game Completed';
  }

  // Count current wins
  const xWins = countWins(game.rounds, game.player1._id);
  const oWins = countWins(game.rounds, game.player2._id);
  
  // Return more detailed in-progress status
  return `In Progress (X: ${xWins}, O: ${oWins})`;
};

export const getGameSummary = (game) => {
  if (!game || !game.rounds) return '';
  if (!game.player1 || !game.player2) return '';

  try {
    const xWins = countWins(game.rounds, game.player1._id);
    const oWins = countWins(game.rounds, game.player2._id);
    const draws = game.rounds.filter(round => round.draw).length || 0;

    return `(X: ${xWins}, O: ${oWins}, Draws: ${draws})`;
  } catch (error) {
    console.error('Error generating game summary:', error);
    return '(Error calculating scores)';
  }
};