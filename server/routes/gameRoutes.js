import express from 'express';
import { startGame, recordRound, endGame, getGames } from '../controllers/gameController.js';

const router = express.Router();

router.post('/start-game', startGame);
router.post('/record-round', recordRound);
router.post('/end-game', endGame);
router.get('/games', getGames);

export default router;