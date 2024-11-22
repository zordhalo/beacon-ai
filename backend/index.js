import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { OpenAI } from "openai";  // Add this import

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
    await mongoose.connect(process.env.MONGO);  // MONGO CONNECTION
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }};

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

/*
// Clerk Test Route
app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => 
  {
    const userId = req.auth.userId;
  res.send("Hello World");
  console.log(userId);
});*/

// ROUTES FOR CHATS INCLUDING AUTHENTICATION
const openai = new OpenAI({
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: process.env.SAMBANOVA_API_URL
});

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
      // Add timeout handling
      timeout: 30000
    });

    res.json({ answer: completion.choices[0].text });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, history } = req.body;
    const userId = req.auth.userId;

    // Validate required fields
    if (!title || !history || !history.length) {
      return res.status(400).json({ error: "Missing required chat data" });
    }

    // Create new chat
    const chat = new Chat({
      userId,
      title,
      history
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
    res.status(500).json({ error: "Failed to create chat" });
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

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
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

{/* CLERK ERROR HANDLING*/}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthorized");
});

// ROUTES FOR CHAT HISTORY
app.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
