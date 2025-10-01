import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  PlusIcon, 
  ImageIcon, 
  TypeIcon, 
  FileTextIcon, 
  SaveIcon,
  XIcon,
  UploadIcon,
  EyeIcon,
  TagIcon
} from 'lucide-react';
import Footer from '../components/Footer';

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'Technology'
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Technology', 'Lifestyle', 'Food', 'Business', 'Travel', 
    'Health', 'Education', 'Entertainment', 'Sports', 'Science'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          coverImage: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          coverImage: 'Image size should be less than 5MB'
        }));
        return;
      }

      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        coverImage: ''
      }));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById('coverImage');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Content is required';
    } else if (formData.body.length < 50) {
      newErrors.body = 'Content must be at least 50 characters long';
    }
    
    if (!coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('body', formData.body);
      submitData.append('category', formData.category);
      submitData.append('coverImage', coverImage);
      
      // TODO: Replace with actual API call
      console.log('Form submitted:', {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        coverImage: coverImage?.name
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to home or blog detail page
      navigate('/');
      
    } catch (error) {
      console.error('Error creating blog:', error);
      setErrors({ submit: 'Failed to create blog. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
         <Navbar />
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-800 dark:via-indigo-800 dark:to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 dark:bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
              <PlusIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Create Your Story
            </h1>
            <p className="text-xl text-purple-100 dark:text-purple-200 max-w-2xl mx-auto">
              Share your thoughts, experiences, and ideas with the world
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              
              {/* Cover Image Upload */}
              <div className="mb-8">
                <label className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <ImageIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Cover Image
                </label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="coverImage"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverImage"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                        <p className="mb-2 text-lg font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          Click to upload cover image
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {coverImage?.name}
                      </p>
                    </div>
                  </div>
                )}
                
                {errors.coverImage && (
                  <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.coverImage}</p>
                )}
              </div>

              {/* Title Input */}
              <div className="mb-8">
                <label className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <TypeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter an engaging title for your blog..."
                  className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.title 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.title}</p>
                )}
                <div className="mt-2 text-right">
                  <span className={`text-sm ${
                    formData.title.length < 5 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formData.title.length}/5 minimum
                  </span>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <label className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <TagIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="py-2 dark:bg-gray-700">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body/Content Textarea */}
              <div className="mb-8">
                <label className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <FileTextIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Content
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  placeholder="Write your blog content here... Share your thoughts, experiences, and insights with the world."
                  rows="12"
                  className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 resize-none ${
                    errors.body 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20'
                  }`}
                />
                {errors.body && (
                  <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.body}</p>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-sm ${
                    formData.body.length < 50 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formData.body.length}/50 minimum characters
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.body.split(' ').filter(word => word.length > 0).length} words
                  </span>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                  <p className="text-red-600 dark:text-red-400 text-center">{errors.submit}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-lg"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-lg flex items-center gap-3"
                >
                  <EyeIcon className="h-5 w-5" />
                  Preview
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center gap-3 justify-center min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-5 w-5" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AddBlog;