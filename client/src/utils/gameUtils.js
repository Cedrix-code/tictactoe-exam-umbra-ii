export const getGameStatus = (game) => {
  if (!game.completed) {
    return 'In Progress';
  }
  
  const lastRound = game.rounds[game.rounds.length - 1];
  if (lastRound) {
    if (lastRound.draw) {
      return 'Draw';
    }
    if (lastRound.winner) {
      const winner = lastRound.winner.name;
      return `Winner: ${winner}`;
    }
  }
  return 'Completed';
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

  return `(X: ${xWins}, O: ${oWins}, Draws: ${draws})`;
};