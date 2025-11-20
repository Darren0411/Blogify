import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import userRoute from './routes/user.js';
import blogRoute from './routes/blog.js';
import './models/user.js';
import { checkforAuthenticationCookie } from './middlewear/auth.js';
import Blog from './models/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CRITICAL: Trust proxy for Render
app.set('trust proxy', 1);

console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔧 Trust proxy:', app.get('trust proxy'));

// ✅ CORS Configuration with detailed logging
app.use(cors({
  origin: function (origin, callback) {
    console.log('📍 Request origin:', origin);
    
    if (!origin) {
      console.log('✅ No origin - allowing (same-origin or tool)');
      return callback(null, true);
    }
    
    const allowedPatterns = [
      /\.vercel\.app$/,
      /localhost/,
      /127\.0\.0\.1/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('⚠️ Origin not whitelisted, allowing anyway:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));

app.options('*', cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Cookie parser
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log('=== REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Origin:', req.get('origin'));
  console.log('Cookies received:', Object.keys(req.cookies || {}));
  console.log('Has blogify_token:', !!req.cookies?.blogify_token);
  console.log('===============');
  next();
});

// ✅ Auth middleware
app.use(checkforAuthenticationCookie('blogify_token'));

// Static files
app.use(express.static(path.resolve('./public')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cookies: Object.keys(req.cookies || {}),
    user: req.user ? 'Authenticated' : 'Not authenticated',
    trustProxy: app.get('trust proxy')
  });
});

// Routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Root endpoint
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('createdBy', 'fullName ProfileUrl')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      blogs,
      user: req.user || null,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, { 
    dbName: 'Blogify',
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 4500;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🍪 Cookie name: blogify_token`);
  console.log(`🔒 Trust proxy: ${app.get('trust proxy')}`);
});

export default app;