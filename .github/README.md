# Beacon AI

## Created By

Beacon AI was developed by Ahmad Jowshan and Lucas.

## Key Features

- AI-powered mental wellness support
- Personalized therapy-style conversations
- User-friendly and responsive interface
- Secure and scalable application structure

---
# GitHub Configuration

This directory contains GitHub-specific configuration files for the Beacon AI repository.

## Contents

### Issue Templates

Located in `ISSUE_TEMPLATE/`:

- **bug_report.md** - Template for reporting bugs
- **feature_request.md** - Template for suggesting new features
- **documentation.md** - Template for documentation improvements

### Pull Request Template

- **PULL_REQUEST_TEMPLATE.md** - Template for all pull requests

### Workflows

Located in `workflows/`:

- **ci-cd.yml** - Continuous Integration and Deployment pipeline
  - Runs tests on every push and PR
  - Performs security audits
  - Builds frontend
  - Can be extended for automated deployments

### Code Owners

- **CODEOWNERS** - Defines code ownership for automatic review requests

## Using These Templates

When you create a new issue or pull request on GitHub, these templates will automatically be populated. Simply fill in the relevant sections.

### For Issues

1. Go to Issues → New Issue
2. Select the appropriate template
3. Fill in the details
4. Submit

### For Pull Requests

1. Create your branch and make changes
2. Push to GitHub
3. Open a Pull Request
4. The template will auto-populate
5. Fill in all sections
6. Request reviews

## Configuring CI/CD

The CI/CD workflow requires the following secrets to be configured in your repository settings:

### Required Secrets

Go to Settings → Secrets and variables → Actions → New repository secret

**Backend:**
- `TEST_MONGO_URI` - MongoDB connection string for testing
- `CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `SAMBANOVA_API_URL` - SambaNova API URL
- `SAMBANOVA_API_KEY` - SambaNova API key
- `IMAGEKIT_ENDPOINT` - ImageKit endpoint
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key

**Frontend:**
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key for Vite
- `VITE_IMAGE_KIT_ENDPOINT` - ImageKit endpoint for Vite
- `VITE_IMAGE_KIT_PUBLIC_KEY` - ImageKit public key for Vite

## Customization

Feel free to customize these templates to match your project's specific needs:

1. Edit the markdown files directly
2. Add new issue templates as needed
3. Modify the CI/CD workflow for your deployment strategy
4. Update CODEOWNERS as your team grows

## Resources

- [GitHub Issue Templates Documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
