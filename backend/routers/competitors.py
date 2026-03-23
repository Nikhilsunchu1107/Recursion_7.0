from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.youtube_service import discover_competitors, get_channel_videos

router = APIRouter(prefix="/competitors", tags=["competitors"])


class DiscoverRequest(BaseModel):
    keyword: str
    max_results: int = 8


@router.post("/discover")
async def discover(request: DiscoverRequest):
    """Discover competitor channels by keyword."""
    try:
        competitors = discover_competitors(request.keyword, request.max_results)

        # Fetch recent videos for each competitor
        for comp in competitors:
            uploads_id = comp.get("uploads_playlist_id")
            if uploads_id:
                videos = get_channel_videos(uploads_id, max_results=10)
                comp["recent_videos"] = videos

        return {"competitors": competitors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
