from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.youtube_service import extract_channel_id, load_from_cache, save_to_cache
from services.analysis_service import run_full_analysis
from services.auth_service import get_current_user

router = APIRouter(prefix="/analysis", tags=["analysis"])


class AnalysisRequest(BaseModel):
    channel_url: str


@router.post("/run")
async def run_analysis(request: AnalysisRequest, user=Depends(get_current_user)):
    """
    Run the full Phase 4 competitor analysis pipeline.
    Requires the channel to have been analyzed (GET /channel/{channel_url}) and
    competitor discovery to have been run (/competitors/discover) first.
    """
    try:
        channel_id = extract_channel_id(request.channel_url)
        dataset = load_from_cache(channel_id)

        if not dataset:
            raise HTTPException(
                status_code=404,
                detail="Channel not analyzed yet. Call GET /channel/{channel_url} first."
            )

        if "competitors" not in dataset:
            raise HTTPException(
                status_code=400,
                detail="Run competitor discovery first. Call /competitors/discover before analysis."
            )

        result = run_full_analysis(dataset, dataset["competitors"])

        # Save analysis result back to cache
        try:
            dataset["analysis"] = result
            save_to_cache(channel_id, dataset)
        except Exception as e:
            print(f"⚠️ Cache save failed: {e}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{channel_id}")
async def get_analysis(channel_id: str, user=Depends(get_current_user)):
    """
    Retrieve a previously computed analysis from cache.
    Does not make any new API calls.
    """
    try:
        dataset = load_from_cache(channel_id)

        if not dataset or "analysis" not in dataset:
            raise HTTPException(
                status_code=404,
                detail="No analysis found. Run /analysis/run first."
            )

        return dataset["analysis"]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
