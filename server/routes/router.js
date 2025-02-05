import express from 'express';
import { gameRouter } from '../controllers/gameController.js';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Mount game routes
router.use('/', gameRouter);

// User routes
router.get('/users', UserController.getUsers);
router.post('/users', UserController.createUser);

router.get('/games', async (req, res) => {
  try {
    const games = await Game.find()
      .populate('player1')
      .populate('player2')
      .populate('rounds.winner')
      .populate('finalWinner')
      .sort({ updatedAt: -1 });
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
});

export default router;
