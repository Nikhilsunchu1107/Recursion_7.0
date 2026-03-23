# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` is the React + Vite client app.
- `frontend/src/` contains runtime code:
  - `main.jsx` bootstraps the app.
  - `App.jsx` defines router wiring and protected routes.
  - `screens/` contains page-level components (`LandingPage.jsx`, `DashboardOverview.jsx`, etc.).
  - `components/` contains shared UI and auth guards (`ProtectedRoute`, nav components).
  - `context/` contains auth context providers.
  - `lib/` contains API/Supabase client helpers.
  - `assets/` stores local images and SVGs.
- `frontend/public/` contains static assets served as-is.
- `backend/` is an active FastAPI service:
  - `main.py` app entrypoint and router registration.
  - `routers/` API endpoints (`channel`, `competitors`, `patterns`, `strategy`).
  - `services/` business logic and external integrations.
  - `models/` request/response schemas.
  - `data/` local data files.
- `server/` currently exists as a reserved folder (empty).
- `.agents/skills/` contains local skill packs used by agent tooling.
- Root-level product docs (for example `SpyGlass_PRD.docx`) describe requirements.

## Build, Test, and Development Commands
**Frontend Commands (run from `frontend/`):**
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server with HMR.
- `npm run build` creates the production bundle in `frontend/dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint over the frontend codebase.

**Backend Commands (run from `backend/`):**
- The project uses `.venv` as the **primary** Python environment.
- `python3 -m venv .venv` initializes the environment.
- `source .venv/bin/activate` activates it.
- `pip install -r requirements.txt` installs backend dependencies.
- `uvicorn main:app --reload` starts the FastAPI server.

## Coding Style & Naming Conventions
- Use ES modules and functional React components.
- Match existing formatting in touched files (many current files use semicolons and 2-space indentation).
- Keep page components in `src/screens/` with PascalCase filenames and default exports.
- Keep route paths snake_case where already established (example: `/dashboard_overview`).
- Prefer Tailwind utility classes; keep design tokens aligned with `tailwind.config.js`.
- Linting source of truth: `frontend/eslint.config.js`.
- Python backend conventions:
  - Keep routers thin; place reusable logic in `backend/services/`.
  - Keep Pydantic schemas in `backend/models/schemas.py`.
  - Use explicit imports and type hints where practical.

## Testing Guidelines
- No automated test framework is configured yet.
- Minimum pre-PR quality bar:
  - Frontend: `npm run lint` + manual route checks in `npm run dev`.
  - Backend: start `uvicorn main:app --reload` and verify `/docs` plus changed endpoints.
- If you add tests, place them under `frontend/src/` using `*.test.jsx` naming and include a script update in `package.json`.

## Commit & Pull Request Guidelines
- Follow concise, imperative commits. Existing history uses prefixes like `chore:` (example: `chore: update gitignore`).
- Recommended commit format: `<type>: <short description>` (`feat`, `fix`, `chore`, `docs`, `refactor`).
- PRs should include:
  - Clear summary of functional changes.
  - Linked issue/task (if available).
  - UI screenshots or short screen recordings for screen changes.
  - Local verification steps (commands run, pages checked).

## Security & Configuration Tips
- Never commit secrets or `.env` files.
- Keep `.env.example` updated when adding new configuration keys.
- Keep dependency updates scoped and review `package-lock.json` diffs before merging.
