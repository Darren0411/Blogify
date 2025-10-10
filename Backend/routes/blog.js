import express from 'express';
import multer from 'multer';
import '../models/user.js';
import { v2 as cloudinary } from 'cloudinary';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';

const router = express.Router();

// Multer (memory) for direct Cloudinary upload
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config (supports CLOUDINARY_URL or individual vars)
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}

// Helper: ensure auth
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
}

router.post('/', requireAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    let coverImageURL = '';

    if (req.file) {
      // Upload stream to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'blogs',
            resource_type: 'image',
          },
            (error, uploaded) => {
            if (error) return reject(error);
            resolve(uploaded);
          }
        );
        stream.end(req.file.buffer);
      });
      coverImageURL = result.secure_url.replace('/upload/', '/upload/w_800,c_fill/');
    }

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL,
    });

    const populated = await blog.populate('createdBy', 'fullName ProfileUrl');

    return res.status(201).json({
      success: true,
      blog: populated,
      message: 'Blog created',
    });
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ success: false, message: 'Failed to create blog' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('createdBy', 'fullName ProfileUrl');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Optional: increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    const comments = await Comment.find({ blogId: blog._id })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'fullName ProfileUrl');

    res.json({
      success: true,
      blog,
      comments,
    });
  } catch (err) {
    console.error('Fetch blog error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'fullName ProfileUrl');
    res.json({ success: true, comments });
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
});

router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const comment = await Comment.create({
      content: content.trim(),
      blogId: blog._id,
      createdBy: req.user._id,
    });

    const populated = await comment.populate('createdBy', 'fullName ProfileUrl');

    res.status(201).json({
      success: true,
      comment: populated,
      message: 'Comment added',
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});


//Number of likes 
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, likes: blog.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/comments/:blogId', requireAuth, async (req, res) => {
  req.params.id = req.params.blogId; 
  return router.handle({ ...req, url: `/${req.params.blogId}/comments`, method: 'POST' }, res);
});

// Add these routes to your existing blog.js file

// Save/Unsave a blog
router.post('/:id/save', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if user already saved this blog
    const user = await User.findById(userId);
    const savedBlogs = user.savedBlogs || [];
    const isSaved = savedBlogs.includes(blogId);

    if (isSaved) {
      // Unsave the blog
      await User.findByIdAndUpdate(userId, {
        $pull: { savedBlogs: blogId }
      });
      res.json({ success: true, message: 'Blog unsaved', saved: false });
    } else {
      // Save the blog
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedBlogs: blogId }
      });
      res.json({ success: true, message: 'Blog saved', saved: true });
    }
  } catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's saved blogs
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).populate({
      path: 'savedBlogs',
      populate: {
        path: 'createdBy',
        select: 'name fullName email'
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      savedBlogs: user.savedBlogs || [] 
    });
  } catch (error) {
    console.error('Error fetching saved blogs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check if a blog is saved by current user
router.get('/:id/is-saved', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const savedBlogs = user.savedBlogs || [];
    const isSaved = savedBlogs.includes(blogId);

    res.json({ success: true, saved: isSaved });
  } catch (error) {
    console.error('Error checking saved status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
