import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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

// SECURITY MIDDLEWARE
// Apply helmet for security headers
app.use(helmet());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MIDDLEWARES
app.use(cors(corsConfig));
app.use(express.json({ limit: '1mb' }));

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
