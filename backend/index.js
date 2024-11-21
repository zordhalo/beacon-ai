import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB");
    } catch (err) 
    {
     console.log(err);
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

app.get("/api/upload", ClerkExpressRequireAuth({ }),
  async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});


app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
    const userId = req.auth.userId;
    console.log(`${userId}`);
    res.send(`${userId}`);
});
    
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
        // CREATE A NEW CHAT
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        });
        const savedChat = await newChat.save();

        // CHECK IF USER CHAT EXISTS
        const userChats = await UserChats.findOne({ userId: userId });

        if (!userChats) {
            // CREATE A NEW USER CHAT
            const newUserChat = new UserChats({
                userId: userId,
                chats: [
                    {
                        chatId: savedChat._id,
                        chatTitle: text.substring(0, 40),
                    }
                ]
            });
            await newUserChat.save();
        } else {
            // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
            await UserChats.updateOne(
                { userId: userId },
                {
                    $push: {
                        chats: {
                            chatId: savedChat._id,
                            chatTitle: text.substring(0, 40),
                        }
                    }
                }
            );
        }

        // SEND RESPONSE BACK TO CLIENT
        res.status(200).json(savedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat!");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
})

app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});
