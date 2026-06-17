import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Input } from '@/components/ui/input';
import {
  ImageIcon, TypeIcon, FileTextIcon, SaveIcon,
  XIcon, UploadIcon,
} from 'lucide-react';

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', body: '', category: 'Technology' });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/user/me');
        if (response.data?.success) {
          setUser(response.data.user);
        } else {
          showToast('Please login to create a blog', 'error');
          navigate('/login');
        }
      } catch {
        showToast('Please login to create a blog', 'error');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, coverImage: 'Please select a valid image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, coverImage: 'Image size should be less than 5MB' }));
      return;
    }

    setCoverImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, coverImage: '' }));
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('coverImage');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters long';

    if (!formData.body.trim()) newErrors.body = 'Content is required';
    else if (formData.body.length < 50) newErrors.body = 'Content must be at least 50 characters long';

    if (!coverImage) newErrors.coverImage = 'Cover image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the form errors', 'error');
      return;
    }
    if (!user) {
      showToast('Please login to create a blog', 'error');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('body', formData.body.trim());
      submitData.append('coverImage', coverImage);

      const response = await api.post('/blog', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        showToast('Blog created successfully!', 'success');
        setTimeout(() => navigate(`/blog/${response.data.blog._id}`), 1500);
      } else {
        throw new Error(response.data?.message || 'Failed to create blog');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Session expired. Please login again', 'error');
        navigate('/login');
      } else if (error.response?.status === 413) {
        showToast('File too large. Please use a smaller image', 'error');
      } else {
        showToast(error.response?.data?.message || 'Failed to create blog. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
            Create your story
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user.fullName || user.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <ImageIcon className="h-4 w-4" />
              Cover image
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
                  className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <UploadIcon className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">Click to upload cover image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Cover preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-background/90 text-foreground p-1.5 rounded-md hover:bg-background transition-colors"
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-background/90 px-3 py-1.5 rounded-md">
                  <p className="text-xs font-medium text-foreground">{coverImage?.name}</p>
                </div>
              </div>
            )}
            {errors.coverImage && <p className="mt-2 text-sm text-destructive">{errors.coverImage}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <TypeIcon className="h-4 w-4" />
              Title
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter an engaging title for your blog..."
            />
            {errors.title && <p className="mt-1.5 text-sm text-destructive">{errors.title}</p>}
            <p className={`mt-1.5 text-xs text-right ${formData.title.length < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {formData.title.length}/5 minimum
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileTextIcon className="h-4 w-4" />
              Content
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Write your blog content here..."
              rows="10"
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            {errors.body && <p className="mt-1.5 text-sm text-destructive">{errors.body}</p>}
            <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span className={formData.body.length < 50 ? 'text-destructive' : ''}>
                {formData.body.length}/50 minimum characters
              </span>
              <span>{formData.body.split(' ').filter(Boolean).length} words</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isLoading}
              className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Publishing...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4" />
                  Publish Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddBlog;