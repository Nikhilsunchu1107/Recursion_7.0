from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.analysis_service import analyze_patterns

router = APIRouter(prefix="/patterns", tags=["patterns"])


class PatternRequest(BaseModel):
    competitors: List[dict]


@router.post("/analyze")
async def analyze(request: PatternRequest):
    """Analyze content patterns across competitor channels."""
    try:
        patterns = analyze_patterns(request.competitors)
        return patterns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
