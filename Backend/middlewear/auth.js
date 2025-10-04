import { validateUser } from "../services/authentication.js";

function checkforAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
           return next();
        }
        try {
            const userPayload = validateUser(tokenCookieValue);
            req.user = userPayload;     //  This is done to attach the authenticated user's details to the request object (req), making it accessible in all subsequent middleware and route handlers
        } catch (error) {}
         return next();
    }

}


export default checkforAuthenticationCookie;