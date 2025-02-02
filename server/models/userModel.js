import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  totalGames: { 
    type: Number, 
    default: 0 
  },
  wins: { 
    type: Number, 
    default: 0 
  },
  losses: { 
    type: Number, 
    default: 0 
  },
  draws: { 
    type: Number, 
    default: 0 
  }
});

export default mongoose.model('User', userSchema);