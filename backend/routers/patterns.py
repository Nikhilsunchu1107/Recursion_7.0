from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from services.youtube_service import load_from_cache, save_to_cache, extract_channel_id
from services.pattern_service import run_pattern_analysis

router = APIRouter(prefix="/patterns", tags=["patterns"])


class PatternsRequest(BaseModel):
    channel_url: str


@router.post("/analyze")
async def analyze_patterns(request: PatternsRequest):
    """
    Run Phase 5 pattern analysis on already-fetched competitor data.
    Provide a channel_url (e.g. https://youtube.com/@fraz).
    Requires Phase 4 /analysis/run to have been completed first.
    """
    try:
        channel_id = extract_channel_id(request.channel_url.strip())
        dataset = load_from_cache(channel_id)

        if not dataset:
            raise HTTPException(
                status_code=404,
                detail="Channel not analyzed yet. Call /channel/analyze first."
            )

        if "analysis" not in dataset:
            raise HTTPException(
                status_code=400,
                detail="Run analysis first. Call /analysis/run before patterns."
            )

        # Return cached patterns if fresh (< 24h)
        if "patterns" in dataset and "fetched_at" in dataset:
            try:
                fetched_at = datetime.fromisoformat(dataset["fetched_at"].replace("Z", "+00:00"))
                if datetime.now(fetched_at.tzinfo) - fetched_at < timedelta(hours=24):
                    print("⚡ Returning cached patterns immediately")
                    return dataset["patterns"]
            except Exception:
                pass

        result = run_pattern_analysis(dataset, dataset["analysis"])

        try:
            dataset["patterns"] = result
            save_to_cache(channel_id, dataset)
        except Exception as e:
            print(f"⚠️ Cache save failed: {e}")

        return result

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{channel_id}")
async def get_patterns(channel_id: str):
    """
    Retrieve previously computed patterns from cache.
    Does not make any API calls.
    """
    try:
        dataset = load_from_cache(channel_id)

        if not dataset or "patterns" not in dataset:
            raise HTTPException(
                status_code=404,
                detail="No pattern data found. Run /patterns/analyze first."
            )

        return dataset["patterns"]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
