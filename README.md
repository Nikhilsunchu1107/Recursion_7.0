# SpyGlass Deployment Guide

This project is configured to run frontend and backend as separate services.

## Target Stack

- Frontend: Vercel
- Backend: Render (Docker)
- Cache: Upstash Redis (free tier)

## Backend (Render)

### 1) Create the Render Web Service

- Connect this repository.
- Service root directory: `backend`
- Environment: `Docker`
- Container port: `8000`
- Health check path: `/health`

Render builds from `backend/Dockerfile` and starts FastAPI with:

`uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}`

### 2) Set backend environment variables on Render

Required:

- `YOUTUBE_API_KEY`
- `LLM_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `REDIS_URL` (from Upstash)
- `FRONTEND_URL` (your Vercel production domain)

Optional:

- `FRONTEND_URLS` (comma-separated allowlist for additional domains)
- `FRONTEND_ORIGIN_REGEX` (for preview domains, e.g. Vercel previews)
- `LLM_HTTP_REFERER` (public backend URL)

## Redis (Upstash)

1. Create a free Redis database in Upstash.
2. Copy the Redis URL.
3. Set that value as `REDIS_URL` in Render.

If Redis is unavailable, the app falls back to file cache, but this is not reliable for production multi-instance behavior.

## Frontend (Vercel)

### 1) Create the Vercel project

- Root directory: `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### 2) Set frontend environment variables on Vercel

- `VITE_API_URL=https://<your-render-backend>.onrender.com`
- `VITE_SUPABASE_URL=<your-supabase-url>`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-publishable-key>`

Set these in both Preview and Production environments.

## Local containerized test

From repository root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`
- Backend docs: `http://localhost:8000/docs`
- Backend health: `http://localhost:8000/health`

The local `docker-compose.yml` is for integration testing only; production deploy uses Vercel + Render separately.

## CORS notes

Backend CORS is configured through:

- `FRONTEND_URL`
- `FRONTEND_URLS`
- `FRONTEND_ORIGIN_REGEX`

Use explicit domains in production and avoid wildcard CORS.
