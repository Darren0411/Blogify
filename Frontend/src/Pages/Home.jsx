import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowRightIcon, SearchIcon, BookOpenIcon, FilterIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blogs based on your blog model structure
  const mockBlogs = [
    {
      _id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      body: 'Artificial Intelligence is revolutionizing the healthcare industry in unprecedented ways. From diagnostic imaging to personalized treatment plans, AI is making healthcare more accurate, efficient, and accessible...',
      coverImageURL: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '1', fullName: 'Dr. Sarah Johnson' },
      createdAt: '2024-09-25T10:30:00Z',
      category: 'Technology'
    },
    {
      _id: '2',
      title: 'Sustainable Living: Small Changes, Big Impact',
      body: 'Living sustainably doesn\'t require drastic lifestyle changes. Small, consistent actions can create a significant positive impact on our environment...',
      coverImageURL: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '2', fullName: 'Emma Green' },
      createdAt: '2024-09-24T14:15:00Z',
      category: 'Lifestyle'
    },
    {
      _id: '3',
      title: 'The Art of Mindful Cooking',
      body: 'Cooking is more than just preparing food; it\'s a meditative practice that connects us with our ingredients, our culture, and ourselves...',
      coverImageURL: 'https://images.unsplash.com/photo-1556909114-4194c5c1a555?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '3', fullName: 'Chef Maria Rodriguez' },
      createdAt: '2024-09-23T09:45:00Z',
      category: 'Food'
    },
    {
      _id: '4',
      title: 'Remote Work Revolution',
      body: 'The shift to remote work has fundamentally changed how we collaborate and build relationships with our colleagues...',
      coverImageURL: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '4', fullName: 'Alex Chen' },
      createdAt: '2024-09-22T16:20:00Z',
      category: 'Business'
    },
    {
      _id: '5',
      title: 'Hidden Gems of Southeast Asia',
      body: 'Beyond the popular tourist destinations lies a world of hidden treasures waiting to be discovered...',
      coverImageURL: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '5', fullName: 'Jake Thompson' },
      createdAt: '2024-09-21T11:10:00Z',
      category: 'Travel'
    }
  ];

  const categories = ['all', 'Technology', 'Lifestyle', 'Food', 'Business', 'Travel'];

  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
     <Navbar />
      {/* Hero Section - Full Width */}
      <div className="w-full relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-800 dark:via-indigo-800 dark:to-blue-800 text-white overflow-hidden">
        {/* Dark mode overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative w-full px-4 py-20 md:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                ThoughtSphere
              </span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-100 dark:text-gray-200">
              Discover extraordinary stories and connect with writers worldwide in our vibrant community
            </p>
            <Link 
              to="/add-blog" 
              className="inline-block bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 dark:from-yellow-400 dark:via-orange-400 dark:to-red-400 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 dark:hover:from-yellow-500 dark:hover:via-orange-500 dark:hover:to-red-500 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 dark:hover:shadow-orange-400/25"
            >
              Start Writing Today
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Section - Full Width */}
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 -mt-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 text-lg placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FilterIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 appearance-none min-w-[180px] text-lg font-medium cursor-pointer transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="py-2 dark:bg-gray-700">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-6 py-4 rounded-2xl border border-indigo-200 dark:border-indigo-700/50">
                <BookOpenIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{filteredBlogs.length} Articles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid - Full Width */}
      <div className="w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-12 text-center bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            Latest Stories
          </h2>
          
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <BookOpenIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-500 dark:text-gray-400 mb-4">No articles found</h3>
              <p className="text-xl text-gray-400 dark:text-gray-500 mb-8">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBlogs.map((blog) => (
                <article 
                  key={blog._id} 
                  className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:transform hover:scale-105 border border-white/20 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-600/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.coverImageURL}
                      alt={blog.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Dark overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-white/20 dark:border-gray-600/30">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {truncateText(blog.body)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          {blog.createdBy.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{blog.createdBy.fullName}</p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(blog.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${blog._id}`}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:gap-3"
                      >
                        Read
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;