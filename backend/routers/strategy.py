from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.youtube_service import (
    extract_channel_id,
    load_from_cache,
)
from services.analysis_service import analyze_patterns
from services.openrouter_service import generate_strategy

router = APIRouter(prefix="/strategy", tags=["strategy"])


class StrategyRequest(BaseModel):
    channel_url: str
    niche_keyword: Optional[str] = None


@router.post("/generate")
async def generate(request: StrategyRequest):
    try:
        channel_id = extract_channel_id(request.channel_url)
        dataset = load_from_cache(channel_id)

        if not dataset:
            raise HTTPException(status_code=404, detail="Channel not found in cache")

        # Check if competitor discovery has been run
        if "competitors" not in dataset:
            raise HTTPException(
                status_code=400,
                detail="Run competitor discovery first. Call /competitors/discover before generating strategy."
            )

        competitor_data = dataset["competitors"]

        # Use ONLY strong competitors for strategy
        strategy_competitors = competitor_data.get("strategy_competitors", [])

        if not strategy_competitors:
            raise HTTPException(
                status_code=400,
                detail="No strong competitors found. Cannot generate meaningful strategy. Try a broader niche keyword."
            )

        print(f"🎯 Generating strategy based on {len(strategy_competitors)} strong competitors")
        for c in strategy_competitors:
            print(f"   → {c['channel_name']} (score: {c['relevance_score']})")

        # Analyze patterns from strong competitors only
        patterns = analyze_patterns(strategy_competitors)

        # Generate AI strategy
        strategy = generate_strategy(
            channel_data=dataset["channel"],
            patterns=patterns,
            competitors=strategy_competitors
        )

        return {
            "channel": dataset["channel"]["channel_name"],
            "based_on_competitors": [c["channel_name"] for c in strategy_competitors],
            "competitor_count": len(strategy_competitors),
            "strategy": strategy
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
