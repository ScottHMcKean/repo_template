"""HTTP layer. Routing, validation, and serving the frontend. No business logic.

Anything worth testing lives in the package this imports from, where a test can reach it
without starting a server.
"""

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from project_name import table_name

DIST = Path(__file__).resolve().parents[1] / "frontend" / "dist"

app = FastAPI(title="project-name")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/table")
def table(catalog: str, schema: str, name: str) -> dict[str, str]:
    try:
        return {"table": table_name(catalog, schema, name)}
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


# The built frontend, when there is one. In development Vite serves it instead and proxies
# /api here, so the same URLs work in both places.
if DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

    @app.get("/{path:path}")
    def spa(path: str) -> FileResponse:
        return FileResponse(DIST / "index.html")
