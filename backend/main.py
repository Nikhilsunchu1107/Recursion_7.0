import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import channel, competitors, patterns, strategy


def _get_cors_origins() -> list[str]:
    default_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]

    configured_origins: list[str] = []
    for key in ("FRONTEND_URL", "FRONTEND_URLS"):
        value = os.getenv(key, "")
        if not value:
            continue
        configured_origins.extend(
            [origin.strip() for origin in value.split(",") if origin.strip()]
        )

    return configured_origins or default_origins


def _get_cors_origin_regex() -> str | None:
    value = os.getenv("FRONTEND_ORIGIN_REGEX", "").strip()
    return value or None


cors_origins = _get_cors_origins()
cors_origin_regex = _get_cors_origin_regex()

app = FastAPI(
    title="YouTube Competitor Analysis API",
    description="Analyze YouTube competitors, discover content patterns, and generate AI-powered growth strategies.",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(channel.router)
app.include_router(competitors.router)
app.include_router(patterns.router)
app.include_router(strategy.router)


@app.get("/")
async def root():
    return {
        "message": "YouTube Competitor Analysis API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": [
            "POST /competitors/discover",
            "POST /patterns/analyze",
            "POST /strategy/generate",
            "GET /channel/{channel_url}",
        ],
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}
