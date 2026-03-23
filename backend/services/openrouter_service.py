import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"


def generate_strategy(channel_data: dict, patterns: dict, competitors: list) -> dict:
    """
    Send channel data, competitor patterns, and competitor info to OpenRouter
    and return a parsed JSON strategy object.

    Returns:
        {
            "recommendations": [{"title": ..., "description": ..., "priority": ...}],
            "opportunity_gaps": [{"topic": ..., "reason": ..., "demand_level": ...}]
        }
    """
    competitor_summary = []
    for c in competitors:
        competitor_summary.append({
            "name": c.get("name"),
            "subscribers": c.get("subscribers"),
            "total_views": c.get("total_views"),
            "video_count": c.get("video_count"),
        })

    prompt = f"""You are a YouTube growth strategist. Analyze the following data and provide actionable strategy recommendations.

## Your Channel
- Name: {channel_data.get("name")}
- Subscribers: {channel_data.get("subscribers")}
- Total Views: {channel_data.get("total_views")}
- Video Count: {channel_data.get("video_count")}

## Competitor Channels
{json.dumps(competitor_summary, indent=2)}

## Content Patterns Across Competitors
- Average Upload Frequency: {patterns.get("avg_upload_frequency")} videos/week
- Average Video Length: {patterns.get("avg_video_length_minutes")} minutes
- Best Posting Days: {', '.join(patterns.get("best_posting_days", []))}
- Top Keywords: {', '.join(patterns.get("top_keywords", []))}
- Viral Title Examples: {json.dumps(patterns.get("viral_title_examples", []))}

## Instructions
Based on this analysis, provide:
1. **recommendations**: A list of strategic recommendations, each with "title", "description", and "priority" (high/medium/low).
2. **opportunity_gaps**: A list of content gaps the channel can exploit, each with "topic", "reason", and "demand_level" (high/medium/low).

Return ONLY valid JSON in this exact format, with no additional text, markdown, or explanation:
{{
    "recommendations": [
        {{"title": "...", "description": "...", "priority": "high|medium|low"}}
    ],
    "opportunity_gaps": [
        {{"topic": "...", "reason": "...", "demand_level": "high|medium|low"}}
    ]
}}"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "YouTube Competitor Analysis",
    }

    payload = {
        "model": "anthropic/claude-sonnet-4",
        "max_tokens": 2048,
        "messages": [
            {"role": "user", "content": prompt}
        ],
    }

    response = httpx.post(
        OPENROUTER_BASE_URL,
        headers=headers,
        json=payload,
        timeout=60.0,
    )
    response.raise_for_status()

    data = response.json()
    response_text = data["choices"][0]["message"]["content"].strip()

    # Strip markdown code fences if present
    if response_text.startswith("```"):
        lines = response_text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        response_text = "\n".join(lines).strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        result = {
            "recommendations": [],
            "opportunity_gaps": [],
            "raw_response": response_text,
        }

    return result
