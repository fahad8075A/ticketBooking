import express from 'express';
import { register, login, verifyOtp, adminLogin } from './auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/admin/login', adminLogin);

export default router;