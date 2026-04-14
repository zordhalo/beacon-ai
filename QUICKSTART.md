# Quick Start Guide - Beacon AI

Get Beacon AI up and running in under 10 minutes!

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 16+ installed ([download](https://nodejs.org/))
- [ ] npm 8+ (comes with Node.js)
- [ ] Git installed ([download](https://git-scm.com/))
- [ ] A code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Clone the Repository (30 seconds)

```bash
git clone https://github.com/zordhalo/beacon-ai.git
cd beacon-ai
```

### Step 2: Get API Keys (5 minutes)

You'll need free accounts for:

1. **Clerk** (Authentication) - [Sign up](https://clerk.com)
   - Create a new application
   - Copy the Publishable Key and Secret Key

2. **ImageKit** (Image uploads) - [Sign up](https://imagekit.io)
   - Copy Endpoint URL, Public Key, and Private Key

3. **MongoDB** (Database) - [Sign up](https://mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

4. **SambaNova** (AI) - Get API access
   - Copy API URL and Key

### Step 3: Setup Backend (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your API keys:

```env
MONGO=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
SAMBANOVA_API_URL=your_sambanova_api_url
SAMBANOVA_API_KEY=your_sambanova_api_key
IMAGEKIT_ENDPOINT=your_imagekit_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
CLIENT_URL=http://localhost:5173
PORT=3001
```

### Step 4: Setup Frontend (2 minutes)

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your-imagekit-id/
VITE_IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
```

### Step 5: Start the Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 6: Open in Browser

Navigate to: `http://localhost:5173`

🎉 **Congratulations!** Beacon AI is now running!

## First Steps

1. **Sign Up**: Create a new account
2. **Start a Chat**: Click "New Chat" or go to Dashboard
3. **Ask a Question**: Type a message to the AI therapist
4. **Upload an Image**: Click the attachment icon (optional)
5. **Try GPT-5**: Click the settings icon ⚙️ to enable GPT-5

## Common Issues

### Backend won't start

**Problem**: `EADDRINUSE` error
```bash
# Port 3001 is already in use
# Solution: Kill the process using port 3001
# On Mac/Linux:
lsof -ti:3001 | xargs kill -9
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Problem**: MongoDB connection failed
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct

### Frontend won't start

**Problem**: Cannot find module errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Clerk authentication not working
- Verify `VITE_CLERK_PUBLISHABLE_KEY` matches your Clerk dashboard
- Check Clerk dashboard for allowed origins (should include `http://localhost:5173`)

### Image upload not working

**Problem**: ImageKit upload fails
- Verify all three ImageKit credentials are correct
- Check that CORS is enabled in your ImageKit dashboard
- Ensure `http://localhost:5173` is in allowed origins

## Testing Your Setup

Run the test suite to verify everything is working:

```bash
cd backend
npm test
```

You should see all tests passing with green checkmarks.

## Next Steps

Now that you have Beacon AI running:

1. **Read the Documentation**
   - [Full README](README.md) - Complete project documentation
   - [Contributing Guide](CONTRIBUTING.md) - How to contribute
   - [Architecture](backend/ARCHITECTURE.md) - Technical details

2. **Explore the Features**
   - Create multiple chat sessions
   - Try uploading images
   - Switch between AI models (Meta-Llama and GPT-5)

3. **Make Changes**
   - Frontend changes auto-reload (Vite HMR)
   - Backend changes require restart (or use nodemon)

4. **Join the Community**
   - Star the repository ⭐
   - Report bugs or suggest features
   - Submit pull requests

## Development Tips

### Hot Reload

The frontend automatically reloads when you make changes. The backend uses `nodemon` and will restart on file changes.

### Debugging

**Backend:**
```bash
# Add console.logs or use Node debugger
node --inspect index.js
```

**Frontend:**
- Use Chrome DevTools (F12)
- React DevTools browser extension
- Check Console and Network tabs

### Database GUI

View your MongoDB data:
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Desktop app
- [MongoDB Atlas UI](https://cloud.mongodb.com) - Web interface

### API Testing

Test API endpoints:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension
- curl commands

Example:
```bash
curl http://localhost:3001/health
```

## Need Help?

- **Documentation**: Check [README.md](README.md)
- **Issues**: Search [existing issues](https://github.com/zordhalo/beacon-ai/issues)
- **New Issue**: [Create an issue](https://github.com/zordhalo/beacon-ai/issues/new)
- **Discussions**: Join [GitHub Discussions](https://github.com/zordhalo/beacon-ai/discussions)

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO` | ✅ | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `SAMBANOVA_API_URL` | ✅ | SambaNova API endpoint |
| `SAMBANOVA_API_KEY` | ✅ | SambaNova API key |
| `IMAGEKIT_ENDPOINT` | ✅ | ImageKit endpoint URL |
| `IMAGEKIT_PUBLIC_KEY` | ✅ | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ✅ | ImageKit private key |
| `CLIENT_URL` | ✅ | Frontend URL (for CORS) |
| `PORT` | ✅ | Backend port (default: 3001) |

### Frontend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key |
| `VITE_IMAGE_KIT_ENDPOINT` | ✅ | ImageKit endpoint |
| `VITE_IMAGE_KIT_PUBLIC_KEY` | ✅ | ImageKit public key |

---

Happy coding! 🚀

If you find this project useful, please consider giving it a star ⭐ on GitHub!
