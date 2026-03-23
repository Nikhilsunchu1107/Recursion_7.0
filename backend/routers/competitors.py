from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.youtube_service import (
    extract_channel_id,
    build_channel_dataset,
    load_from_cache,
    discover_competitors,
)

router = APIRouter(prefix="/competitors", tags=["competitors"])


class DiscoverRequest(BaseModel):
    channel_url: str
    niche_keyword: Optional[str] = None


@router.post("/discover")
async def discover(request: DiscoverRequest):
    """
    Discover competitor channels for a given YouTube channel.

    - Extracts channel ID from URL
    - Checks cache first (24-hour TTL)
    - Runs full pipeline if not cached
    - Uses niche_keyword for search if provided
    """
    try:
        # Extract channel ID
        channel_id = extract_channel_id(request.channel_url)

        # Check cache
        cached = load_from_cache(channel_id)
        if cached:
            dataset = cached
        else:
            # Build full dataset (includes competitor discovery)
            dataset = build_channel_dataset(
                request.channel_url,
                niche_keyword=request.niche_keyword,
            )

        channel_info = dataset.get("channel", {})
        competitors = dataset.get("competitors", [])
        keywords_used = dataset.get("keywords_used", [])

        return {
            "your_channel": {
                "channel_name": channel_info.get("channel_name", ""),
                "subscribers": channel_info.get("subscribers", 0),
                "total_views": channel_info.get("total_views", 0),
                "video_count": channel_info.get("video_count", 0),
            },
            "competitors": [
                {
                    "channel_id": c.get("channel_id", ""),
                    "channel_name": c.get("channel_name", ""),
                    "subscribers": c.get("subscribers", 0),
                    "total_views": c.get("total_views", 0),
                    "avg_views": c.get("avg_views", 0),
                    "upload_frequency": c.get("upload_frequency", 0.0),
                    "videos": c.get("videos", []),
                }
                for c in competitors
            ],
            "total_competitors_found": len(competitors),
            "keywords_used": keywords_used,
        }

    except ValueError as e:
        error_msg = str(e)
        if "quota" in error_msg.lower():
            raise HTTPException(status_code=429, detail=error_msg)
        if "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        print(f"[competitors/discover] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
