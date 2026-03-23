from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChannelRequest(BaseModel):
    channel_url: str
    niche_keyword: Optional[str] = None


class VideoData(BaseModel):
    video_id: str
    title: str
    views: int
    likes: int
    comments: int
    duration: str
    published_at: str


class CompetitorData(BaseModel):
    channel_id: str
    channel_name: str
    subscribers: int
    total_views: int
    video_count: int
    avg_views: Optional[int] = 0
    upload_frequency: Optional[float] = 0.0
    videos: List[VideoData] = []


class PatternResult(BaseModel):
    avg_upload_frequency: float  # videos per week
    avg_video_length_minutes: float
    best_posting_days: List[str]
    top_keywords: List[str]
    viral_title_examples: List[str]


class StrategyRecommendation(BaseModel):
    title: str
    description: str
    priority: str


class OpportunityGap(BaseModel):
    topic: str
    reason: str
    demand_level: str


class StrategyResult(BaseModel):
    recommendations: List[StrategyRecommendation]
    opportunity_gaps: List[OpportunityGap]


class FullPipelineResponse(BaseModel):
    channel: CompetitorData
    competitors: List[CompetitorData]
    patterns: PatternResult
    strategy: StrategyResult
