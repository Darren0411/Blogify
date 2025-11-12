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

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, { dbName: 'Blogify' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connection error:', err));


// trust proxy for secure cookies behind Render's proxy
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',                       // local dev
  'https://your-vercel-url.vercel.app',          // ← replace with your Vercel URL
  // 'https://www.your-custom-domain.com'        // optional custom domain
];

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // allow requests like Postman/curl with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,            // allow cookies / credentials
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// session settings (for cross-site cookies)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // MUST be true in production (HTTPS)
    httpOnly: true,
    sameSite: 'none',   // required for cross-site cookies
    maxAge: 24*60*60*1000
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkforAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));


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


const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;