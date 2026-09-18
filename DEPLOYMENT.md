# ImmoCheck DZ deployment guide

This project has a frontend (React + Vite) and a backend (Express + TypeScript + MongoDB).

## 1. MongoDB Atlas

1. Create a free cluster on MongoDB Atlas.
2. Create a database user.
3. Allow network access from `0.0.0.0/0`.
4. Copy the connection string.

Example:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/immocheck-dz
```

## 2. Backend deployment on Render

In Render, create a Web Service for the `server` folder.

Settings:

```text
Root Directory: server
Build Command: npm install && npm run build
Start Command: npm start
```

Add environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/immocheck-dz
JWT_SECRET=replace_with_a_strong_random_string
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

Health check URL:

```text
https://your-render-service.onrender.com/api/health
```

## 3. Frontend deployment on Vercel

In Vercel, create a project for the `client` folder.

Add environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

The frontend will call `VITE_API_URL` automatically via `client/src/lib/api.ts`.

## 4. Frontend local development

Create a `.env` in `client`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 5. Verify the app

Check these URLs:

- Backend health: `https://your-render-service.onrender.com/api/health`
- Login/Register endpoints on the backend
- Frontend pages and property creation flow

## 6. Notes

- `VITE_API_URL` must include `/api` at the end.
- The backend CORS list accepts multiple origins, separated by commas.
- For uploaded property images in production, prefer Cloudinary or S3 rather than Render local disk storage.
