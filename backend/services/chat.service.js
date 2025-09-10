import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

class ChatService {
  constructor() {
    this.MAX_USER_MESSAGE_LENGTH = 500;
    this.MAX_AI_RESPONSE_LENGTH = 1000;
  }

  // Create a new chat
  async createChat(userId, title, history = []) {
    try {
      // Validate and format each history entry
      const formattedHistory = history.map(entry => ({
        role: entry.role,
        parts: entry.parts
      }));

      const chat = new Chat({
        userId,
        title,
        history: formattedHistory,
      });

      const savedChat = await chat.save();

      // Add to user's chat list
      await UserChats.updateOne(
        { userId },
        { 
          $push: { 
            chats: { 
              _id: savedChat._id, 
              title: savedChat.title,
              createdAt: new Date()
            }
          }
        },
        { upsert: true }
      );

      return savedChat;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw new Error("Failed to create chat");
    }
  }

  // Get a specific chat by ID
  async getChatById(chatId, userId) {
    try {
      if (!chatId) {
        throw new Error("Chat ID is required");
      }

      const chat = await Chat.findOne({ _id: chatId, userId });
      
      if (!chat) {
        throw new Error("Chat not found");
      }

      return chat;
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw error;
    }
  }

  // Update chat with new conversation
  async updateChatHistory(chatId, userId, question, answer, img = null) {
    try {
      // Validate message lengths
      if (question && question.length > this.MAX_USER_MESSAGE_LENGTH) {
        throw new Error("User message exceeds maximum length");
      }

      if (answer && answer.length > this.MAX_AI_RESPONSE_LENGTH) {
        answer = answer.substring(0, this.MAX_AI_RESPONSE_LENGTH) + "...";
      }

      // Build user message parts with optional image
      const userParts = img 
        ? [{ text: question, img: img }]
        : [{ text: question }];
      
      // Add user message first
      await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        {
          $push: {
            history: { role: 'user', parts: userParts }
          }
        },
        { new: true }
      );

      // Add AI response
      const updatedChat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        {
          $push: {
            history: { role: 'model', parts: [{ text: answer }] }
          }
        },
        { new: true }
      );

      return updatedChat;
    } catch (error) {
      console.error("Error updating chat history:", error);
      throw error;
    }
  }

  // Delete a chat
  async deleteChat(chatId, userId) {
    try {
      // Delete the chat from the Chat collection
      await Chat.deleteOne({ _id: chatId, userId });

      // Remove the chat from the UserChats collection
      await UserChats.updateOne(
        { userId },
        { $pull: { chats: { _id: chatId } } }
      );

      return { message: "Chat deleted successfully" };
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw new Error("Error deleting chat");
    }
  }
}

// Export singleton instance
const chatService = new ChatService();
export default chatService;