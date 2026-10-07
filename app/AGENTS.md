# Working in app/

The HTTP layer and the UI. Business logic belongs in `src/`, not here.

## Backend

`backend/main.py` does routing, validation, and serving the built frontend. It imports from the
package and adds nothing of its own. A route that starts to contain logic means that logic
belongs in `src/` with a test.

FastAPI and uvicorn are an optional dependency group. Install with `uv sync --extra app`.

## Frontend

- Tailwind for styling. No CSS files beyond `src/index.css`, and no inline `style` props
- Components come from `npx shadcn@latest add <name>`, which writes into
  `src/components/ui/`. Do not hand-write what the CLI provides
- TanStack Query for anything that talks to the API. No `useEffect` fetching
- Icons from `lucide-react`
- `@/` resolves to `src/`
- Tests run without a backend. MSW intercepts in `src/test/setup.ts`, and an unhandled request
  fails the test rather than reaching the network

## Verifying

`npm run check` covers lint, types, build, and tests. `make lint` and `make test` from the repo
root run it too, so either works.

## Local loop

`make dev` from the repo root runs uvicorn and Vite together. Vite proxies `/api` to uvicorn, so
the same paths work locally and once deployed.
