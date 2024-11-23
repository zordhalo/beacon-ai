import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // Added index
  },
  title: {
    type: String,
    required: true,
    index: true, // Added index
  },
  history: [{
    role: {
      type: String,
      required: true, // Ensure role is required
      enum: ['user', 'model']
    },
    parts: [{
      text: {
        type: String,
        required: true
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Index for faster retrieval by userId and title
chatSchema.index({ userId: 1, title: 1 });

export default mongoose.models.chat || mongoose.model("chat", chatSchema);