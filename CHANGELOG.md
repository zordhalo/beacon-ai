# Changelog

All notable changes to Beacon AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive missing features analysis document
- CONTRIBUTING.md with detailed contribution guidelines
- CHANGELOG.md for version tracking

## [1.1.0] - 2024-11-08

### Added
- GPT-5 (Preview) support for enhanced AI responses
- Settings panel with model selection toggle
- Support for both Meta-Llama-3.1-70B-Instruct and GPT-5 models
- LocalStorage persistence for user preferences
- Enhanced error handling for different AI response formats

### Changed
- Backend API now supports multiple model types via unified endpoint
- AI service updated to handle both completion and chat completion APIs
- Response format handling improved for different models

### Fixed
- Duplicate DELETE route in backend/index.js
- ImageKit upload authenticator now uses environment variables
- CSS typo in dashboardPage.css
- CORS configuration improved

## [1.0.0] - 2024-11-01

### Added
- Initial release of Beacon AI therapy chatbot
- User authentication with Clerk
- AI-powered therapy chat using SambaNova's Meta-Llama model
- Image upload and sharing with ImageKit integration
- Persistent chat history storage with MongoDB
- Responsive UI for desktop and mobile devices
- Markdown support in chat messages
- Real-time chat interface
- User dashboard with chat list
- Chat management (create, read, update, delete)

### Backend Features
- Express.js REST API
- MongoDB integration with Mongoose
- Modular service architecture:
  - Database service for MongoDB connection management
  - Authentication service with Clerk integration
  - AI service for OpenAI-compatible API calls
  - Image service for ImageKit integration
  - Chat service for chat operations
  - User service for user-related operations
- Security middleware:
  - Helmet for security headers
  - Rate limiting (100 requests per 15 minutes)
  - Request size limits (1MB)
  - CORS configuration
- Organized route structure for chats and uploads

### Frontend Features
- React 18 with Vite for fast development
- React Router 6 for client-side routing
- TanStack Query for data fetching and caching
- React Markdown for rendering formatted messages
- Clerk authentication integration
- ImageKit React component for uploads
- Responsive layouts:
  - Root layout for public pages
  - Dashboard layout for authenticated users
- Pages:
  - Landing page
  - Sign in/Sign up pages
  - Dashboard page
  - Chat page with real-time messaging

### Documentation
- Comprehensive README.md with setup instructions
- Backend ARCHITECTURE.md explaining service structure
- SECURITY.md with security guidelines and best practices
- Client-specific README.md
- Environment variable templates (.env.example)
- GPT5-README.md for GPT-5 feature documentation

### Testing
- Basic integration tests for backend services
- Security middleware verification tests
- Service loading and initialization tests

### Security
- Environment variable management
- Secrets excluded from version control
- XSS protection via Helmet
- Clickjacking protection
- MIME sniffing prevention
- Rate limiting to prevent abuse
- Request size limits to prevent memory exhaustion

## Version History Legend

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

## Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Links

- [Repository](https://github.com/zordhalo/beacon-ai)
- [Issue Tracker](https://github.com/zordhalo/beacon-ai/issues)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

## Contributors

Thank you to all contributors who have helped improve Beacon AI!

---

*For upcoming features and planned improvements, see [MISSING_FEATURES_ANALYSIS.md](MISSING_FEATURES_ANALYSIS.md)*
