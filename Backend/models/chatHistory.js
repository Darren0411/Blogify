// models/chatHistory.js
import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false, // guests (readers not logged in) can still use the bot
      index: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blog',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['grammar', 'summarize', 'define', 'chat'],
      required: true,
    },
    userMessage: {
      type: String,
      required: true,
    },
    assistantResponse: {
      type: mongoose.Schema.Types.Mixed, // string or object depending on type
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

chatHistorySchema.index({ userId: 1, blogId: 1, timestamp: -1 });

// Auto-delete history older than 90 days (optional, saves storage)
chatHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const ChatHistory = mongoose.model('chatHistory', chatHistorySchema);
export default ChatHistory;