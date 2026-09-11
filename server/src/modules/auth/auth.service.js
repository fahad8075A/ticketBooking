import jwt from 'jsonwebtoken';
import { User } from './user.model.js';
import { env } from '../../config/env.js';

export const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');




  const user = await User.create({ name, email, password });


//   const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });

  return { _id: user._id, name: user.name, email: user.email };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
  return { _id: user._id, name: user.name, email: user.email, token };
};