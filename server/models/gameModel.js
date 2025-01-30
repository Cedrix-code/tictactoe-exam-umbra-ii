import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: [
    {
      winner: String,
      draw: Boolean,
    },
  ],
});

const Game = mongoose.model('Game', gameSchema);
export default Game;