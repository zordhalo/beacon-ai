# Beacon AI - Frontend Client

The React frontend application for Beacon AI, a therapist chatbot that uses artificial intelligence to help users with their mental health. This client provides an intuitive interface for users to chat with an AI therapist, manage conversation history, and upload images for analysis.

## 🌟 Features

- **Interactive Chat Interface**: Engaging conversation UI with the AI therapist
- **User Authentication**: Secure login/signup with Clerk
- **Image Upload Support**: Share images during therapy sessions using ImageKit
- **Chat History Management**: Access and continue previous therapy sessions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Markdown Support**: Rich text formatting in chat messages
- **Real-time Communication**: Seamless interaction with the backend API

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast development and building
- **React Router 6** - Client-side routing and navigation
- **TanStack Query** - Data fetching, caching, and state management
- **React Markdown** - Rendering markdown content in messages
- **Clerk** - User authentication and management
- **ImageKit** - Image uploads and optimization
- **Sass** - Enhanced CSS with variables and nesting

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Access to the Beacon AI backend server

## 🛠️ Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file with the required variables:**
   ```bash
   # API Configuration
   VITE_API_URL=http://localhost:3001

   # ImageKit Configuration
   VITE_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your-imagekit-id/
   VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key

   # Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deployment.

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── chatList/       # Chat history list component
│   │   ├── newPrompt/      # Message input component
│   │   └── upload/         # Image upload component
│   ├── layouts/            # Page layout components
│   │   ├── dashboardLayout/
│   │   └── rootLayout/
│   ├── lib/                # Utility functions
│   │   └── openai.js       # API call helpers
│   ├── routes/             # Application pages
│   │   ├── chatPage/       # Main chat interface
│   │   ├── dashboardPage/  # User dashboard
│   │   ├── homepage/       # Landing page
│   │   ├── signInPage/     # Login page
│   │   └── signUpPage/     # Registration page
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── .eslintrc.cjs           # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | Yes |
| `VITE_IMAGE_KIT_ENDPOINT` | ImageKit endpoint URL | Yes |
| `VITE_IMAGE_KIT_PUBLIC_KEY` | ImageKit public key | Yes |

## 🔗 Integration

This frontend client integrates with:

- **Backend API**: Node.js/Express server for chat management and AI processing
- **Clerk**: User authentication and session management
- **ImageKit**: Image upload and processing service
- **MongoDB**: Data persistence through backend API

## 📚 Development Notes

- The application uses modern React patterns with hooks and functional components
- State management is handled through TanStack Query for server state and React hooks for local state
- Authentication state is managed by Clerk's React SDK
- All API calls are made through the backend to ensure security and proper data handling

## 🔗 Related Documentation

- [Main Project README](../README.md) - Complete project overview and setup
- [Backend Documentation](../backend/) - API and server setup
- [Security Guidelines](../SECURITY.md) - Security practices and requirements

## 🆘 Troubleshooting

**Development server won't start:**
- Ensure all dependencies are installed: `npm install`
- Check that Node.js version is 16 or higher
- Verify environment variables are properly configured

**Authentication issues:**
- Confirm `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Check Clerk dashboard for proper configuration

**Image upload problems:**
- Verify ImageKit environment variables
- Ensure ImageKit account has proper permissions configured

For more help, refer to the main project documentation or open an issue in the repository.
