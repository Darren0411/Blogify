# 📝 Blogify — A Modern MERN Stack Blogging Platform

![Blogify Banner](./assets/blogify-banner.png) <!-- Optional: add a header image or logo -->

> A full-featured blogging website built with the **MERN stack** (MongoDB, Express.js, React, Node.js), allowing users to **create and share blog posts** with a clean, responsive UI and secure authentication.

---

## 🚀 Features

✅ **User Authentication**
- Sign up, log in, and log out securely using **JWT** and **bcrypt**.
- Persistent sessions using **HTTP-only cookies**.

✅ **Blog Management**
- Create, like, comment, and view blogs.
- Rich text editor for beautiful formatting.
- Auto-timestamped posts with author details.

✅ **Comments & Interactions**
- Users can comment on posts.
- View all comments for a post in real-time.

✅ **Image Uploads**
- Integrated with **Cloudinary** for image hosting.
- Users can attach feature images to their blogs.

✅ **Responsive UI**
- Built with **React + TailwindCSS**, ensuring mobile-friendly design.

✅ **RESTful API**
- Express.js backend following REST conventions.
- Proper error handling and validation middleware.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | React.js, TailwindCSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt, HTTP-only cookies |
| **Image Hosting** | Cloudinary |
| **Version Control** | Git & GitHub |

---

## 📸 Screenshots

> *(Add screenshots of your UI once deployed — examples below)*

| Home Page | Blog Editor | Dashboard |
|------------|-------------|------------|
| ![Home](./assets/home.png) | ![Editor](./assets/editor.png) | ![Dashboard](./assets/dashboard.png) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Darren0411/Blogify.git
cd Blogify
2️⃣ Install dependencies
For both frontend and backend:

bash
Copy code
# Install server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
3️⃣ Setup environment variables
Create a .env file inside the backend/ folder with the following values:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
4️⃣ Run the app
Open two terminals:

Backend:

bash
Copy code
cd backend
npm run dev
Frontend:

bash
Copy code
cd frontend
npm start
Then visit 👉 http://localhost:3000

📁 Folder Structure
pgsql
Copy code
Blogify/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
🧑‍💻 Future Enhancements
🧠 Add blog post categories & tags

💬 Add likes/reactions for posts

🧾 Implement user profile pages

📊 Add analytics dashboard for authors

🌐 Deploy on Vercel (frontend) & Render (backend)

🌍 Deployment
Frontend hosted on Vercel, backend hosted on Render, and database on MongoDB Atlas.

Live Demo: https://blogify-app.vercel.app
(Replace with your deployed link once ready)

🤝 Contributing
Contributions are welcome!
If you'd like to improve Blogify, please fork the repository and submit a pull request.

🧑‍💻 Author
👤 Darren Ronie D'Sa
📧 darrendsa90@gmail.com
🔗 LinkedIn | GitHub

🪪 License
This project is licensed under the MIT License.
See the LICENSE file for details.