import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import userRoute from './routes/user.js';
import blogRoute from './routes/blog.js';
import './models/user.js';
import { checkforAuthenticationCookie } from './middlewear/auth.js';
import Blog from './models/blog.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for secure cookies behind Render's proxy
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'https://blogify-aeb9em7ez-darrens-projects-945d9eea.vercel.app',
  'https://blogify.darrensprojects.com'
];

// CORS Middleware - FIRST
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicit CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24*60*60*1000
  }
}));

// Rest of your middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkforAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Fetch all blogs
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
    });
  }
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, { dbName: 'Blogify' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connection error:', err));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});

export default app;