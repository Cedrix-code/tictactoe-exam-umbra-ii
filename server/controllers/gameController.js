import express from 'express';
import { GameService } from '../services/game.service.js';

const gameRouter = express.Router();

// Get all games
gameRouter.get('/games', async (req, res) => {
  try {
    const games = await GameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
});

// Start game
gameRouter.post('/start-game', async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    const game = await GameService.startNewGame(player1Name, player2Name);
    res.status(201).json(game);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: 'Failed to start game' });
  }
});

// Record round
gameRouter.post('/record-round', async (req, res) => {
  try {
    const { gameId, winnerId, isDraw } = req.body;
    const result = await GameService.recordGameRound(gameId, winnerId, isDraw);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error recording round:', error);
    res.status(500).json({ message: 'Failed to record round' });
  }
});

// End game
gameRouter.post('/end-game', async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await GameService.endGame(gameId);
    res.status(200).json(game);
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ message: 'Failed to end game' });
  }
});

export { gameRouter };