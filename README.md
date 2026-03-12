# Memois

Memois is an event photo sharing application built with React, Vite, Node.js, Express, MongoDB, Cloudinary, and `face-api.js`.

## Structure

- `client/`: React frontend
- `server/`: Express API and MongoDB models

## Environment Variables

Server variables are documented in [server/.env.sample](/Users/pjphukan/Documents/Own/projects/event-photo-sharing/server/.env.sample).

Client variables are documented in [client/.env.example](/Users/pjphukan/Documents/Own/projects/event-photo-sharing/client/.env.example).

## Local Development

1. Install dependencies in `client/` and `server/`.
2. Copy `server/.env.sample` to `server/.env` and fill in MongoDB, JWT, Cloudinary, and email settings.
3. Optionally create `client/.env` from `client/.env.example`.
4. Run `npm run dev` in `server/`.
5. Run `npm run dev` in `client/`.

The API health endpoint is available at `/api/health`.

## Deployment

Recommended split deployment:

- Frontend: Vercel using the `client/` directory
- Backend: Railway using the `server/` directory

Frontend deployment notes:

- Set `VITE_API_BASE_URL` to the public Railway API URL.
- Set `VITE_APP_URL` to the public frontend URL.
- `client/vercel.json` rewrites all routes to `index.html` for React Router.

Backend deployment notes:

- Use `npm start` in `server/`.
- Set `CLIENT_ORIGIN` to the deployed frontend origin.
- Ensure MongoDB, Cloudinary, JWT, and email environment variables are present.

## Review Notes

The codebase still uses a controller-heavy structure rather than a cleaner service/repository split. I did not reorganize that because it would be a major structural change and you asked to confirm before those.

[Database design](https://drawsql.app/teams/event-photo-sharing/diagrams/event-photo-sharing)
