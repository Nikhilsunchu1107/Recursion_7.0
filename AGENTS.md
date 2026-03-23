# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` is the active app (React + Vite).
- `frontend/src/` contains runtime code:
  - `main.jsx` bootstraps the app.
  - `App.jsx` defines router wiring.
  - `screens/` contains page-level components (`LandingPage.jsx`, `DashboardOverview.jsx`, etc.).
  - `assets/` stores local images and SVGs.
- `frontend/public/` contains static assets served as-is.
- `server/` exists but is currently empty; treat it as reserved for backend work.
- Root-level product docs (for example `SpyGlass_PRD.docx`) describe requirements.

## Build, Test, and Development Commands
**Frontend Commands (run from `frontend/`):**
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server with HMR.
- `npm run build` creates the production bundle in `frontend/dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint over `js/jsx` files.

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

## Testing Guidelines
- No automated test framework is configured yet.
- Minimum pre-PR quality bar: `npm run lint` + manual route checks in `npm run dev`.
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
- Keep dependency updates scoped and review `package-lock.json` diffs before merging.
