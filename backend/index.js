import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";

// Import services
import databaseService from "./services/database.service.js";
import authService from "./services/auth.service.js";

// Import configuration
import { corsConfig } from "./config/cors.config.js";

// Import routes
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARES
app.use(cors(corsConfig));
app.use(express.json());

// ROUTES
app.use("/api", chatRoutes);
app.use("/api", uploadRoutes);

// ERROR HANDLING
app.use(authService.errorHandler());

// START SERVER
app.listen(PORT, async () => {
  await databaseService.connect();
  console.log(`Server is running on port ${PORT}`);
});
