import User from '../models/userModel.js';
import { createUserUtil } from '../utils/user.utils.js';

export class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.find({})
        .select('name wins losses draws totalGames')
        .sort({ wins: -1 });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { name } = req.body;
      const user = await User.create({ 
        name,
        wins: 0,
        losses: 0,
        draws: 0,
        totalGames: 0
      });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

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