import express from 'express';
import User from '../models/user.js';

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
      .cookie('blogify_token', token, {
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
  res.clearCookie('blogify_token').json({ success: true, message: 'Logged out' });
});



router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  res.json({ success: true, user: req.user });
});

export default router;