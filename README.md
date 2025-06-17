# Beacon.ai Therapist Application Overview

## Environment Setup

This project uses environment variables for configuration. To set up your local environment:

1. Navigate to the backend directory
2. Copy `.env.example` to a new file named `.env`
3. Fill in your own API keys and secrets in the `.env` file

```bash
# Example
cp backend/.env.example backend/.env
# Then edit backend/.env with your actual secrets
```

**Important:** Never commit `.env` files to the repository. They contain sensitive information.

For more information on security practices in this project, please refer to [SECURITY.md](./SECURITY.md).
