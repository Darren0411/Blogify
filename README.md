<div align="center">

# 🌟 ThoughtSphere

### *Where Ideas Come Alive*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-purple?style=for-the-badge)](https://blogify-mds22x1up-darrens-projects-945d9eea.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**A modern, full-stack blogging platform built with the MERN stack**

*Create, share, and discover extraordinary stories in a vibrant community*

</div>

---

## 🎯 Project Overview

ThoughtSphere is a feature-rich blogging platform that empowers writers to share their thoughts with the world. Built with the MERN stack, it offers a seamless writing and reading experience with an emphasis on security, performance, and elegant design. This project showcases modern web development practices with cookie-based JWT authentication, responsive UI, and real-time interactions.

---

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based auth with HTTP-only cookies
- **📝 Rich Blogging**: Create, edit, and delete blogs with image uploads
- **💾 Smart Bookmarking**: Save favorite blogs for later reading
- **🌓 Theme Support**: Beautiful dark/light mode with persistent preferences
- **📱 Fully Responsive**: Optimized for all screen sizes
- **⚡ Real-time Updates**: Instant notifications and activity feed
- **🎨 Modern UI**: Gradient-rich design with smooth animations
- **👤 User Profiles**: Auto-generated avatar initials and personal dashboards

---

## 🚀 Technology Stack

### **Frontend**
- **Framework**: Next.js alternative → React 18 + Vite
- **Styling**: Tailwind CSS with custom gradients
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Security**: CORS, cookie-parser, HTTP-only cookies

### **Deployment**
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🏗️ Architecture

```
ThoughtSphere/
├── Frontend/                    # React Application
│   ├── src/
│   │   ├── Pages/              # Route pages (Home, Login, MyBlogs, etc.)
│   │   ├── components/         # Reusable components (Navbar, BlogDetails)
│   │   ├── contexts/           # AuthContext for global state
│   │   └── utils/              # API configuration with Axios
│   └── public/                 # Static assets
│
├── Backend/                     # Express Server
│   ├── models/                 # Mongoose schemas (User, Blog)
│   ├── routes/                 # API routes (user, blog)
│   ├── middlewear/             # Auth middleware
│   ├── services/               # JWT utilities
│   └── app.js                  # Server configuration
│
└── README.md                    # You are here!
```

---

## 🎨 UI Components & Design

### **Custom Enhancements**
- Gradient backgrounds with smooth transitions
- Card hover effects with subtle shadows
- Loading skeletons for better UX
- Glass morphism effects
- Animated toast notifications
- Responsive navbar with dropdown menus

### **Color Palette**
```css
/* Dark Theme */
--primary: #8B5CF6 (Purple)
--secondary: #6366F1 (Indigo)
--accent: #06B6D4 (Cyan)

/* Light Theme */
--background: #FFFFFF
--text: #1F2937
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Darren0411/Blogify.git
cd thoughtsphere
```

2. **Backend Setup**
```bash
cd Backend
npm install

# Create .env file
cat > .env << EOF
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=4500
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

npm start
```

3. **Frontend Setup**
```bash
cd Frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4500
EOF

npm run dev
```

4. **Access the app**
```
http://localhost:5173
```

---
## 🔧 Environment Variables

### **Backend (.env)**
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | `your_super_secret_key_here` |
| `PORT` | Server port | `4500` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### **Frontend (.env)**
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:4500` |

💡 **Tip**: Use `openssl rand -base64 32` to generate a secure JWT_SECRET

---

## 📱 Features in Detail

### **1. Authentication & Security**
- Cookie-based JWT authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with middleware
- Automatic session management
- Secure logout with cookie clearing

### **2. Blog Management**
- Create blogs with rich text and images
- Edit your own published blogs
- Delete blogs you've created
- Personal dashboard with all your posts
- Real-time blog statistics

### **3. Social Features**
- Save/bookmark favorite blogs
- View other users' published blogs
- Author profile with avatar initials
- Activity feed with latest posts
- Notification system with badge counter

### **4. User Experience**
- Dark/Light theme toggle
- Persistent theme in localStorage
- Loading skeletons
- Toast notifications
- Fully responsive design
- Mobile-optimized interface

---

## 🎯 API Endpoints

### **Authentication**
```
POST   /user/signup    - Register new user
POST   /user/signin    - Login user
GET    /user/me        - Get current user
POST   /user/logout    - Logout user
```

### **Blogs**
```
GET    /               - Get all blogs
GET    /blog/:id       - Get single blog
POST   /blog           - Create blog (protected)
PUT    /blog/:id       - Update blog (protected)
DELETE /blog/:id       - Delete blog (protected)
POST   /blog/:id/save  - Save/unsave blog (protected)
GET    /blog/user/:userId      - Get user's blogs
GET    /blog/saved/:userId     - Get saved blogs (protected)
```

---

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect GitHub repository
2. Set Root Directory: `Frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add env: `VITE_API_BASE_URL=https://your-backend.onrender.com`

### **Backend (Render)**
1. Create new Web Service
2. Set Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from `.env`

### **Database (MongoDB Atlas)**
1. Create free cluster
2. Add database user
3. Whitelist all IPs (`0.0.0.0/0`)
4. Copy connection string to `MONGO_URL`

---

## 🔒 Privacy & Security

- **No Data Leaks**: Environment variables never exposed
- **HTTP-only Cookies**: Protected from XSS attacks
- **Password Hashing**: Bcrypt with 10 salt rounds
- **CORS Protection**: Whitelist specific origins
- **Secure in Production**: HTTPS-only cookie transmission

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 🐛 Troubleshooting

### **Common Issues**

**401 Errors?**
- Check `withCredentials: true` in api.js
- Verify CORS settings allow credentials
- Ensure cookie is being set (DevTools → Application → Cookies)

**CORS Errors?**
- Match `FRONTEND_URL` exactly in backend .env
- Enable `credentials: true` in CORS config

**MongoDB Connection Failed?**
- Check IP whitelist (0.0.0.0/0)
- Verify connection string format
- Ensure database user has correct permissions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For utility-first styling
- **MongoDB** - For flexible database solution
- **Vercel & Render** - For seamless deployment

---

## 👨‍💻 Author

**Darren D'Sa**

- GitHub: [@Darren0411](https://github.com/Darren0411)
- Email: darren@example.com

---

<div align="center">

**Built with ❤️ for a more informed blogging community**

⭐ Star this repo if you found it helpful!

[🏠 Home](https://blogify-mds22x1up-darrens-projects-945d9eea.vercel.app/) • [🐛 Issues](https://github.com/Darren0411/Blogify/issues) • [📖 Docs](#-getting-started)

© 2024 ThoughtSphere. All rights reserved.

</div>