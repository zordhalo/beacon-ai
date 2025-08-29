import express from "express";
import imageService from "../services/image.service.js";

const router = express.Router();

// Get authentication parameters for image upload
router.get("/upload", (req, res) => {
  try {
    const result = imageService.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to get upload authentication", 
      message: error.message 
    });
  }
});

export default router;