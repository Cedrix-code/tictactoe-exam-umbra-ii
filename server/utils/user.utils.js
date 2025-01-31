import User from '../models/user.model.js';

export const createUserUtil = async (name) => {
  try {
    let user = await User.findOne({ name });
    
    if (!user) {
      user = await User.create({ name });
    }
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};