import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const secret = process.env.SESSION_SECRET;

function createTokenForUser(user){
    const payload={
        _id:user._id,
        name:user.fullName,
        email:user.email,
        ProfileUrl:user.ProfileUrl,
        role : user.role,
    };
    const token = jwt.sign(payload,secret);
    return token;
}

function validateUser(token){
    const payload = jwt.verify(token,secret);
    return payload;
}


export {
    createTokenForUser,
    validateUser,
}