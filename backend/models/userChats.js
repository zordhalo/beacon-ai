import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    chats: [
        {
            chatId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            chatTitle: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ]
},
{ timestamps: true });

export default mongoose.models.userchats || mongoose.model("userchat", userChatsSchema);