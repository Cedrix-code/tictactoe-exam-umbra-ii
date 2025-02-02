import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rounds: [{
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    draw: {
      type: Boolean,
      default: false
    }
  }],
  finalWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDraw: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Game', gameSchema);