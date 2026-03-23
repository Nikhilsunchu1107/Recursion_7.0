from fastapi import APIRouter, HTTPException
from services.youtube_service import extract_channel_id, get_channel_details

router = APIRouter(prefix="/channel", tags=["channel"])


@router.get("/{channel_url:path}")
async def get_channel(channel_url: str):
    """Get channel details from a YouTube channel URL."""
    try:
        channel_id = extract_channel_id(channel_url)
        details = get_channel_details(channel_id)
        return details
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
