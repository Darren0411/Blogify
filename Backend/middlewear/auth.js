import { validateUser } from '../services/authentication.js';

export function checkforAuthenticationCookie(cookieName = 'blogify_token') {
  return (req, res, next) => {
    console.log('🍪 All cookies received:', req.cookies);
    console.log('🍪 Looking for cookie:', cookieName);
    
    const token = req.cookies?.[cookieName];
    
    if (!token) {
      console.log('⚠️ No token cookie found in:', Object.keys(req.cookies || {}));
      req.user = null;
      return next();
    }

    console.log('✅ Token cookie found:', token.substring(0, 20) + '...');

    try {
      const userPayload = validateUser(token);
      
      if (userPayload) {
        req.user = userPayload;
        console.log('✅ Token valid for user:', userPayload._id);
      } else {
        req.user = null;
        console.log('⚠️ Token validation returned null');
      }
    } catch (error) {
      console.error('❌ Token validation failed:', error.message);
      req.user = null;
    }
    
    return next();
  };
}

export default checkforAuthenticationCookie;