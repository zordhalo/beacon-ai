# Backend Architecture

This document explains the refactored backend architecture that splits the monolithic code into organized, maintainable services.

## Directory Structure

```
backend/
├── config/                 # Configuration files
│   └── cors.config.js     # CORS configuration
├── models/                 # MongoDB data models
│   ├── chat.js            # Chat schema
│   └── userChats.js       # User chats schema
├── routes/                 # Route handlers
│   ├── chat.routes.js     # Chat-related routes
│   └── upload.routes.js   # Image upload routes
├── services/               # Business logic services
│   ├── ai.service.js      # AI/OpenAI integration
│   ├── auth.service.js    # Authentication (Clerk)
│   ├── chat.service.js    # Chat operations
│   ├── database.service.js # MongoDB connection
│   ├── image.service.js   # ImageKit integration
│   └── user.service.js    # User operations
├── test/                   # Tests
│   └── integration.test.js # Service integration tests
├── index.js               # Main server setup
├── package.json           # Dependencies
└── therapistPrompt.js     # AI prompt configuration
```

## Services Overview

### Database Service (`services/database.service.js`)
- Manages MongoDB connections
- Provides connection status monitoring
- Handles graceful connection/disconnection

### Authentication Service (`services/auth.service.js`)
- Wraps Clerk authentication middleware
- Provides user ID extraction utilities
- Handles authentication error responses

### AI Service (`services/ai.service.js`)
- Manages OpenAI/SambaNova API integration
- Supports both GPT-5 and Meta-Llama models
- Handles completion generation with error handling

### Image Service (`services/image.service.js`)
- Manages ImageKit integration for file uploads
- Provides authentication parameters for frontend
- Lazy-loads ImageKit client for efficiency

### Chat Service (`services/chat.service.js`)
- Handles all chat CRUD operations
- Manages message length validation
- Coordinates between Chat and UserChats collections

### User Service (`services/user.service.js`)
- Manages user-related operations
- Handles user chat history retrieval

## Routes

### Chat Routes (`routes/chat.routes.js`)
- `POST /api/chat` - Generate AI responses
- `POST /api/chats` - Create new chat sessions
- `GET /api/userchats` - Get user's chat list
- `GET /api/chats/:id` - Get specific chat
- `PUT /api/chats/:id` - Update chat with new messages
- `DELETE /api/chats/:id` - Delete chat

### Upload Routes (`routes/upload.routes.js`)
- `GET /api/upload` - Get ImageKit authentication parameters

## Key Benefits

1. **Separation of Concerns**: Each service has a single responsibility
2. **Maintainability**: Code is easier to understand and modify
3. **Testability**: Services can be tested independently
4. **Scalability**: Services can be extracted to microservices if needed
5. **Error Handling**: Centralized error handling per service
6. **Configuration**: Environment-specific settings are isolated

## Environment Variables

The following environment variables are required:

```env
# Database
MONGO=your_mongodb_connection_string

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Service
SAMBANOVA_API_URL=your_sambanova_api_url
SAMBANOVA_API_KEY=your_sambanova_api_key

# Image Service
IMAGEKIT_ENDPOINT=your_imagekit_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Server
CLIENT_URL=http://localhost:5173
PORT=3001
```

## Running Tests

To verify the service integration:

```bash
node test/integration.test.js
```

## Migration Notes

This refactoring maintains 100% backward compatibility with the existing API. All endpoints continue to work exactly as before, but the code is now much better organized and maintainable.

The main changes:
- Removed duplicate code in `lib/openai.js`
- Extracted services with single responsibilities
- Organized routes by functionality
- Improved error handling and logging
- Added lazy loading for external service clients