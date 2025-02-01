import express from 'express';
import { startGame, recordRound, endGame, getGames } from '../controllers/game.controller.js';
import User from '../models/user.model.js'; // Import the User model

const router = express.Router();

// Existing game routes
router.post('/start-game', startGame);
router.post('/record-round', recordRound);
router.post('/end-game', endGame);
router.get('/games', getGames);

// New route to fetch all users
router.get('/users', async (req, res) => {
  try {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router;
