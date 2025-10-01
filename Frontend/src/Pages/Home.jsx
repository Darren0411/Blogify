import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowRightIcon, SearchIcon, TrendingUpIcon, BookOpenIcon, FilterIcon } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blogs based on your blog model structure
  const mockBlogs = [
    {
      _id: '1',
      title: 'The Future of Artificial Intelligence in Healthcare',
      body: 'Artificial Intelligence is revolutionizing the healthcare industry in unprecedented ways. From diagnostic imaging to personalized treatment plans, AI is making healthcare more accurate, efficient, and accessible. Machine learning algorithms can now detect diseases earlier than human doctors in many cases...',
      coverImageURL: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '1', fullName: 'Dr. Sarah Johnson' },
      createdAt: '2024-09-25T10:30:00Z',
      category: 'Technology'
    },
    {
      _id: '2',
      title: 'Sustainable Living: Small Changes, Big Impact',
      body: 'Living sustainably doesn\'t require drastic lifestyle changes. Small, consistent actions can create a significant positive impact on our environment. From reducing plastic consumption to choosing renewable energy sources...',
      coverImageURL: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '2', fullName: 'Emma Green' },
      createdAt: '2024-09-24T14:15:00Z',
      category: 'Lifestyle'
    },
    {
      _id: '3',
      title: 'The Art of Mindful Cooking: A Journey to Wellness',
      body: 'Cooking is more than just preparing food; it\'s a meditative practice that connects us with our ingredients, our culture, and ourselves. Mindful cooking involves being present in every step of the process...',
      coverImageURL: 'https://images.unsplash.com/photo-1556909114-4194c5c1a555?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '3', fullName: 'Chef Maria Rodriguez' },
      createdAt: '2024-09-23T09:45:00Z',
      category: 'Food'
    },
    {
      _id: '4',
      title: 'Remote Work Revolution: Building Strong Virtual Teams',
      body: 'The shift to remote work has fundamentally changed how we collaborate and build relationships with our colleagues. Successful virtual teams require intentional communication, clear processes, and a culture of trust...',
      coverImageURL: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '4', fullName: 'Alex Chen' },
      createdAt: '2024-09-22T16:20:00Z',
      category: 'Business'
    },
    {
      _id: '5',
      title: 'Exploring the Hidden Gems of Southeast Asia',
      body: 'Beyond the popular tourist destinations lies a world of hidden treasures waiting to be discovered. From secluded beaches in the Philippines to ancient temples in Cambodia, Southeast Asia offers endless adventures...',
      coverImageURL: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '5', fullName: 'Jake Thompson' },
      createdAt: '2024-09-21T11:10:00Z',
      category: 'Travel'
    },
    {
      _id: '6',
      title: 'The Psychology of Color in Modern Design',
      body: 'Colors have a profound impact on human emotions and behavior. Understanding color psychology is crucial for designers, marketers, and anyone looking to create compelling visual experiences...',
      coverImageURL: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      createdBy: { _id: '6', fullName: 'Lisa Park' },
      createdAt: '2024-09-20T13:30:00Z',
      category: 'Design'
    }
  ];

  const categories = ['all', 'Technology', 'Lifestyle', 'Food', 'Business', 'Travel', 'Design'];

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

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const featuredBlog = mockBlogs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ThoughtSphere
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover extraordinary stories, share your insights, and connect with writers from around the globe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/add-blog" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Writing Today
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300">
                Explore Stories
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 -mt-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FilterIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5" />
                <span className="font-medium">{filteredBlogs.length} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                <span className="font-medium">Trending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {featuredBlog && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUpIcon className="h-8 w-8 text-indigo-600 mr-3" />
            Featured Article
          </h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredBlog.coverImageURL}
                  alt={featuredBlog.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredBlog.category}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-height-tight">
                  {featuredBlog.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {truncateText(featuredBlog.body, 200)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {featuredBlog.createdBy.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{featuredBlog.createdBy.fullName}</p>
                      <p className="text-sm text-gray-500">{formatDate(featuredBlog.createdAt)}</p>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredBlog._id}`}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    Read More
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Latest Stories from Our Community
        </h2>
        
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl text-gray-500 mb-2">No articles found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.slice(1).map((blog) => (
              <article 
                key={blog._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={blog.coverImageURL}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {truncateText(blog.body)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {blog.createdBy.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{blog.createdBy.fullName}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {formatDate(blog.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
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

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of writers sharing their insights on ThoughtSphere
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;