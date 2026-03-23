from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import channel, competitors, patterns, strategy

app = FastAPI(
    title="YouTube Competitor Analysis API",
    description="Analyze YouTube competitors, discover content patterns, and generate AI-powered growth strategies.",
    version="1.0.0",
)

# CORS middleware — allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "endpoints": [
            "POST /competitors/discover",
            "POST /patterns/analyze",
            "POST /strategy/generate",
            "GET /channel/{channel_url}",
        ],
    }
