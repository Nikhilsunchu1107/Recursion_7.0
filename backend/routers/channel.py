from fastapi import APIRouter, HTTPException
from services.youtube_service import build_channel_dataset

router = APIRouter(prefix="/channel", tags=["channel"])


@router.get("/{channel_url:path}")
async def get_channel(channel_url: str):
    """Get detailed channel info including recent videos and summary."""
    try:
        details = build_channel_dataset(channel_url)
        return details
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
