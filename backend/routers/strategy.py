from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.youtube_service import (
    extract_channel_id,
    load_from_cache,
)
from services.llm_service import generate_strategy

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

        # The competitor list is stored under competitor_data["competitors"]
        strategy_competitors = competitor_data.get("competitors", [])

        if not strategy_competitors:
            raise HTTPException(
                status_code=400,
                detail="No competitors found in cache. Please re-run /competitors/discover first, then try again."
            )

        print(f"🎯 Generating strategy based on {len(strategy_competitors)} competitors")
        for c in strategy_competitors:
            print(f"   → {c.get('channel_name')} (score: {c.get('relevance_score')})")

        # Analyze patterns from strong competitors only
        from services.analysis_service import run_full_analysis
        
        analysis_result = run_full_analysis(
            your_channel_data=dataset,
            competitor_result={"competitors": strategy_competitors}
        )

        # Generate AI strategy
        strategy = generate_strategy(
            analysis_payload=analysis_result
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
