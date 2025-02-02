import Game from '../models/gameModel.js';
import { createUserUtil } from '../utils/user.utils.js';
import { updateUserStats } from '../controllers/userController.js';

export class GameService {
  static async startNewGame(player1Name, player2Name) {
    const player1 = await createUserUtil(player1Name);
    const player2 = await createUserUtil(player2Name);

    const game = await Game.create({
      player1: player1._id,
      player2: player2._id,
      rounds: [],
      status: 'active'
    });

    return game.populate(['player1', 'player2']);
  }

  static async recordGameRound(gameId, winnerId, isDraw) {
    const game = await Game.findById(gameId)
      .populate('player1')
      .populate('player2');

    if (!game) {
      throw new Error('Game not found');
    }

    const round = { draw: isDraw, winner: null };
    
    if (isDraw) {
      const [updatedPlayer1, updatedPlayer2] = await Promise.all([
        updateUserStats(game.player1._id, false, true),
        updateUserStats(game.player2._id, false, true)
      ]);
      
      game.rounds.push(round);
      await game.save();
      
      return { game, players: { player1: updatedPlayer1, player2: updatedPlayer2 } };
    }

    const isPlayer1Winner = winnerId === 'X';
    round.winner = isPlayer1Winner ? game.player1._id : game.player2._id;
    
    const [updatedPlayer1, updatedPlayer2] = await Promise.all([
      updateUserStats(game.player1._id, isPlayer1Winner, false),
      updateUserStats(game.player2._id, !isPlayer1Winner, false)
    ]);

    game.rounds.push(round);
    await game.save();
    await game.populate('rounds.winner');

    return { game, players: { player1: updatedPlayer1, player2: updatedPlayer2 } };
  }

  static async endGame(gameId) {
    const game = await Game.findById(gameId)
      .populate(['player1', 'player2', 'rounds.winner']);
  
    if (!game) {
      throw new Error('Game not found');
    }
  
    const p1Wins = game.rounds.filter(r => r.winner?.toString() === game.player1._id.toString()).length;
    const p2Wins = game.rounds.filter(r => r.winner?.toString() === game.player2._id.toString()).length;
  
    game.status = 'completed';
    game.finalWinner = p1Wins > p2Wins ? game.player1._id : 
                      p2Wins > p1Wins ? game.player2._id : null;
    game.isDraw = p1Wins === p2Wins;
  
    await game.save();
    return game.populate('finalWinner');
  }
  
  static async getAllGames() {
    return Game.find()
      .populate(['player1', 'player2', 'rounds.winner'])
      .sort({ updatedAt: -1 });
  }
}
