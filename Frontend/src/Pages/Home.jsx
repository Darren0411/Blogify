import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import SearchFilterBar from '../components/home/SearchFilterBar';
import BlogGrid from '../components/home/BlogGrid';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/', { headers: { Accept: 'application/json' } });
        if (!cancelled) setBlogs(res.data.blogs || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load blogs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBlogs();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach(b => b.category && set.add(b.category));
    return ['all', ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.body?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        resultCount={filteredBlogs.length}
      />
      <div id="stories" className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold text-foreground">Latest stories</h2>
        </div>
        <BlogGrid loading={loading} error={error} blogs={filteredBlogs} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;