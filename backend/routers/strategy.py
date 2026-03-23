from fastapi import APIRouter, HTTPException, Depends
from models.schemas import ChannelRequest
from services.youtube_service import (
    build_channel_dataset,
)
from services.analysis_service import analyze_patterns
from services.openrouter_service import generate_strategy
from services.auth_service import get_current_user

router = APIRouter(prefix="/strategy", tags=["strategy"])


@router.post("/generate")
async def generate(request: ChannelRequest, user=Depends(get_current_user)):
    """
    Full pipeline endpoint:
    1. Build channel dataset (extracts channel, fetches videos, discovers competitors)
    2. Analyze content patterns across competitors
    3. Generate AI strategy recommendations
    Returns everything in one response.
    """
    try:
        # Step 1: Build full dataset (includes competitor discovery)
        dataset = build_channel_dataset(request.channel_url, niche_keyword=request.niche_keyword)

        channel_data = dataset.get("channel", {})
        channel_videos = dataset.get("videos", [])
        competitors_raw = dataset.get("competitors", [])

        # Step 2: Analyze patterns — build list with recent_videos key for analysis_service
        analysis_input = []
        for c in competitors_raw:
            analysis_input.append({"recent_videos": c.get("videos", [])})
        patterns = analyze_patterns(analysis_input)

        # Step 3: Generate strategy with OpenRouter
        strategy = generate_strategy(channel_data, patterns, competitors_raw)

        # Step 4: Store history in Supabase
        try:
            from services.auth_service import supabase_client
            if supabase_client and user:
                supabase_client.table('analysis_history').insert({
                    "user_id": user.id,
                    "channel_url": request.channel_url,
                    "channel_name": channel_data.get("channel_name", "")
                }).execute()
        except Exception as e:
            print(f"Failed to log history: {e}")

        # Build response
        return {
            "channel": {
                "channel_id": channel_data.get("channel_id", ""),
                "name": channel_data.get("channel_name", ""),
                "subscribers": channel_data.get("subscribers", 0),
                "total_views": channel_data.get("total_views", 0),
                "video_count": channel_data.get("video_count", 0),
                "recent_videos": channel_videos,
            },
            "competitors": [
                {
                    "channel_id": c.get("channel_id", ""),
                    "name": c.get("channel_name", ""),
                    "subscribers": c.get("subscribers", 0),
                    "total_views": c.get("total_views", 0),
                    "video_count": c.get("video_count", 0),
                    "avg_views": c.get("avg_views", 0),
                    "upload_frequency": c.get("upload_frequency", 0.0),
                    "videos": c.get("videos", []),
                }
                for c in competitors_raw
            ],
            "patterns": patterns,
            "strategy": strategy,
        }

    except ValueError as e:
        error_msg = str(e)
        if "quota" in error_msg.lower():
            raise HTTPException(status_code=429, detail=error_msg)
        if "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        print(f"[strategy/generate] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
