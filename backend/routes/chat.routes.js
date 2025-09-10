import express from "express";
import authService from "../services/auth.service.js";
import aiService from "../services/ai.service.js";
import chatService from "../services/chat.service.js";
import userService from "../services/user.service.js";

const router = express.Router();

// Generate AI response
router.post("/chat", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const result = await aiService.generateCompletion(prompt, model);
    res.json(result);
  } catch (error) {
    res.status(503).json({ 
      error: 'Service Unavailable',
      message: error.message
    });
  }
});

// Create a new chat
router.post("/chats", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const { title, history } = req.body;
    const userId = authService.getUserId(req);
    
    const savedChat = await chatService.createChat(userId, title, history);
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to create chat", 
      details: error.message 
    });
  }
});

// Get all user chats
router.get("/userchats", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const userId = authService.getUserId(req);
    const chats = await userService.getUserChats(userId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific chat
router.get("/chats/:id", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const userId = authService.getUserId(req);
    const chatId = req.params.id;
    
    const chat = await chatService.getChatById(chatId, userId);
    res.status(200).json(chat);
  } catch (error) {
    if (error.message === "Chat not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message === "Chat ID is required") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error fetching chat" });
    }
  }
});

// Update chat with new conversation
router.put("/chats/:id", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const userId = authService.getUserId(req);
    const { question, answer, img } = req.body;
    const chatId = req.params.id;
    
    const updatedChat = await chatService.updateChatHistory(chatId, userId, question, answer, img);
    res.status(200).json(updatedChat);
  } catch (error) {
    if (error.message === "User message exceeds maximum length") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error updating chat!" });
    }
  }
});

// Delete a chat
router.delete("/chats/:id", authService.getAuthMiddleware(), async (req, res) => {
  try {
    const userId = authService.getUserId(req);
    const chatId = req.params.id;
    
    const result = await chatService.deleteChat(chatId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;