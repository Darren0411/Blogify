import nodemailer from 'nodemailer';
import crypto from 'crypto';

const OTPStore = new Map(); // In-memory (use Redis/DB in production)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,         // set in .env
    pass: process.env.EMAIL_PASS,         // app password
  },
});

/**
 * Send OTP to email
 * @param {Object} param0
 * @param {string} param0.email
 * @param {string} param0.subject
 * @param {string} param0.message
 * @param {number} param0.duration  minutes
 */
export async function sendOTP({ email, subject, message, duration = 5 }) {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + duration * 60 * 1000;
  OTPStore.set(email, { otp, expiresAt });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: `${message}\nYour OTP: ${otp}\nValid for ${duration} minutes.`,
  });

  return { success: true };
}

export async function verifyOTP(email, otp) {
  const data = OTPStore.get(email);
  if (!data) return false;
  if (data.expiresAt < Date.now()) {
    OTPStore.delete(email);
    return false;
  }
  if (data.otp !== otp) return false;
  OTPStore.delete(email);
  return true;
}