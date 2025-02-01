import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/route.js';
import { startGame, recordRound, endGame, getGames } from '../controllers/game.controller.js';
import User from '../models/user.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Unified CORS configuration
const corsOptions = {
  origin: ['https://tictacohh-ii-client.onrender.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply middlewares in correct order
app.use(cors(corsOptions));
app.use(express.json());

// Global headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Wrap async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find({}, 'name');
  res.json(users);
}));

router.post('/start-game', asyncHandler(startGame));
router.post('/record-round', asyncHandler(recordRound));
router.post('/end-game', asyncHandler(endGame));
router.get('/games', asyncHandler(getGames));

// Routes
app.use('/api', router);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
