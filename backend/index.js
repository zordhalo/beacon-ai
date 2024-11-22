import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";
import UserChats from "./models/UserChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';


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
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    // SAVE CHAT TO DATABASE
    const savedChat = await newChat.save();

    // CHECK if user chats exist
    const userChats = await UserChats.find({ userId: userId });

    if (!userChats.length) {
      // CREATE A NEW USER CHAT
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });
      // SAVE USER CHATS TO DATABASE
      await newUserChats.save();
    } else {
      // ADD NEW CHAT TO EXISTING CHATS
      await UserChats.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        },
        { new: true }
      );
    }

    res.status(200).send(newChat._id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving chat");
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

  try {
    const chat = await Chat.findOne({_id:req.params.id, userId});

  res.status(200).send(chat);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chat");
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
