from fastapi import APIRouter, HTTPException
from models.schemas import ChannelRequest, FullPipelineResponse
from services.youtube_service import (
    extract_channel_id,
    get_channel_details,
    get_channel_videos,
    discover_competitors,
)
from services.analysis_service import analyze_patterns
from services.openrouter_service import generate_strategy

router = APIRouter(prefix="/strategy", tags=["strategy"])


@router.post("/generate")
async def generate(request: ChannelRequest):
    """
    Full pipeline endpoint:
    1. Extract channel ID and get channel details
    2. Discover competitors in the niche
    3. Analyze content patterns across competitors
    4. Generate AI strategy recommendations
    Returns everything in one response.
    """
    try:
        # Step 1: Get the user's channel data
        channel_id = extract_channel_id(request.channel_url)
        channel_data = get_channel_details(channel_id)
        uploads_id = channel_data.get("uploads_playlist_id")
        channel_videos = get_channel_videos(uploads_id, max_results=20) if uploads_id else []
        channel_data["recent_videos"] = channel_videos

        # Step 2: Discover competitors
        competitors_raw = discover_competitors(request.niche_keyword, max_results=8)
        for comp in competitors_raw:
            comp_uploads = comp.get("uploads_playlist_id")
            if comp_uploads:
                comp["recent_videos"] = get_channel_videos(comp_uploads, max_results=10)

        # Step 3: Analyze patterns
        all_channels_for_analysis = competitors_raw.copy()
        patterns = analyze_patterns(all_channels_for_analysis)

        # Step 4: Generate strategy with Claude
        strategy = generate_strategy(channel_data, patterns, competitors_raw)

        # Build response
        return {
            "channel": {
                "channel_id": channel_data["channel_id"],
                "name": channel_data["name"],
                "subscribers": channel_data["subscribers"],
                "total_views": channel_data["total_views"],
                "video_count": channel_data["video_count"],
                "recent_videos": channel_videos,
            },
            "competitors": [
                {
                    "channel_id": c["channel_id"],
                    "name": c["name"],
                    "subscribers": c["subscribers"],
                    "total_views": c["total_views"],
                    "video_count": c["video_count"],
                    "recent_videos": c.get("recent_videos", []),
                }
                for c in competitors_raw
            ],
            "patterns": patterns,
            "strategy": strategy,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
