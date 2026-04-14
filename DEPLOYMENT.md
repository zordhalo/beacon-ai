# Deployment Guide - Beacon AI

This guide provides step-by-step instructions for deploying Beacon AI to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Option 1: Vercel (Frontend) + Railway/Render (Backend)](#option-1-vercel-frontend--railwayrender-backend)
  - [Option 2: Docker Deployment](#option-2-docker-deployment)
  - [Option 3: Traditional VPS/Cloud Server](#option-3-traditional-vpscloud-server)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. ✅ All API keys and credentials:
   - Clerk account (Publishable Key and Secret Key)
   - ImageKit account (Endpoint, Public Key, Private Key)
   - SambaNova API key
   - MongoDB connection string (production database)

2. ✅ Domain name (optional but recommended)

3. ✅ SSL certificate (most platforms provide this automatically)

4. ✅ Tested application locally

5. ✅ All tests passing

## Environment Setup

### Production Environment Variables

You'll need separate environment variables for production. Never use development credentials in production!

#### Backend Environment Variables

```env
# Database
MONGO=mongodb+srv://username:password@cluster.mongodb.net/beacon-ai-prod?retryWrites=true&w=majority

# Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# AI Service
SAMBANOVA_API_URL=https://api.sambanova.ai/v1
SAMBANOVA_API_KEY=your_production_sambanova_api_key

# Image Service
IMAGEKIT_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
IMAGEKIT_PUBLIC_KEY=your_production_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_production_imagekit_private_key

# Server Configuration
CLIENT_URL=https://your-domain.com
PORT=3001
NODE_ENV=production
```

#### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=https://api.your-domain.com

# ImageKit Configuration
VITE_IMAGE_KIT_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
VITE_IMAGE_KIT_PUBLIC_KEY=your_production_imagekit_public_key

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

This is the recommended approach for easy deployment with minimal configuration.

#### Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Connect Repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Select the `beacon-ai` repository

3. **Configure Project**:
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all frontend environment variables
   - Make sure to add them for "Production" environment

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Note your deployment URL

#### Deploy Backend to Railway

1. **Sign up for Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `beacon-ai` repository

3. **Configure Service**:
   - Root Directory: `backend`
   - Build Command: (leave empty, Railway auto-detects)
   - Start Command: `npm start`

4. **Add Environment Variables**:
   - In Railway dashboard, go to Variables
   - Add all backend environment variables
   - Railway provides a free MongoDB addon, or use MongoDB Atlas

5. **Generate Domain**:
   - In Settings, generate a Railway domain or add your custom domain
   - Update `VITE_API_URL` in Vercel with this backend URL

6. **Deploy**:
   - Railway automatically deploys on push to main branch

#### Alternative: Deploy Backend to Render

1. **Sign up for Render**:
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Name: `beacon-ai-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   - In the dashboard, add all backend environment variables

4. **Deploy**:
   - Click "Create Web Service"
   - Note your service URL

### Option 2: Docker Deployment

#### Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
```

**Frontend Dockerfile** (`client/Dockerfile`):

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration (create this file)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** for frontend (`client/nginx.conf`):

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Docker Compose** (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGO=${MONGO}
      - CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - SAMBANOVA_API_URL=${SAMBANOVA_API_URL}
      - SAMBANOVA_API_KEY=${SAMBANOVA_API_KEY}
      - IMAGEKIT_ENDPOINT=${IMAGEKIT_ENDPOINT}
      - IMAGEKIT_PUBLIC_KEY=${IMAGEKIT_PUBLIC_KEY}
      - IMAGEKIT_PRIVATE_KEY=${IMAGEKIT_PRIVATE_KEY}
      - CLIENT_URL=${CLIENT_URL}
      - PORT=3001
    restart: unless-stopped
    networks:
      - beacon-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - beacon-network

networks:
  beacon-network:
    driver: bridge
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Traditional VPS/Cloud Server

For deploying to a VPS (DigitalOcean, AWS EC2, etc.):

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/zordhalo/beacon-ai.git
cd beacon-ai

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with production values
nano .env

# Setup frontend
cd ../client
npm install
cp .env.example .env
# Edit .env with production values
nano .env

# Build frontend
npm run build
```

#### 3. Configure PM2

Create `ecosystem.config.js` in the root:

```javascript
module.exports = {
  apps: [{
    name: 'beacon-ai-backend',
    cwd: './backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

Start application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/beacon-ai`:

```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/beacon-ai/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/beacon-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster or paid tier

2. **Configure Database**:
   - Create a new database: `beacon-ai-prod`
   - Create database user with strong password
   - Whitelist IP addresses (or allow from anywhere for cloud deployments)

3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add to your environment variables

4. **Security Best Practices**:
   - Use a strong password
   - Enable IP whitelisting when possible
   - Use separate databases for production, staging, and development
   - Enable MongoDB Atlas monitoring and alerts

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] User authentication works (sign up, sign in, sign out)
- [ ] Chat creation and messaging work
- [ ] Image upload functionality works
- [ ] Chat history persists correctly
- [ ] All API endpoints respond correctly
- [ ] Error handling works as expected
- [ ] SSL certificate is active and valid
- [ ] Environment variables are set correctly
- [ ] Database connection is stable
- [ ] Logs are accessible and meaningful

## Monitoring and Maintenance

### Health Checks

Add a health check endpoint to your backend (`backend/index.js`):

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: databaseService.getConnectionStatus() ? 'connected' : 'disconnected'
  });
});
```

### Logging

Consider adding structured logging:

```bash
npm install winston
```

Create `backend/logger.js`:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Monitoring Services

Consider integrating:

- **Error Tracking**: [Sentry](https://sentry.io)
- **Uptime Monitoring**: [UptimeRobot](https://uptimerobot.com)
- **Performance**: [New Relic](https://newrelic.com) or [Datadog](https://datadoghq.com)
- **Analytics**: [Google Analytics](https://analytics.google.com)

### Backup Strategy

1. **Database Backups**:
   - Enable automated backups in MongoDB Atlas
   - Schedule: Daily backups with 7-day retention
   - Test restore procedure quarterly

2. **Code Backups**:
   - Repository is backed up on GitHub
   - Tag releases: `git tag v1.0.0`
   - Keep deployment scripts in version control

### Update Procedure

1. **Test Updates Locally**:
   ```bash
   git pull origin main
   npm install
   npm test
   ```

2. **Deploy to Staging** (if available):
   - Test all functionality
   - Verify database migrations

3. **Deploy to Production**:
   ```bash
   # For PM2
   pm2 stop beacon-ai-backend
   git pull origin main
   cd backend && npm install
   cd ../client && npm install && npm run build
   pm2 restart beacon-ai-backend
   ```

4. **Verify Deployment**:
   - Check health endpoint
   - Test critical user flows
   - Monitor error logs

## Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check logs
pm2 logs beacon-ai-backend

# Common causes:
# - Missing environment variables
# - Port already in use
# - Database connection failed
```

#### Database Connection Errors

```bash
# Verify MongoDB connection string
# Check IP whitelist in MongoDB Atlas
# Verify database user credentials
```

#### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Test SSL
sudo certbot certificates
```

#### High Memory Usage

```bash
# Check PM2 status
pm2 status

# Restart application
pm2 restart beacon-ai-backend

# Consider increasing server resources
```

### Performance Optimization

1. **Enable Gzip Compression** (Nginx):
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;
   ```

2. **Add Caching Headers**:
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Database Indexing**:
   - Add indexes to frequently queried fields
   - Monitor slow queries

### Getting Help

If you encounter issues:

1. Check application logs
2. Review GitHub Issues
3. Consult the [Troubleshooting Guide](README.md#troubleshooting) in the main README
4. Open a new issue with:
   - Environment details
   - Error messages
   - Steps to reproduce

---

## Security Checklist

Before going live:

- [ ] All environment variables use production values
- [ ] No development credentials in production
- [ ] SSL certificate is active
- [ ] Rate limiting is enabled
- [ ] CORS is configured correctly
- [ ] Helmet security headers are enabled
- [ ] Database uses strong password
- [ ] Database IP whitelist is configured
- [ ] Regular security updates scheduled
- [ ] Backup system is in place
- [ ] Monitoring and alerting configured

---

**Congratulations!** Your Beacon AI application is now deployed and ready to help users with their mental health needs. Remember to monitor your application regularly and keep it updated with security patches.

For questions or issues, please refer to [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub.
