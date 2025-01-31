import Game from '../models/game.model.js';
import { createUserUtil } from '../utils/user.utils.js';
import { updateUserStats } from './user.controller.js';

export const startGame = async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    console.log('Starting game with players:', player1Name, player2Name);
    
    const player1 = await createUserUtil(player1Name);
    const player2 = await createUserUtil(player2Name);
    
    console.log('Players created:', player1, player2);
    
    const game = await Game.create({
      player1: player1._id,
      player2: player2._id,
      rounds: []
    });
    
    console.log('Game created:', game);
    res.status(201).json(game);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: error.message });
  }
};

export const recordRound = async (req, res) => {
  try {
    console.log('Recording round with data:', req.body);
    const { gameId, winnerId, isDraw } = req.body;
    
    const game = await Game.findById(gameId)
      .populate('player1')
      .populate('player2');
    
    if (!game) {
      console.error('Game not found:', gameId);
      return res.status(404).json({ message: 'Game not found' });
    }

    // Add round to game history
    if (isDraw) {
      game.rounds.push({
        winner: null,
        draw: true
      });

      console.log('Recording draw for both players');
      const updatedPlayer1 = await updateUserStats(game.player1._id, false, true);
      const updatedPlayer2 = await updateUserStats(game.player2._id, false, true);

      await game.save();

      return res.status(200).json({ 
        game,
        updatedPlayer1: {
          wins: updatedPlayer1.wins,
          draws: updatedPlayer1.draws,
          losses: updatedPlayer1.losses
        },
        updatedPlayer2: {
          wins: updatedPlayer2.wins,
          draws: updatedPlayer2.draws,
          losses: updatedPlayer2.losses
        }
      });
    }

    // Handle winner case
    const isPlayer1Winner = winnerId === 'X';
    const winningPlayer = isPlayer1Winner ? game.player1 : game.player2;

    game.rounds.push({
      winner: winningPlayer._id,
      draw: false
    });

    console.log('Updating player stats:', {
      player1: { id: game.player1._id, isWinner: isPlayer1Winner },
      player2: { id: game.player2._id, isWinner: !isPlayer1Winner }
    });
    
    const updatedPlayer1 = await updateUserStats(game.player1._id, isPlayer1Winner, false);
    const updatedPlayer2 = await updateUserStats(game.player2._id, !isPlayer1Winner, false);

    await game.save();
    
    // Populate the winner information for the response
    await game.populate('rounds.winner');

    console.log('Updated player stats:', {
      player1: { wins: updatedPlayer1.wins, draws: updatedPlayer1.draws },
      player2: { wins: updatedPlayer2.wins, draws: updatedPlayer2.draws }
    });

    res.status(200).json({ 
      game,
      updatedPlayer1: {
        wins: updatedPlayer1.wins,
        draws: updatedPlayer1.draws,
        losses: updatedPlayer1.losses
      },
      updatedPlayer2: {
        wins: updatedPlayer2.wins,
        draws: updatedPlayer2.draws,
        losses: updatedPlayer2.losses
      }
    });
  } catch (error) {
    console.error('Error recording round:', error);
    res.status(500).json({ message: error.message });
  }
};

export const endGame = async (req, res) => {
  try {
    const { gameId } = req.body;
    
    const game = await Game.findById(gameId)
      .populate('player1')
      .populate('player2')
      .populate('rounds.winner');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Calculate final winner based on rounds
    const p1Wins = game.rounds.filter(r => r.winner?.toString() === game.player1._id.toString()).length;
    const p2Wins = game.rounds.filter(r => r.winner?.toString() === game.player2._id.toString()).length;
    
    game.completed = true;
    
    if (p1Wins > p2Wins) {
      game.finalWinner = game.player1._id;
    } else if (p2Wins > p1Wins) {
      game.finalWinner = game.player2._id;
    } else {
      game.isDraw = true;
    }
    
    await game.save();
    await game.populate('finalWinner');
    
    res.status(200).json(game);
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate('player1')
      .populate('player2')
      .populate('rounds.winner')
      .populate('finalWinner')
      .sort({ createdAt: -1 }); // Show newest games first
      
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: error.message });
  }
};