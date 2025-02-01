import express from 'express';
import { startGame, recordRound, endGame, getGames } from '../controllers/game.controller.js';
import User from '../models/user.model.js';

const router = express.Router();

// Wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find({}, 'name');
  res.json(users);
}));

router.post('/start-game', asyncHandler(startGame));
router.post('/record-round', asyncHandler(recordRound));
router.post('/end-game', asyncHandler(endGame));
router.get('/games', asyncHandler(getGames));

export default router;
