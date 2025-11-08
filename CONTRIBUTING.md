# Contributing to Beacon AI

Thank you for your interest in contributing to Beacon AI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Questions](#questions)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive to all contributors
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)
- Git

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/beacon-ai.git
   cd beacon-ai
   ```

3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/zordhalo/beacon-ai.git
   ```

4. **Set up the backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Set up the frontend**:
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Verify your setup**:
   ```bash
   # Test backend
   cd ../backend
   npm test
   
   # Start backend
   npm start
   
   # In a new terminal, start frontend
   cd ../client
   npm run dev
   ```

### Environment Variables

You'll need to obtain API keys for:
- **Clerk**: Sign up at [clerk.com](https://clerk.com)
- **ImageKit**: Sign up at [imagekit.io](https://imagekit.io)
- **SambaNova**: Get API access for AI models
- **MongoDB**: Set up a database at [mongodb.com/atlas](https://mongodb.com/atlas)

Refer to `.env.example` files in both `backend/` and `client/` directories for required variables.

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when available)
cd client
npm test
```

### 4. Commit Your Changes

Follow the commit message guidelines (see below).

### 5. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

Go to GitHub and create a pull request from your fork to the main repository.

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks in React
- Use meaningful variable and function names
- Keep functions small and focused
- Avoid deep nesting (max 3 levels)
- Use async/await for asynchronous operations

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Use double quotes for strings
- **Semicolons**: Use semicolons
- **Line length**: Maximum 100 characters
- **Comments**: Use JSDoc for functions, inline comments for complex logic

Example:

```javascript
/**
 * Creates a new chat session for a user
 * @param {string} userId - The ID of the user
 * @param {string} title - The chat title
 * @param {Array} history - Initial chat history
 * @returns {Promise<Object>} The created chat object
 */
async function createChat(userId, title, history = []) {
  // Validate input
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  // Create and save chat
  const chat = new Chat({ userId, title, history });
  return await chat.save();
}
```

### File Organization

#### Backend
```
backend/
├── config/         # Configuration files
├── models/         # Database models
├── routes/         # Route handlers
├── services/       # Business logic
└── test/          # Test files
```

#### Frontend
```
client/
├── src/
│   ├── components/  # Reusable components
│   ├── layouts/     # Page layouts
│   ├── routes/      # Page components
│   ├── lib/         # Utility functions
│   └── main.jsx     # Entry point
```

### Component Structure (React)

```javascript
import { useState, useEffect } from 'react';
import './ComponentName.css';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 */
const ComponentName = ({ title }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```bash
feat(chat): add chat search functionality

Implement search feature to filter chat history by keywords.
Includes debouncing for performance optimization.

Closes #42

---

fix(auth): resolve login redirect issue

Fix bug where users were not redirected to dashboard
after successful login.

Fixes #58

---

docs(readme): update installation instructions

Add detailed steps for setting up environment variables
and clarify prerequisites.
```

## Pull Request Process

### Before Submitting

1. ✅ Code follows the style guidelines
2. ✅ All tests pass
3. ✅ New tests added for new functionality
4. ✅ Documentation updated
5. ✅ Commit messages follow guidelines
6. ✅ Branch is up to date with main

### PR Title

Use the same format as commit messages:
```
feat(chat): add export chat functionality
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Related Issues
Closes #issue_number

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

### Review Process

1. At least one maintainer review required
2. All CI checks must pass
3. Address all review comments
4. Maintainer will merge when approved

## Testing Guidelines

### Writing Tests

#### Backend Tests
Location: `backend/test/`

```javascript
// Service test example
import chatService from '../services/chat.service.js';

describe('Chat Service', () => {
  test('should create a new chat', async () => {
    const chat = await chatService.createChat('user123', 'Test Chat');
    expect(chat).toHaveProperty('_id');
    expect(chat.title).toBe('Test Chat');
  });

  test('should throw error for invalid user ID', async () => {
    await expect(
      chatService.createChat('', 'Test Chat')
    ).rejects.toThrow();
  });
});
```

#### Frontend Tests
Location: `client/src/**/__tests__/`

```javascript
// Component test example (when framework is set up)
import { render, screen } from '@testing-library/react';
import ChatList from '../ChatList';

describe('ChatList Component', () => {
  test('renders chat list', () => {
    render(<ChatList chats={mockChats} />);
    expect(screen.getByText('My Chats')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend (when available)
cd client
npm test

# Run specific test file
npm test -- path/to/test.js
```

## Documentation

### Code Documentation

- Add JSDoc comments to all functions
- Document complex algorithms
- Explain "why" not "what" in comments
- Keep comments up to date

### README Updates

Update the README.md when adding:
- New features
- New dependencies
- New environment variables
- New setup steps

### API Documentation

When adding new API endpoints, document:
- Route path
- HTTP method
- Request parameters
- Request body schema
- Response format
- Error codes
- Example usage

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify the bug exists in the latest version
3. Collect relevant information

### Bug Report Template

When creating a bug report, include:

```markdown
**Describe the bug**
Clear and concise description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 94]
- Node version: [e.g., 16.14.0]

**Additional context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Mockups, examples, or other relevant information
```

### Feature Discussion

Before implementing a large feature:
1. Open an issue to discuss the feature
2. Wait for maintainer feedback
3. Agree on implementation approach
4. Create a detailed implementation plan

## Questions

If you have questions:

1. **Check existing documentation**
   - README.md
   - ARCHITECTURE.md
   - SECURITY.md
   - This CONTRIBUTING.md

2. **Search existing issues**
   - Someone may have asked the same question

3. **Ask in a new issue**
   - Label it as "question"
   - Provide context and what you've tried

4. **Join discussions**
   - Participate in pull request discussions
   - Help other contributors

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- The contributors page on GitHub

Thank you for contributing to Beacon AI! Your efforts help make mental health support more accessible through technology. 🌟
