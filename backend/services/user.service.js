import UserChats from "../models/userChats.js";

class UserService {
  // Get all chats for a user
  async getUserChats(userId) {
    try {
      const userChats = await UserChats.find({ userId });
      
      if (!userChats || userChats.length === 0) {
        return [];
      }

      return userChats[0].chats || [];
    } catch (error) {
      console.error("Error fetching user chats:", error);
      throw new Error("Error fetching user chats");
    }
  }

  // Additional user-related methods can be added here
  // For example: createUser, updateUserProfile, deleteUser, etc.
}

// Export singleton instance
const userService = new UserService();
export default userService;