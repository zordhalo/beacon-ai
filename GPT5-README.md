# Beacon AI - GPT-5 Integration

## New Feature: GPT-5 Support

Beacon AI now supports GPT-5 (Preview) for all clients. This feature allows users to switch between Meta-Llama-3.1-70B-Instruct and GPT-5 for their chat interactions.

### How to Use

1. Click the settings gear (⚙️) icon in the sidebar to access the settings panel
2. Toggle the "Enable GPT-5 (Preview)" switch to enable GPT-5
3. Return to your chats by clicking the settings gear again

### Technical Details

- The client stores the GPT-5 preference in localStorage
- The backend supports both model types via a unified API endpoint
- Response formats are automatically handled differently based on the model
- Default is still Meta-Llama-3.1-70B-Instruct if no preference is set

### Implementation Changes

- Added Settings component with toggle functionality
- Updated backend API to handle both model types
- Enhanced error handling for different response formats
- Added model information to API responses

## Recent Critical Fixes

- Fixed duplicate DELETE route in backend/index.js
- Updated ImageKit upload authenticator to use environment variables
- Added support for image attachments in chat history
- Fixed CSS typo in dashboardPage.css
- Improved CORS configuration

## Next Steps

- Add model selection on a per-chat basis
- Implement caching for API responses
- Add server-side prompt composition
