# Beacon AI

![Beacon AI Logo](client/public/MoonAinBLs.png)

Beacon AI is a therapist chatbot application that uses artificial intelligence to help users with their mental health. The application provides an intuitive interface for users to chat with an AI therapist, manage their conversation history, and upload images for analysis.

## 🌟 Features

- **AI Therapy Chat**: Engage in meaningful conversations with an AI therapist powered by SambaNova's LLM
- **User Authentication**: Secure user management with Clerk authentication
- **Image Upload**: Share images during conversations with ImageKit integration
- **Persistent Chat History**: Access and continue previous therapy sessions
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Markdown Support**: Rich text formatting in chat messages

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development and building
- **React Router 6** for navigation
- **TanStack Query** for data fetching and caching
- **React Markdown** for rendering markdown content
- **Clerk** for user authentication
- **ImageKit** for image uploads and management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose for data storage
- **OpenAI API** compatible interface (configurable for SambaNova)
- **Clerk SDK** for authentication management
- **CORS** for secure cross-origin requests

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB instance (local or cloud)
- Clerk account for authentication
- ImageKit account for image management
- SambaNova API key or OpenAI API key

## 🛠️ Installation

### Environment Setup

This project uses environment variables for configuration. To set up your local environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/beacon-ai.git
   cd beacon-ai
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your actual API keys and secrets
   ```

3. Set up the frontend:
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your actual API keys and frontend configuration
   ```

**Important:** Never commit `.env` files to the repository. They contain sensitive information.
For more information on security practices in this project, please refer to [SECURITY.md](./SECURITY.md).

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at http://localhost:5173 (or the port shown in your terminal)

### Production Build

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. The compiled frontend will be in the `client/dist` directory, which can be deployed to a static hosting service.

3. Deploy the backend separately to a Node.js hosting service.

## 📝 API Endpoints

- `POST /api/chats` - Create a new chat session
- `GET /api/chats/:id` - Get a specific chat session
- `PUT /api/chats/:id` - Update a chat session with new messages
- `DELETE /api/chats/:id` - Delete a chat session
- `GET /api/chats` - Get all chat sessions for a user
- `GET /api/upload` - Get authentication parameters for ImageKit uploads

## 🔒 Security

This application implements several security best practices:

- Environment variables for sensitive information
- Authentication with Clerk
- CORS configuration to restrict origins
- Proper error handling and input validation
- **Helmet** for security headers (XSS, clickjacking, MIME sniffing protection)
- **Rate limiting** (100 requests per 15 minutes per IP) to prevent abuse
- **Request size limits** (1MB) to prevent memory exhaustion attacks

For more details on security practices and requirements, see the [SECURITY.md](./SECURITY.md) file.

## 📱 Project Structure

```
beacon-ai/
├── backend/                  # Node.js Express server
│   ├── index.js              # Main server file
│   ├── lib/                  # Library functions
│   │   └── openai.js         # OpenAI integration
│   ├── models/               # MongoDB models
│   │   ├── chat.js           # Chat data model
│   │   └── userChats.js      # User chat collection model
│   └── therapistPrompt.js    # AI therapist system prompt
│
└── client/                   # React frontend
    ├── public/               # Static assets
    └── src/
        ├── components/       # Reusable React components
        │   ├── chatList/     # Chat history list
        │   ├── newPrompt/    # New message input
        │   └── upload/       # Image upload component
        ├── layouts/          # Page layouts
        │   ├── dashboardLayout/
        │   └── rootLayout/
        ├── lib/              # Frontend utilities
        │   └── openai.js     # API call helpers
        └── routes/           # Application pages
            ├── chatPage/     # Chat interface
            ├── dashboardPage/# User dashboard
            ├── homepage/     # Landing page
            ├── signInPage/   # Login page
            └── signUpPage/   # Registration page
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct, development process, and how to submit pull requests.

### Quick Links for Contributors

- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Missing Features Analysis](MISSING_FEATURES_ANALYSIS.md) - Feature roadmap and gaps
- [Changelog](CHANGELOG.md) - Version history
- [Code of Conduct](CONTRIBUTING.md#code-of-conduct) - Community guidelines

## 📦 Deployment

Ready to deploy to production? Check out our comprehensive [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions.

## 📞 Support

If you encounter any issues or have questions:

- **Bug Reports**: Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests**: Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Questions**: Open a [Discussion](https://github.com/zordhalo/beacon-ai/discussions) or issue

## 📚 Additional Documentation

- [Backend Architecture](backend/ARCHITECTURE.md) - Technical details of the backend
- [Security Guidelines](SECURITY.md) - Security best practices
- [Client Documentation](client/README.md) - Frontend-specific information
- [GPT-5 Integration](GPT5-README.md) - GPT-5 feature documentation
