import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

// Update CORS middleware to allow all origins
app.use(cors());

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
