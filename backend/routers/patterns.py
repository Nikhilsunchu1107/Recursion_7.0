from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from services.analysis_service import analyze_patterns
from services.auth_service import get_current_user

router = APIRouter(prefix="/patterns", tags=["patterns"])


class PatternRequest(BaseModel):
    competitors: List[dict]


@router.post("/analyze")
async def analyze(request: PatternRequest, user=Depends(get_current_user)):
    """Analyze content patterns across competitor channels."""
    try:
        patterns = analyze_patterns(request.competitors)
        return patterns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
