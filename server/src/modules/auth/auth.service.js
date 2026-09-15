import jwt from 'jsonwebtoken';
import { User } from './user.model.js';
import { env } from '../../config/env.js';

export const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const user = await User.create({ name, email, password });

  return { _id: user._id, name: user.name, email: user.email };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });
  return { _id: user._id, name: user.name, email: user.email, role: user.role, token };
};

export const adminLoginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error('Invalid administrative credentials');
  }

  // 1. Password check: allows dev bypass 'admin123' or regular bcrypt check
  let isMatch = false;
  if (password === 'admin123' || user.password === password) {
    isMatch = true;
  } else if (typeof user.matchPassword === 'function') {
    isMatch = await user.matchPassword(password);
  }

  if (!isMatch) {
    throw new Error('Invalid administrative credentials');
  }

  // 2. Role Check
  if ((user.role || '').toLowerCase() !== 'admin') {
    throw new Error('Access Denied: Administrative role required.');
  }

  // 3. Sign token containing both id and role
  const token = jwt.sign(
    { id: user._id, _id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin: true,
    token,
  };
};