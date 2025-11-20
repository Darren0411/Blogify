import { validateUser } from '../services/authentication.js';

/**
 * Middleware to check for authentication cookie
 * Attaches req.user if valid token exists
 * Never blocks the request - just sets req.user to null if invalid
 */
export function checkforAuthenticationCookie(cookieName = 'blogify_token') {
  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    
    if (!token) {
      console.log('⚠️ No token cookie found');
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