📝 Blogify
Blogify is a full-stack blogging platform where users can write, read, and interact with blogs. Built using Node.js, Express, MongoDB, EJS, and Cloudinary, it allows for user authentication, blog creation, and rich blog interaction.

🚀 Features
🔐 User Authentication – Sign up and log in using secure cookies and sessions

🖊️ Create Blogs – Authenticated users can write and publish their own blogs

📖 Read Blogs – All users can browse and read blogs

💬 Commenting System – Users can comment on blogs

🖼️ Image Upload – Upload blog images to Cloudinary

🌐 EJS Templating – Dynamic front-end rendering using EJS

🧠 MongoDB Integration – Store users and blog content in a NoSQL database

🛠️ Tech Stack
Tech	Description
Node.js	Backend runtime environment
Express.js	Web framework for Node.js
MongoDB	NoSQL database
Mongoose	ODM for MongoDB
EJS	Server-side templating engine
Cloudinary	Cloud image storage and CDN
dotenv	Environment variable handling
cookie-parser	Parse and authenticate cookies
express-session	Handle user sessions securely

🧩 Folder Structure
bash
Copy
Edit
Blogify/
│
├── routes/            # Route handlers (user & blog)
├── models/            # Mongoose models
├── views/             # EJS templates
├── public/            # Static assets (CSS, JS, images)
├── middlewear/        # Custom middleware (e.g., auth)
├── .env               # Environment variables
├── app.js             # Main server file
└── README.md
⚙️ Installation
Clone the repository

bash
Copy
Edit
git clone https://github.com/Darren0411/blogify.git
cd blogify
Install dependencies

bash
Copy
Edit
npm install
Set up environment variables
Create a .env file in the root directory and add the following:

ini
Copy
Edit
PORT=5000
MONGO_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the development server

bash
Copy
Edit
npm start
🖼️ Screenshots (optional)
Include screenshots or GIFs of the homepage, blog creation page, and comment section.

👤 Author
Darren D'sa

GitHub: [@Darren1105](https://github.com/Darren0411) 

LinkedIn: [Darren D'sa](https://www.linkedin.com/in/darren-d-sa-99149b28a/)


📄 License
This project is licensed under the MIT License.
