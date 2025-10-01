import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PenToolIcon, 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  GithubIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowUpIcon,
  HeartIcon
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 rounded-xl">
                <PenToolIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  ThoughtSphere
                </span>
                <p className="text-xs text-gray-400 -mt-1">Share Your Thoughts</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A platform where ideas flourish and creativity knows no bounds. Join our community of writers, thinkers, and storytellers from around the world.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-indigo-600 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-500 transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-600 transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-600 transition-colors">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Explore Articles
                </Link>
              </li>
              <li>
                <Link to="/add-blog" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Write Article
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Trending
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/writers" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Featured Writers
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Writing Guidelines
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Events
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Connected</h3>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <MailIcon className="h-4 w-4 text-indigo-400" />
                <span className="text-sm">hello@thoughtsphere.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="h-4 w-4 text-indigo-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPinIcon className="h-4 w-4 text-indigo-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-white">Subscribe to our newsletter</h4>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400 text-sm">
              <p className="flex items-center">
                Made with 
                <HeartIcon className="h-4 w-4 text-red-500 mx-1" />
                by Darru 
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-indigo-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;