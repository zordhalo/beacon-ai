
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { OpenAI } from "openai";
import { therapistPrompt, USER_HEADER, ASSISTANT_HEADER } from './therapistPrompt.js'; // Updated path if necessary

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true, // allows session cookies to be sent back and forth
  })
);

// MIDDLEWARE FOR AUTHENTICATION
app.use(express.json());

// DATABASE CONNECTION
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10, // Added pool size for connection pooling
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

// ROUTES FOR IMAGE UPLOAD
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
// GET AUTHENTICATION PARAMETERS FOR IMAGE UPLOAD
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: process.env.SAMBANOVA_API_URL,
  timeout: 20000, // Set default timeout
  maxRetries: 2, // Set max retries
});

// ROUTES FOR CHATS INCLUDING AUTHENTICATION
app.post("/api/chat", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.completions.create({
      model: "Meta-Llama-3.1-70B-Instruct",
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.7,
      timeout: 30000
    });

    console.log("OpenAI Completion Response:", JSON.stringify(completion, null, 2)); // Enhanced logging

    if (
      !completion ||
      !completion.choices ||
      !Array.isArray(completion.choices) ||
      completion.choices.length === 0 ||
      !completion.choices[0].text
    ) {
      console.error("Invalid completion format:", completion);
      return res.status(500).json({ error: "Invalid AI response format." });
    }

    res.json({ answer: completion.choices[0].text });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(503).json({ 
      error: 'Service Unavailable',
      message: 'Meta-Llama-3.1-70B-Instruct is temporarily unavailable. Please try again later!'
    });
  }
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, history } = req.body;
    const userId = req.auth.userId;

    // Validate and format each history entry
    const formattedHistory = history.map(entry => ({
      role: entry.role,
      parts: entry.parts
    }));

    const chat = new Chat({
      userId,
      title,
      history: formattedHistory, // Use the formatted history
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

    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat", details: error.message });
  }
});

{/* GET CHAT HISTORY*/}
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChats.find({ userId});

  res.status(200).send(userChats[0].chats);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user chats");
  }
});

{/* GET SINGLE CHAT HISTORY*/ }
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is required" });
  }

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Error fetching chat" });
  }
});

{/* ADD CONVERSATION TO CHAT HISTORY*/}
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer } = req.body;

  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        $push: {
          history: [
            { role: 'user', parts: [{ text: question }] },
            { role: 'model', parts: [{ text: answer }] }
          ]
        }
      },
      { new: true }
    );

    res.status(200).send(updatedChat);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating chat!");
  }
});

// DELETE A CHAT
app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    // Delete the chat from the Chat collection
    await Chat.deleteOne({ _id: chatId, userId });

    // Remove the chat from the UserChats collection
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).send({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting chat");
  }
});

// CLERK ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthorized");
});

// ROUTES FOR CHAT HISTORY
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});