import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import AddBlog from './Pages/AddBlog';
import BlogDetail from './Pages/BlogDetail';

function App() {
  const [count, setCount] = useState(0)

  return (
       <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/add-blog" element={<AddBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
  )
}

export default App
