import { createHmac, randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { createTokenForUser } from '../services/authentication.js';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    ProfileUrl: { type: String, default: '/images/default.webp' },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', salt).update(this.password).digest('hex');
  this.salt = salt;
  this.password = hash;
  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');
  const hash = createHmac('sha256', user.salt).update(password).digest('hex');
  if (hash !== user.password) throw new Error('Incorrect password');
  const token = createTokenForUser(user);
  return { token, user };
};

const User = mongoose.model('User', userSchema);
export default User;