import mongoose from "mongoose";

class DatabaseService {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log("Already connected to MongoDB");
        return;
      }

      await mongoose.connect(process.env.MONGO, {
        maxPoolSize: 10,
      });
      
      this.isConnected = true;
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }

  async disconnect() {
    try {
      if (!this.isConnected) {
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from MongoDB");
    } catch (err) {
      console.error("MongoDB disconnection error:", err);
      throw err;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export default databaseService;