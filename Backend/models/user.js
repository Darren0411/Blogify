import { createHmac, randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { createTokenForUser } from '../services/authentication.js';

function escapeRegExp(s = '') {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // normalize at set
    salt: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
  },
  { timestamps: true }
);

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

userSchema.pre('save', function (next) {
  // normalize email (extra safety even with lowercase/trim in schema)
  if (this.isModified('email') && this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  if (!this.isModified('password')) return next();
  const salt = randomBytes(16).toString('hex');
  const hash = createHmac('sha256', salt).update(this.password).digest('hex');
  this.salt = salt;
  this.password = hash;
  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const normalized = String(email || '').trim().toLowerCase();

  // exact match first
  let user = await this.findOne({ email: normalized });

  // legacy fallback for rows saved with different casing
  if (!user) {
    user = await this.findOne({ email: new RegExp(`^${escapeRegExp(normalized)}$`, 'i') });
  }

  if (!user) throw new Error('User not found');

  const hash = createHmac('sha256', user.salt).update(password).digest('hex');
  if (hash !== user.password) throw new Error('Incorrect password');

  const token = createTokenForUser(user);
  return { token, user };
};

const User = mongoose.model('User', userSchema);
export default User;