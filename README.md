# 🌟 ThoughtSphere - Where Ideas Come Alive

A modern, full-stack blogging platform built with React.js and Node.js, featuring user authentication, blog management, and social interactions.

![ThoughtSphere Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=ThoughtSphere+-+Where+Ideas+Come+Alive)

## 🚀 Features

### 🔐 Authentication & User Management
- **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- **User Registration & Login** - Complete user onboarding flow
- **Profile Management** - User profiles with customizable avatars
- **Protected Routes** - Secure access to user-specific features

### 📝 Blog Management
- **Create & Edit Blogs** - Rich text editor for blog creation
- **Cover Image Upload** - Cloudinary integration for image storage
- **Blog Categories** - Organize content with tags and categories
- **Draft & Publish** - Save drafts and publish when ready

### 💝 Social Features
- **Like System** - Users can like/unlike blog posts
- **Save Blogs** - Bookmark favorite articles for later reading
- **Comments** - Engage with readers through comments
- **Share Functionality** - Share articles on social media platforms

### 🎨 User Experience
- **Dark/Light Mode** - Toggle between themes with system preference detection
- **Responsive Design** - Mobile-first design that works on all devices
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Smooth loading animations and skeletons
- **Search Functionality** - Find articles quickly with search

### ⚡ Performance & Technical
- **Optimistic Updates** - Instant UI feedback with rollback on errors
- **Image Optimization** - Automatic image compression and CDN delivery
- **SEO Friendly** - Meta tags and structured data for better search visibility
- **Error Handling** - Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single-page application
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful & consistent icon library
- **Axios** - Promise-based HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for secure authentication
- **Cloudinary** - Cloud-based image and video management
- **Multer** - Middleware for handling multipart/form-data

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting for consistent code quality
- **Prettier** - Code formatting for consistent style
- **Nodemon** - Auto-restart development server on changes

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/thoughtsphere.git
cd thoughtsphere
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/thoughtsphere
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/thoughtsphere

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret

# Server
PORT=4500
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend directory:
```env
VITE_API_BASE_URL=http://localhost:4500
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4500

## 🗄️ Database Schema

### User Schema
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  ProfileUrl: String,
  role: String (USER/ADMIN),
  savedBlogs: [ObjectId],
  likedBlogs: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Schema
```javascript
{
  title: String (required),
  body: String (required),
  coverImageURL: String,
  createdBy: ObjectId (User),
  likes: Number (default: 0),
  likedBy: [ObjectId],
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema
```javascript
{
  content: String (required),
  blogId: ObjectId (Blog),
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/signin` - User login
- `POST /user/logout` - User logout
- `GET /user/me` - Get current user profile

### Blogs
- `GET /blog` - Get all blogs
- `GET /blog/:id` - Get single blog
- `POST /blog` - Create new blog (auth required)
- `PUT /blog/:id` - Update blog (auth required)
- `DELETE /blog/:id` - Delete blog (auth required)

### Interactions
- `POST /blog/:id/like` - Like/unlike blog (auth required)
- `GET /blog/:id/is-liked` - Check if user liked blog (auth required)
- `POST /blog/:id/save` - Save/unsave blog (auth required)
- `GET /blog/:id/is-saved` - Check if user saved blog (auth required)
- `GET /blog/saved` - Get user's saved blogs (auth required)

### Comments
- `GET /blog/:id/comments` - Get blog comments
- `POST /blog/:id/comments` - Add comment (auth required)

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Update CORS settings for production domain
3. Configure MongoDB Atlas for production database

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_BASE_URL=your-backend-url`
4. Configure redirects for SPA routing

### Environment Variables for Production
```env
# Backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
PORT=4500
NODE_ENV=production

# Frontend
VITE_API_BASE_URL=https://your-backend-url
```

## 📱 Features Showcase

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern, translucent design elements
- **Smooth Animations** - Micro-interactions and transitions
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - System preference detection with manual toggle

### 🔧 User Management
- **Secure Authentication** - Password hashing with bcrypt
- **Session Management** - JWT tokens with auto-refresh
- **Profile Customization** - User avatars and profile information

### 📖 Content Management
- **Rich Text Editor** - Write and format blog posts
- **Image Upload** - Drag-and-drop image uploads with optimization
- **Auto-save Drafts** - Never lose your work
- **SEO Optimization** - Meta tags and social sharing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Contact: [your-email@example.com]
- Check the documentation in the `/docs` folder

## 🎯 Roadmap

### Upcoming Features
- [ ] **Email Notifications** - Notify users of comments and likes
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Blog Categories** - Organize content with categories
- [ ] **User Following** - Follow favorite authors
- [ ] **RSS Feed** - Subscribe to blog updates
- [ ] **Admin Dashboard** - Content moderation and analytics
- [ ] **Mobile App** - React Native mobile application
- [ ] **Content Scheduling** - Schedule blog posts for later

### Performance Improvements
- [ ] **Server-Side Rendering** - Next.js migration for better SEO
- [ ] **Progressive Web App** - PWA features for mobile experience
- [ ] **Caching Strategy** - Redis implementation for better performance
- [ ] **CDN Integration** - Global content delivery

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</div>

<div align="center">
  <img src="https://via.placeholder.com/100x100/6366f1/ffffff?text=TS" alt="ThoughtSphere Logo" width="100">
  <br>
  <strong>ThoughtSphere - Where Ideas Come Alive</strong>
</div>