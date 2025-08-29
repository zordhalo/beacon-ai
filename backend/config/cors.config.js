// CORS configuration for the application
export const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true, // allows session cookies to be sent back and forth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};