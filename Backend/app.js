require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkforAuthenticationCookie } = require("./middlewear/auth");
const Blog = require("./models/blog");
const session = require("express-session");

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, { 
    dbName: "Blogify",
  })
  .then((e) => console.log("MongoDB connected"));

// CORS Configuration for React Frontend
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// Routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);


//Fetch all blogs with user details
app.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("createdBy", "fullName ProfileUrl");
    res.json({
      success: true,
      blogs,
      user: req.user || null,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
});


const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});