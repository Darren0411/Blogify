import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b-2 border-indigo-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            ThoughtSphere
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;