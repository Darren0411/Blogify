import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // The user who CREATED the blog (recipient of notification)
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // The user who LIKED or COMMENTED (who triggered the notification)
    triggerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // The blog that was interacted with
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    
    // Blog title (denormalized for quick display)
    blogTitle: {
      type: String,
      required: true,
    },
    
    // Type of action: "like" or "comment"
    type: {
      type: String,
      enum: ["like", "comment"],
      required: true,
    },
    
    // Is it read by the user?
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;