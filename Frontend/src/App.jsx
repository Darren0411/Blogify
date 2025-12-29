import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import AddBlog from "./Pages/AddBlog.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import BlogDetails from './components/BlogDetails.jsx';  
import SavedBlogs from "./Pages/SavedBlogs.jsx";
import MyBlogs from './Pages/MyBlogs.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/add-blog" element={<AddBlog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />  
              <Route path="/saved-blogs" element={<SavedBlogs />} />
              <Route path="/my-blogs" element={<MyBlogs />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
   </AuthProvider>
  );
}

export default App;