# 🚀 Deployment Checklist - Authentication Fix

## ✅ Changes Completed

### Frontend Files Updated
All frontend files now use the centralized `api` instance from `/src/utils/api.js`:

- ✅ `src/utils/api.js` - Created with axios instance + interceptors
- ✅ `src/Pages/Login.jsx` - Updated to use api instance
- ✅ `src/Pages/Signup.jsx` - Updated to use api instance
- ✅ `src/Pages/Home.jsx` - Updated to use api instance
- ✅ `src/Pages/AddBlog.jsx` - Updated to use api instance
- ✅ `src/Pages/MyBlogs.jsx` - Updated to use api instance
- ✅ `src/pages/SavedBlogs.jsx` - Updated to use api instance
- ✅ `src/components/Navbar.jsx` - Updated to use api instance
- ✅ `src/components/BlogDetails.jsx` - Updated to use api instance
- ✅ `src/contexts/AuthContext.jsx` - Updated to use api instance

### Backend Configuration
Backend already has the necessary cookie authentication setup:

- ✅ `app.js` - Trust proxy enabled, CORS configured with credentials
- ✅ `routes/user.js` - Cookies set with `secure: true, sameSite: 'none'`
- ✅ `middlewear/auth.js` - Cookie validation working

## 📋 Deployment Steps

### 1. Backend Deployment (Render)
```bash
cd Backend
git add .
git commit -m "Fix: Cookie authentication for cross-origin requests"
git push origin main
```

**Verify in Render Dashboard:**
- Go to https://dashboard.render.com
- Select your backend service
- Check "Events" tab for successful deployment
- Review "Logs" for any errors

### 2. Frontend Deployment (Vercel)
```bash
cd Frontend
git add .
git commit -m "Fix: Replace axios with centralized api instance for authentication"
git push origin main
```

**Verify in Vercel Dashboard:**
- Go to https://vercel.com/dashboard
- Select your project
- Check "Deployments" for success status
- Ensure environment variables are set:
  - `VITE_API_BASE_URL=https://blogify-backend-8ix5.onrender.com`

### 3. Disable Vercel Deployment Protection
**CRITICAL: This prevents Vercel's `_vercel_jwt` cookie from interfering**

1. Go to Vercel Dashboard → Your Project
2. Settings → Deployment Protection
3. **Disable** "Password Protection" or "Vercel Authentication"
4. Save changes

## 🧪 Testing the Authentication Flow

### Pre-Test Setup
1. **Clear all cookies** in your browser for both localhost and deployed URLs
2. Open DevTools → Network tab
3. Enable "Preserve log"

### Test Sequence

#### 1. Signup Test
- Navigate to: `https://your-app.vercel.app/signup`
- Fill in registration form
- Submit and check:
  - ✅ Status 200/201 on `/user/signup`
  - ✅ `Set-Cookie` header with `blogify_token`
  - ✅ Cookie attributes: `HttpOnly; Secure; SameSite=None`
  - ✅ Redirect to login or home page

#### 2. Login Test
- Navigate to: `https://your-app.vercel.app/login`
- Enter credentials
- Submit and check:
  - ✅ Status 200 on `/user/signin`
  - ✅ `Set-Cookie` header with `blogify_token`
  - ✅ Redirect to home page
  - ✅ Navbar shows user profile

#### 3. Authentication Persistence Test
- After login, refresh the page
- Check:
  - ✅ Request to `/user/me` includes `Cookie: blogify_token=...`
  - ✅ Status 200 with user data
  - ✅ User stays logged in (no redirect to login)

#### 4. Protected Actions Test
- Try to:
  - Create a blog
  - Like a blog
  - Comment on a blog
  - Save a blog
- Check:
  - ✅ All requests include `Cookie: blogify_token=...`
  - ✅ No 401 Unauthorized errors
  - ✅ Actions complete successfully

#### 5. Logout Test
- Click logout button
- Check:
  - ✅ Cookie is cleared
  - ✅ Redirect to login page
  - ✅ Cannot access protected routes

## 🔍 Debugging Commands

### Check Backend Logs (Render)
```bash
# View live logs
# Go to Render Dashboard → Your Service → Logs tab
# Look for these messages:
# ✅ Login successful: user@email.com
# ✅ Token generated
# ✅ Cookie set for: user@email.com
# 🔍 Auth check - User: user@email.com
```

### Check Frontend Logs (Browser)
```bash
# Open Browser DevTools → Console
# Look for these messages:
# 🌐 API Base URL: https://blogify-backend-8ix5.onrender.com
# 🔐 Request to /user/signin with credentials
# ✅ Response: {success: true, user: {...}}
```

### Verify Cookie in Browser
1. Open DevTools → Application → Cookies
2. Select your domain (e.g., `blogify-*.vercel.app`)
3. Look for cookie named `blogify_token`
4. Verify attributes:
   - **HttpOnly**: ✓ (should be checked)
   - **Secure**: ✓ (should be checked)
   - **SameSite**: None
   - **Path**: /
   - **Domain**: (your backend domain)

## ⚠️ Common Issues & Solutions

### Issue 1: Still getting 401 Unauthorized
**Solution:**
- Clear ALL cookies (including localhost)
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- Check if Vercel Deployment Protection is disabled
- Verify `VITE_API_BASE_URL` environment variable is set correctly

### Issue 2: Cookie not appearing
**Solution:**
- Check backend logs for "Cookie set for: [email]"
- Verify CORS allows your Vercel domain
- Ensure backend has `app.set('trust proxy', 1)`
- Check that cookie name is `blogify_token` (not `token`)

### Issue 3: Cookie present but not sent with requests
**Solution:**
- Verify `api.js` has `withCredentials: true`
- Check that all files import from `'../utils/api'` not `'axios'`
- Ensure cookie domain matches backend domain
- Verify SameSite=None and Secure=true are set

### Issue 4: Works locally but not in production
**Solution:**
- Verify environment variables in Vercel (VITE_API_BASE_URL)
- Check backend environment variables in Render (NODE_ENV=production)
- Ensure MongoDB Atlas allows Render's IP (whitelist 0.0.0.0/0)
- Verify Cloudinary credentials are set in Render

## 📝 Environment Variables Checklist

### Vercel (Frontend)
```
VITE_API_BASE_URL=https://blogify-backend-8ix5.onrender.com
```

### Render (Backend)
```
NODE_ENV=production
MONGO_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## ✅ Success Criteria

Your authentication is working correctly when:

1. ✅ User can signup and login without errors
2. ✅ Cookie `blogify_token` appears in browser after login
3. ✅ All subsequent requests include the cookie automatically
4. ✅ User stays logged in after page refresh
5. ✅ User can perform protected actions (create blog, like, comment, save)
6. ✅ No 401 errors in browser console or network tab
7. ✅ Logout clears the cookie and redirects to login

## 🎉 Post-Deployment Verification

Once deployed, test the complete user journey:

1. **Anonymous User** → Can view blogs
2. **Signup** → Creates account, sets cookie
3. **Login** → Authenticates, sets cookie
4. **Create Blog** → Requires authentication
5. **Like/Comment** → Requires authentication
6. **Save Blog** → Requires authentication
7. **Logout** → Clears cookie, redirects to login

---

**Backend URL:** https://blogify-backend-8ix5.onrender.com
**Frontend URL:** https://blogify-l67cddl91-darrens-projects-945d9eea.vercel.app

**Last Updated:** December 2024
**Status:** Ready for deployment ✅
