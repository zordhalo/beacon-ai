# Beacon AI — TODO

This is the up-to-date task list for Beacon AI. Tasks are grouped by area and reference files/symbols to help navigation.

## Critical fixes (P0)

- [ ] Remove duplicate and broken DELETE route in [backend/index.js](backend/index.js). There are two `app.delete("/api/chats/:id", ...)` blocks; the first one logs `err` (undefined) and should be deleted.
- [ ] Align ImageKit upload authenticator to use environment config in [`Upload`](client/src/components/upload/Upload.jsx) instead of hard-coded `http://localhost:3000`:
  - Replace with `${import.meta.env.VITE_API_URL}/api/upload` in [client/src/components/upload/Upload.jsx](client/src/components/upload/Upload.jsx).
- [ ] Support image attachments in chat history end-to-end:
  - Extend message schema to store optional `img` on history items in [backend/models/chat.js](backend/models/chat.js).
  - Update PUT handler in [backend/index.js](backend/index.js) to optionally include `img` on the user’s message when present.
  - Ensure renderer uses `item.img` (already handled in [client/src/routes/chatPage/ChatPage.jsx](client/src/routes/chatPage/ChatPage.jsx)).
- [ ] Fix typo in dashboard form CSS: `justify-content: spaceg-between` → `space-between` in [client/src/routes/dashboardPage/dashboardPage.css](client/src/routes/dashboardPage/dashboardPage.css).

## Frontend (P1)

- [ ] Remove unused import of [`NewPrompt`](client/src/components/newPrompt/NewPrompt.jsx) in [client/src/routes/chatPage/ChatPage.jsx](client/src/routes/chatPage/ChatPage.jsx).
- [ ] Consolidate duplicate `.message.model` CSS (conflicting background colors) in [client/src/routes/chatPage/chatPage.css](client/src/routes/chatPage/chatPage.css).
- [ ] Decide on CSS nesting approach:
  - Option A: Convert nested `.css` files to `.scss` and enable Sass.
  - Option B: Add PostCSS nesting plugin.
  Files with nesting include [client/src/routes/homepage/homepage.css](client/src/routes/homepage/homepage.css), [client/src/routes/dashboardPage/dashboardPage.css](client/src/routes/dashboardPage/dashboardPage.css), etc.
- [ ] Implement caching in [`makeAPICall`](client/src/lib/openai.js) (the `CACHE_DURATION` constant is unused). Cache recent prompt→response pairs (e.g., in memory or sessionStorage).
- [ ] Replace hard-coded prompt string in [`makeAPICall`](client/src/lib/openai.js) with server-side composition using [backend/therapistPrompt.js](backend/therapistPrompt.js). Send only the user message; the server should prepend the system prompt.
- [ ] Remove or integrate the legacy [`NewPrompt`](client/src/components/newPrompt/NewPrompt.jsx) flow. Currently, [client/src/routes/chatPage/ChatPage.jsx](client/src/routes/chatPage/ChatPage.jsx) manages its own form.
- [ ] Consider removing the unused `/chat` route (without `:id`) in [client/src/main.jsx](client/src/main.jsx); `ChatPage` redirects to `/dashboard` if `id` is missing.

## Backend (P1)

- [ ] CORS cleanup: remove duplicate `credentials` key and explicitly set allowed methods/headers in [backend/index.js](backend/index.js).
- [ ] Add request size limits and security middleware:
  - `express.json({ limit: '1mb' })`
  - Helmet, basic rate-limiting (IP-based) in [backend/index.js](backend/index.js).
- [ ] De-duplicate/retire the extra server file [backend/lib/openai.js](backend/lib/openai.js) (it replicates server setup and likely isn’t used).
- [ ] Make the GET all chats route consistent with docs:
  - Either implement `GET /api/chats` (for current user) in [backend/index.js](backend/index.js), or update docs to point to `GET /api/userchats`.
- [ ] Add better error payloads (consistent JSON shape) and logging context (request id, user id where applicable).

## Documentation (P1)

- [ ] Update or replace the placeholder client README at [client/README.md](client/README.md).
- [ ] Add `.env.example` to client with:
  - `VITE_API_URL`
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_IMAGE_KIT_ENDPOINT`
  - `VITE_IMAGE_KIT_PUBLIC_KEY`
- [ ] Fix API docs in [README.md](README.md): `GET /api/chats` is not implemented; either add it or change to `GET /api/userchats`.

## Developer Experience (P2)

- [ ] Add lint/format scripts and CI checks:
  - ESLint (already configured at [client/.eslintrc.cjs](client/.eslintrc.cjs))
  - Prettier
- [ ] Add minimal tests for API endpoints and key UI flows.
- [ ] Improve local dev parity:
  - Ensure ports are consistent across README, env, and code (ImageKit, API). Backend default is 3001; ensure the frontend references `VITE_API_URL` everywhere.

## UX/Accessibility (P2)

- [ ] Add ARIA labels to buttons/icons (e.g., upload and send) across forms.
- [ ] Improve empty/error states in:
  - [`ChatList`](client/src/components/chatList/ChatList.jsx)
  - [`ChatPage`](client/src/routes/chatPage/ChatPage.jsx)
  - [`DashboardPage`](client/src/routes/dashboardPage/DashboardPage.jsx)
- [ ] Keyboard accessibility: focus states, submit on Enter, disable repeated submit on pending requests (partially handled).

## Performance (P3)

- [ ] Debounce text submissions; avoid duplicate requests.
- [ ] Prefetch user chats on dashboard load using TanStack Query.
- [ ] Lazy-load large images and consider thumbnails via ImageKit transformations.

## Nice to have (P3)

- [ ] Add message streaming support for AI responses.
- [ ] Add chat title autogeneration based on first user message and AI response.
- [ ] Add pagination/virtualization for long chat histories.
