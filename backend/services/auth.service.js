import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

class AuthService {
  constructor() {
    this.middleware = ClerkExpressRequireAuth();
  }

  // Get the Clerk authentication middleware
  getAuthMiddleware() {
    return this.middleware;
  }

  // Extract user ID from authenticated request
  getUserId(req) {
    return req.auth?.userId;
  }

  // Check if request is authenticated
  isAuthenticated(req) {
    return !!req.auth?.userId;
  }

  // Error handler for authentication errors
  errorHandler() {
    return (err, req, res, next) => {
      console.error("Authentication error:", err.stack);
      res.status(401).send("Unauthorized");
    };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;