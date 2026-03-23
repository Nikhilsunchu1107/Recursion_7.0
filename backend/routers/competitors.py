from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.youtube_service import (
    extract_channel_id,
    load_from_cache,
    save_to_cache,
)
from services.competitor_service import discover_competitors

router = APIRouter(prefix="/competitors", tags=["competitors"])


class CompetitorRequest(BaseModel):
    channel_url: str
    max_results: Optional[int] = 20


@router.post("/discover")
async def discover(request: CompetitorRequest):
    try:
        channel_id = extract_channel_id(request.channel_url)
        dataset = load_from_cache(channel_id)

        if not dataset:
            raise HTTPException(
                status_code=404,
                detail="Channel not analyzed yet. Call /channel/analyze first."
            )

        result = discover_competitors(dataset, request.max_results)

        # Save full result back to cache
        try:
            dataset["competitors"] = result
            save_to_cache(channel_id, dataset)
        except Exception as e:
            print(f"⚠️ Cache save failed: {e}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
