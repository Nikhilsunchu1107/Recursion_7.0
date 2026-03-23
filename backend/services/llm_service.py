import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_HTTP_REFERER = os.getenv("LLM_HTTP_REFERER", "http://localhost:8000")
LLM_BASE_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_strategy(analysis_payload: dict) -> dict:
    """
    Send raw video data and aggregated metrics to OpenRouter
    and return a parsed JSON strategy object containing topic clusters,
    content gaps, and actionable recommendations.
    """
    competitor_summaries = []
    for c in analysis_payload.get("competitors", []):
        videos_str = "\n".join([f"  - {v.get('title')} ({v.get('views')} views)" for v in c.get("videos", [])])
        summary = f"Channel: {c.get('channel_name')} (Subs: {c.get('subscribers')})\nTop Videos:\n{videos_str}\n"
        competitor_summaries.append(summary)
        
    competitors_text = "\n".join(competitor_summaries)
    
    aggr = analysis_payload.get("aggregated_metrics", {})
    comp = analysis_payload.get("comparison", {})
    your_sum = analysis_payload.get("your_channel_summary", {})

    prompt = f"""You are an elite YouTube growth strategist. Analyze the following competitor data and provide highly specific, actionable strategy recommendations.

## Your Client's Channel
- Name: {your_sum.get("channel_name")}
- Subscribers: {your_sum.get("subscribers")}
- Average Views: {your_sum.get("avg_views")}
- Known Topics: {', '.join(your_sum.get("your_topics", []))}

## Competitor Landscape
The competitors average {aggr.get("avg_views_across_competitors")} views and post {aggr.get("avg_upload_frequency")} times per week. Your client's engagement ratio is {comp.get("your_engagement_vs_competitors", {}).get("yours")}% vs competitors at {comp.get("your_engagement_vs_competitors", {}).get("competitors_avg")}%.

## Competitor Raw Video Data
{competitors_text}

## Instructions
1. **Topic Clusters**: Cluster the competitor video titles into 3-5 major thematic topics or formats driving views.
2. **Content Gaps**: Identify 3-5 specific video ideas or topics that are working exceptionally well for competitors but are completely missing from your client's channel.
3. **Strategy Recommendations**: Provide exactly 4 highly specific, actionable recommendations for the input channel to grow. Each recommendation MUST explicitly cite a specific competitor channel by name as proof.
4. **Suggested Cadence**: Based on competitor upload frequency, suggest the ideal videos-per-week cadence.

Return ONLY valid JSON in this exact format, with no markdown formatting around it:
{{
    "topic_clusters": [
        {{"topic_name": "...", "description": "...", "competitors_using_this": ["Channel A"]}}
    ],
    "content_gaps": [
        {{"topic": "...", "reason": "...", "demand_level": "high|medium|low"}}
    ],
    "recommendations": [
        {{"title": "...", "description": "...", "priority": "high|medium|low", "based_on_competitor": "Name of competitor"}}
    ],
    "suggested_upload_frequency_per_week": 1.5
}}"""

    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": LLM_HTTP_REFERER,
        "X-Title": "SpyGlass Strategy Engine",
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "max_tokens": 2048,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "user", "content": prompt}
        ],
    }

    try:
        response = httpx.post(
            LLM_BASE_URL,
            headers=headers,
            json=payload,
            timeout=60.0,
        )
        response.raise_for_status()

        data = response.json()
        response_text = data["choices"][0]["message"]["content"].strip()

        # Strip markdown code fences if LLM ignores response_format instruction
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            response_text = "\n".join(lines).strip()

        result = json.loads(response_text)
        
        # Merge the analysis payload into the final strategy object for the frontend
        result["raw_analysis"] = analysis_payload
        
        return result
    except Exception as e:
        print(f"⚠️ OpenRouter LLM generation failed: {e}")
        return {
            "topic_clusters": [],
            "content_gaps": [],
            "recommendations": [
                {"title": "Generation Failed", "description": str(e), "priority": "high", "based_on_competitor": "None"}
            ],
            "suggested_upload_frequency_per_week": 1.0,
            "raw_analysis": analysis_payload
        }
