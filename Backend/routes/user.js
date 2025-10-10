import express from 'express';
import User from '../models/user.js';
import { sendOTP, verifyOTP } from '../utils/otpService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
     const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)

      return res.status(400).json({ success: false, message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ fullName, email, password });
    res.status(201).json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
     const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    const { token, user } = await User.matchPasswordAndGenerateToken(email, password);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ success: true, token, user });
  } catch (e) {
    console.error('Signin error:', e);
    res.status(401).json({ success: false, message: e.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out' });
});

router.post('/forgotPass', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account with this email' });

    await sendOTP({
      email,
      subject: 'Password Reset',
      message: 'Use this OTP to reset your password',
      duration: 5,
    });

    req.session.email = email;
    res.json({ success: true, message: 'OTP sent' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/verifyOTP', async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.email;
    if (!otp) return res.status(400).json({ success: false, message: 'OTP required' });
    if (!email) return res.status(400).json({ success: false, message: 'Session expired' });

    const ok = await verifyOTP(email, otp);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    res.json({ success: true, message: 'OTP verified' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/resetPass', async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.session.email;
    if (!email) return res.status(400).json({ success: false, message: 'Session expired' });
    if (!password) return res.status(400).json({ success: false, message: 'Password required' });
    const user = await User.findOne({ email });
    user.password = password;
    await user.save();
    req.session.email = null;
    res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  res.json({ success: true, user: req.user });
});

export default router;