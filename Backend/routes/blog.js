import express from 'express';
import multer from 'multer';
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

// IMPORTANT: Specific routes MUST come before parameterized routes (:id)

// Get user's saved blogs - MUST come before /:id route
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const savedBlogIds = user.savedBlogs || [];
    const savedBlogs = await Blog.find({ _id: { $in: savedBlogIds } })
      .populate('createdBy', 'name fullName email')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      savedBlogs: savedBlogs
    });
  } catch (error) {
    console.error('Error fetching saved blogs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Fetch logged in user's blogs
router.get('/my-blogs', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch blogs created by the current user
    const blogs = await Blog.find({ createdBy: userId })
      .populate('createdBy', 'fullName name email')
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    // For each blog, get additional stats
    const blogsWithStats = await Promise.all(
      blogs.map(async (blog) => {
        // Get comments count
        const commentsCount = await Comment.countDocuments({ blogId: blog._id });
        
        // Get likes count directly from blog model (since you're storing it there)
        const likesCount = blog.likes || 0;
        
        return {
          ...blog,
          likes: likesCount,
          comments: { length: commentsCount },
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'User blogs fetched successfully',
      blogs: blogsWithStats,
      count: blogsWithStats.length
    });

  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create blog
router.post('/', requireAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    let coverImageURL = '';

    if (req.file) {
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

// Get single blog by ID - MUST come after specific routes like /saved and /my-blogs
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('createdBy', 'fullName ProfileUrl name email');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comments = await Comment.find({ blogId: blog._id })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'fullName ProfileUrl name email');

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

// Delete a blog (only by the author) - MUST come after /:id GET route
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if the current user is the author
    if (blog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own blogs'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ blogId: id });

    // Remove blog from all users' saved blogs and liked blogs
    await User.updateMany(
      { $or: [{ savedBlogs: id }, { likedBlogs: id }] },
      { $pull: { savedBlogs: id, likedBlogs: id } }
    );

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update a blog (only by the author) - MUST come after /:id GET route
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, body, coverImageURL } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Title and body are required'
      });
    }

    // Find the blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if the current user is the author
    if (blog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own blogs'
      });
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        body: body.trim(),
        coverImageURL: coverImageURL || blog.coverImageURL,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName name email');

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Like/Unlike a blog - UPDATED
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const user = await User.findById(userId);
    const hasLiked = blog.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike the blog
      await Blog.findByIdAndUpdate(blogId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      });
      
      await User.findByIdAndUpdate(userId, {
        $pull: { likedBlogs: blogId }
      });

      res.json({ 
        success: true, 
        message: 'Blog unliked', 
        liked: false,
        likes: blog.likes - 1
      });
    } else {
      // Like the blog
      await Blog.findByIdAndUpdate(blogId, {
        $addToSet: { likedBy: userId },
        $inc: { likes: 1 }
      });
      
      await User.findByIdAndUpdate(userId, {
        $addToSet: { likedBlogs: blogId }
      });

      res.json({ 
        success: true, 
        message: 'Blog liked', 
        liked: true,
        likes: blog.likes + 1
      });
    }
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check if a blog is liked by current user
router.get('/:id/is-liked', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const isLiked = blog.likedBy.includes(userId);

    res.json({ 
      success: true, 
      liked: isLiked,
      likes: blog.likes || 0
    });
  } catch (error) {
    console.error('Error checking liked status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Save/Unsave a blog
router.post('/:id/save', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const user = await User.findById(userId);
    const savedBlogs = user.savedBlogs || [];
    const isSaved = savedBlogs.some(id => id.toString() === blogId.toString());

    if (isSaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { savedBlogs: blogId }
      });
      res.json({ success: true, message: 'Blog unsaved', saved: false });
    } else {
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

// Check if a blog is saved by current user
router.get('/:id/is-saved', requireAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const savedBlogs = user.savedBlogs || [];
    const isSaved = savedBlogs.some(id => id.toString() === blogId.toString());

    res.json({ success: true, saved: isSaved });
  } catch (error) {
    console.error('Error checking saved status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get comments for a blog
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'fullName ProfileUrl name email');
    res.json({ success: true, comments });
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
});

// Add comment to a blog
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

    const populated = await comment.populate('createdBy', 'fullName ProfileUrl name email');

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

export default router;