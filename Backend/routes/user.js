import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    console.log('📝 Signup attempt:', email);

    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Email already registered:', email);
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const user = await User.create({ fullName, email, password });
    const { token } = await User.matchPasswordAndGenerateToken(email, password);

    console.log('✅ User created:', email);
    console.log('✅ Token generated');

    // ✅ Set cookie with correct settings for production
    res.cookie('blogify_token', token, {
      httpOnly: true,
      secure: true,              // ✅ MUST be true for HTTPS
      sameSite: 'none',          // ✅ MUST be 'none' for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      path: '/',
    });

    console.log('✅ Cookie set for:', email);

    return res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        ProfileUrl: user.ProfileUrl
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// LOGIN ROUTE
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const { token, user } = await User.matchPasswordAndGenerateToken(email, password);

    console.log('✅ Login successful:', email);
    console.log('✅ Token generated');

    // ✅ Set cookie with correct settings for production
    res.cookie('blogify_token', token, {
      httpOnly: true,
      secure: true,              // ✅ MUST be true for HTTPS
      sameSite: 'none',          // ✅ MUST be 'none' for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      path: '/',
    });

    console.log('✅ Cookie set for:', email);

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        ProfileUrl: user.ProfileUrl
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(401).json({ 
      success: false, 
      message: error.message || 'Invalid credentials'
    });
  }
});

// LOGOUT ROUTE
router.post('/logout', (req, res) => {
  console.log('👋 Logout request');
  
  res.clearCookie('blogify_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });

  console.log('✅ Cookie cleared');

  return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// GET CURRENT USER
router.get('/me', async (req, res) => {
  try {
    console.log('🔍 Auth check - User:', req.user ? req.user.email || req.user._id : 'None');

    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database:', req.user._id);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('✅ User authenticated:', user.email);

    return res.status(200).json({ 
      success: true, 
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        ProfileUrl: user.ProfileUrl
      }
    });
  } catch (error) {
    console.error('❌ Auth check error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;