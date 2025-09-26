const JWT = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SESSION_SECRET;

function createTokenForUser(user){
    const payload={
        _id:user._id,
        name:user.fullName,
        email:user.email,
        ProfileUrl:user.ProfileUrl,
        role : user.role,
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function validateUser(token){
    const payload = JWT.verify(token,secret);
    return payload;
}


module.exports = {
    createTokenForUser,
    validateUser,
}