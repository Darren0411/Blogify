import { validateUser } from '../services/authentication.js';

// Attaches req.user if a valid token cookie exists; never blocks the request.
export function checkforAuthenticationCookie(cookieName = 'blogify_token') {
  return (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) {
      req.user = null;
      return next();
    }
    try {
      const userPayload = validateUser(token);
      req.user = userPayload || null;
    } catch (err) {
      req.user = null; // invalid/expired token -> continue without user
    }
    return next();
  };
}

export default checkforAuthenticationCookie;