import User from '../models/user.model.js';
import { createUserUtil } from '../utils/user.utils.js';

export const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await createUserUtil(name);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStats = async (userId, isWinner, isDraw) => {
  try {
    console.log('Updating user stats:', { userId, isWinner, isDraw });
    
    const updateQuery = {
      $inc: {
        totalGames: 1,
        wins: isWinner ? 1 : 0,
        losses: (!isWinner && !isDraw) ? 1 : 0,
        draws: isDraw ? 1 : 0
      }
    };

    const user = await User.findByIdAndUpdate(
      userId,
      updateQuery,
      { new: true }
    );

    if (!user) {
      console.error('User not found:', userId);
      throw new Error('User not found');
    }

    console.log('Updated user stats:', {
      id: user._id,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws
    });

    return user;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};