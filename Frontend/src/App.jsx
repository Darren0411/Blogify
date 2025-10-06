import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AddBlog from "./Pages/AddBlog";
import BlogDetail from "./Pages/BlogDetail";
import { AuthProvider } from "./contexts/AuthContext";
import PageNotFound from "./Pages/PageNotFound";

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
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
   </AuthProvider>
  );
}

export default App;
