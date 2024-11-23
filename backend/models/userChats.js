import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Added index
    },
    chats: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          index: true, // Added index
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index if necessary
userChatsSchema.index({ userId: 1, "chats.title": 1 });

export default mongoose.models.userchats || mongoose.model("userchat", userChatsSchema);