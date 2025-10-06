import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserIcon, 
  MailIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon,
  UserPlusIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: '' }));
    
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const res = await axios.post(
        `${API_BASE_URL}/user/signup`, 
        payload, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        }
      );
      
      if (res.data?.success) {
        // Store user info in localStorage for UI purposes
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('loggedIn', 'true');
        
        console.log('Signup successful:', res.data);
        navigate('/login');
      } else {
        setErrors({ submit: res.data?.message || 'Signup failed' });
      }
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        setErrors({ submit: 'This email is already registered. Try signing in instead.' });
      } else if (err.response?.status === 400) {
        setErrors({ submit: err.response.data?.message || 'Please check all fields and try again.' });
      } else {
        setErrors({
          submit: err.response?.data?.message || 'Unable to create account. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 25, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, text: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, text: 'Good', color: 'bg-blue-500' };
    return { strength: 100, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-3xl mb-6 shadow-2xl">
            <UserPlusIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            Join ThoughtSphere
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Create your account and start sharing
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-2">
                <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className={`w-full px-4 py-4 border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.fullName 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20'
                }`}
              />
              {errors.fullName && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-2">
                <MailIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                autoComplete="email"
                className={`w-full px-4 py-4 border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-2">
                <LockIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength >= 75 ? 'text-green-600 dark:text-green-400' :
                      passwordStrength.strength >= 50 ? 'text-blue-600 dark:text-blue-400' :
                      passwordStrength.strength >= 25 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-center text-sm">{errors.submit}</p>
                {errors.submit.includes('already registered') && (
                  <div className="mt-2 text-center">
                    <Link 
                      to="/login" 
                      className="text-purple-600 dark:text-purple-400 hover:underline font-semibold text-sm"
                    >
                      Sign in instead →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-5 w-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold hover:underline transition-colors inline-flex items-center gap-1"
              >
                Sign In
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm hover:underline transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;