import os
import re
import json
import requests
from collections import Counter
from datetime import datetime, timezone
from typing import List
from dotenv import load_dotenv

from services.youtube_service import get_video_details, extract_channel_id, load_from_cache, save_to_cache

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


# ---------------------------------------------------------------------------
# Helpers (original)
# ---------------------------------------------------------------------------

def _parse_duration_minutes(duration_str: str) -> float:
    """Parse an ISO 8601 duration or HH:MM:SS string to minutes."""
    parts = duration_str.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 60 + int(m) + int(s) / 60
    if len(parts) == 2:
        m, s = parts
        return int(m) + int(s) / 60
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration_str)
    if match:
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        return hours * 60 + minutes + seconds / 60
    return 0.0


def _extract_keywords(titles: List[str], top_n: int = 10) -> List[str]:
    """Extract top keywords from video titles."""
    stop_words = {
        "the", "a", "an", "is", "it", "in", "on", "at", "to", "for",
        "of", "and", "or", "but", "with", "this", "that", "i", "my",
        "me", "we", "you", "he", "she", "they", "how", "what", "why",
        "when", "where", "who", "which", "do", "does", "did", "will",
        "can", "could", "would", "should", "has", "have", "had", "be",
        "been", "being", "am", "are", "was", "were", "not", "no", "so",
        "if", "then", "than", "too", "very", "just", "about", "up",
        "out", "all", "from", "as", "by", "into", "your", "our",
        "their", "its", "get", "got", "make", "made", "new", "one",
        "|", "-", "—", "ft", "vs", "ft.", "ep", "#",
    }
    words = []
    for title in titles:
        cleaned = re.sub(r"[^\w\s]", " ", title.lower())
        for word in cleaned.split():
            if word not in stop_words and len(word) > 2:
                words.append(word)
    counter = Counter(words)
    return [word for word, _ in counter.most_common(top_n)]


def _build_topic_clusters(competitors_with_keywords: list, max_clusters: int = 6) -> list:
    topic_counter = Counter()
    topic_channels = {}

    for comp in competitors_with_keywords:
        channel_name = comp.get("channel_name", "")
        topics = comp.get("keywords", {}).get("common_topics", [])
        for topic in topics:
            normalized = str(topic).strip().lower()
            if len(normalized) < 3:
                continue
            topic_counter[normalized] += 1
            topic_channels.setdefault(normalized, set()).add(channel_name)

    clusters = []
    for topic, count in topic_counter.most_common(max_clusters):
        channels = sorted(topic_channels.get(topic, set()))
        clusters.append(
            {
                "topic_name": topic,
                "description": f"Appears across {count} competitor channel(s).",
                "competitors_using_this": channels[:6],
            }
        )

    return clusters


# ---------------------------------------------------------------------------
# Original Phase 3 — analyze_patterns (kept intact)
# ---------------------------------------------------------------------------

def analyze_patterns(competitors: list) -> dict:
    """Analyze content patterns across competitor channels."""
    all_videos = []
    for competitor in competitors:
        videos = competitor.get("recent_videos", [])
        all_videos.extend(videos)

    if not all_videos:
        return {
            "avg_upload_frequency": 0.0,
            "avg_video_length_minutes": 0.0,
            "best_posting_days": [],
            "top_keywords": [],
            "viral_title_examples": [],
        }

    dates = []
    for v in all_videos:
        try:
            dt = datetime.fromisoformat(v["published_date"].replace("Z", "+00:00"))
            dates.append(dt)
        except Exception:
            continue

    if len(dates) >= 2:
        dates.sort()
        span_days = (dates[-1] - dates[0]).days or 1
        span_weeks = span_days / 7
        avg_upload_frequency = round(len(dates) / span_weeks, 2)
    else:
        avg_upload_frequency = 0.0

    durations = [_parse_duration_minutes(v["duration"]) for v in all_videos]
    durations = [d for d in durations if d > 0]
    avg_video_length = round(sum(durations) / len(durations), 2) if durations else 0.0

    day_counter = Counter()
    for v in all_videos:
        try:
            dt = datetime.fromisoformat(v["published_date"].replace("Z", "+00:00"))
            day_counter[dt.strftime("%A")] += 1
        except Exception:
            continue

    best_posting_days = [day for day, _ in day_counter.most_common(3)]
    titles = [v["title"] for v in all_videos]
    top_keywords = _extract_keywords(titles)
    sorted_videos = sorted(all_videos, key=lambda v: v.get("views", 0), reverse=True)
    viral_title_examples = [v["title"] for v in sorted_videos[:5]]

    return {
        "avg_upload_frequency": avg_upload_frequency,
        "avg_video_length_minutes": avg_video_length,
        "best_posting_days": best_posting_days,
        "top_keywords": top_keywords,
        "viral_title_examples": viral_title_examples,
    }


# ---------------------------------------------------------------------------
# Phase 4 — Function 1: Fetch competitor videos
# ---------------------------------------------------------------------------

def fetch_competitor_videos(competitors: list) -> list:
    """Fetch top 10 videos for each competitor and attach to competitor dict."""
    for competitor in competitors:
        channel_id = competitor.get("channel_id", "")
        channel_name = competitor.get("channel_name", "Unknown")
        print(f"🎬 Fetching videos for competitor: {channel_name}")

        try:
            # Get uploads_playlist_id
            url = "https://www.googleapis.com/youtube/v3/channels"
            params = {
                "part": "contentDetails",
                "id": channel_id,
                "key": YOUTUBE_API_KEY
            }
            res = requests.get(url, params=params, timeout=15)
            if res.status_code == 403:
                raise Exception("YouTube API quota exceeded")
            res.raise_for_status()

            data = res.json()
            items = data.get("items", [])
            if not items:
                raise Exception(f"No channel data found for {channel_id}")

            uploads_playlist_id = (
                items[0]
                .get("contentDetails", {})
                .get("relatedPlaylists", {})
                .get("uploads", "")
            )

            if not uploads_playlist_id:
                raise Exception(f"No uploads playlist for {channel_name}")

            # Fetch video IDs from uploads playlist
            playlist_url = "https://www.googleapis.com/youtube/v3/playlistItems"
            pl_params = {
                "part": "contentDetails,snippet",
                "playlistId": uploads_playlist_id,
                "maxResults": 10,
                "key": YOUTUBE_API_KEY
            }
            pl_res = requests.get(playlist_url, params=pl_params, timeout=15)
            if pl_res.status_code == 403:
                raise Exception("YouTube API quota exceeded")
            pl_res.raise_for_status()

            pl_data = pl_res.json()
            playlist_items = pl_data.get("items", [])

            # Build a map: video_id -> published_at from playlist (more reliable date)
            playlist_dates = {}
            video_ids = []
            for item in playlist_items:
                vid_id = item.get("contentDetails", {}).get("videoId")
                pub_at = item.get("contentDetails", {}).get("videoPublishedAt", "")
                if vid_id:
                    video_ids.append(vid_id)
                    playlist_dates[vid_id] = pub_at

            if not video_ids:
                raise Exception(f"No video IDs found for {channel_name}")

            # Fetch full video details (title, views, likes, etc.)
            stats_map = get_video_details(video_ids)

            # Build video list merging playlist dates + stats
            videos = []
            for vid_id in video_ids:
                stats = stats_map.get(vid_id, {})
                # Use playlist date as it's more reliable, fall back to snippet publishedAt
                published_at = playlist_dates.get(vid_id) or stats.get("published_at", "")
                videos.append({
                    "video_id": vid_id,
                    "title": stats.get("title", ""),
                    "published_at": published_at,
                    "thumbnail": stats.get("thumbnail", ""),
                    "views": stats.get("views", 0),
                    "likes": stats.get("likes", 0),
                    "comments": stats.get("comments", 0),
                    "duration_minutes": stats.get("duration_minutes", 0.0),
                    "tags": stats.get("tags", []),
                    "video_hashtags": stats.get("video_hashtags", []),
                    "video_keywords": stats.get("video_keywords", []),
                })

            competitor["videos"] = videos
            print(f"✅ Got {len(videos)} videos for {channel_name}")

        except Exception as error:
            print(f"❌ Failed to fetch videos for {channel_name}: {error}")
            competitor["videos"] = []

    return competitors


# ---------------------------------------------------------------------------
# Phase 4 — Function 2: Compute metrics
# ---------------------------------------------------------------------------

def compute_metrics(competitor: dict) -> dict:
    """Compute performance metrics for a single competitor channel."""
    videos = competitor.get("videos", [])

    if not videos:
        return {
            "avg_views": 0,
            "avg_likes": 0,
            "avg_comments": 0,
            "avg_duration_minutes": 0,
            "upload_frequency": 0,
            "engagement_ratio": 0,
            "like_to_view_ratio": 0,
            "comments_to_views_ratio": 0,
            "views_to_subscribers_ratio": 0,
            "total_videos_analyzed": 0
        }

    n = len(videos)
    total_views    = sum(v.get("views", 0) for v in videos)
    total_likes    = sum(v.get("likes", 0) for v in videos)
    total_comments = sum(v.get("comments", 0) for v in videos)
    total_duration = sum(v.get("duration_minutes", 0.0) for v in videos)

    avg_views    = int(total_views / n)
    avg_likes    = int(total_likes / n)
    avg_comments = int(total_comments / n)
    avg_duration = round(total_duration / n, 2)

    dates = sorted([
        datetime.fromisoformat(v["published_at"].replace("Z", "+00:00"))
        for v in videos
        if v.get("published_at")
    ])
    if len(dates) >= 2:
        total_days = max((dates[-1] - dates[0]).days, 1)
        upload_frequency = round(len(videos) / (total_days / 7), 2)
    else:
        upload_frequency = 0

    engagement_ratio = round((total_likes + total_comments) / max(total_views, 1) * 100, 2)
    like_to_view_ratio = round((total_likes / max(total_views, 1)) * 100, 2)
    comments_to_views_ratio = round((total_comments / max(total_views, 1)) * 100, 2)
    views_to_subscribers_ratio = round(avg_views / max(competitor.get("subscribers", 0), 1), 4)
    top_video = max(videos, key=lambda v: v.get("views", 0))

    return {
        "avg_views": avg_views,
        "avg_likes": avg_likes,
        "avg_comments": avg_comments,
        "avg_duration_minutes": avg_duration,
        "upload_frequency": upload_frequency,
        "engagement_ratio": engagement_ratio,
        "like_to_view_ratio": like_to_view_ratio,
        "comments_to_views_ratio": comments_to_views_ratio,
        "views_to_subscribers_ratio": views_to_subscribers_ratio,
        "top_video": top_video,
        "total_videos_analyzed": n
    }


# ---------------------------------------------------------------------------
# Phase 4 — Function 3: Extract competitor keywords
# ---------------------------------------------------------------------------

def extract_competitor_keywords(competitor: dict) -> dict:
    """Extract all keywords and topics from a competitor's video data."""
    videos = competitor.get("videos", [])

    stop_words = {
        "the", "a", "an", "in", "on", "at", "to", "for", "of",
        "and", "is", "it", "how", "what", "why", "with", "your",
        "you", "my", "i", "we", "this", "that", "from", "or",
        "be", "are", "was", "about", "us", "all", "more", "get",
        "can", "will", "have", "has", "just", "also", "new",
        "out", "up", "so", "do", "its", "by", "but", "not",
        "if", "as", "into", "video", "channel", "subscribe",
        "like", "comment", "share", "watch", "part", "ep"
    }

    def clean_words(texts):
        words = []
        for text in texts:
            cleaned = re.sub(r"[^\w\s]", " ", str(text).lower())
            for word in cleaned.split():
                if word not in stop_words and len(word) > 2 and not word.isdigit():
                    words.append(word)
        return words

    all_titles = [v.get("title", "") for v in videos]
    all_tags = list({tag for v in videos for tag in v.get("tags", [])})
    raw_hashtags = [h for v in videos for h in v.get("video_hashtags", [])]
    all_hashtags = list({h.lstrip("#") for h in raw_hashtags})

    title_words = clean_words(all_titles)
    title_counter = Counter(title_words)
    title_keywords = [w for w, _ in title_counter.most_common(15)]

    top_videos = sorted(videos, key=lambda v: v.get("views", 0), reverse=True)[:3]
    top_titles = [v.get("title", "") for v in top_videos]
    hp_words = clean_words(top_titles)
    hp_counter = Counter(hp_words)
    high_performing_keywords = [w for w, _ in hp_counter.most_common(10)]

    common_topics = list({
        *title_keywords,
        *[t.lower() for t in all_tags if len(t) > 2],
        *all_hashtags
    })

    return {
        "title_keywords": title_keywords,
        "high_performing_keywords": high_performing_keywords,
        "all_tags": all_tags,
        "all_hashtags": all_hashtags,
        "common_topics": common_topics
    }


# ---------------------------------------------------------------------------
# Phase 4 — Function 4: Detect content gaps
# ---------------------------------------------------------------------------

def detect_content_gaps(your_channel_data: dict, competitors_with_keywords: list) -> dict:
    """Compare your channel keywords against competitors to find content gaps."""
    your_signals  = your_channel_data.get("signals", {})
    your_keywords = set(kw.lower() for kw in your_signals.get("all_keywords", []))
    your_hashtags = set(h.replace("#", "").lower() for h in your_signals.get("all_hashtags", []))
    your_tags     = set(t.lower() for t in your_signals.get("all_tags", []))
    your_all      = your_keywords | your_hashtags | your_tags

    competitor_keyword_pool    = {}
    competitor_high_performing = {}

    for comp in competitors_with_keywords:
        kw_data = comp.get("keywords", {})
        for kw in kw_data.get("common_topics", []):
            competitor_keyword_pool[kw] = competitor_keyword_pool.get(kw, 0) + 1
        for kw in kw_data.get("high_performing_keywords", []):
            competitor_high_performing[kw] = competitor_high_performing.get(kw, 0) + 1

    gaps = []
    for keyword, count in competitor_keyword_pool.items():
        if keyword not in your_all and len(keyword) > 3:
            is_high_performing = keyword in competitor_high_performing
            gaps.append({
                "topic": keyword,
                "competitor_count": count,
                "is_high_performing": is_high_performing,
                "priority": (
                    "HIGH"   if is_high_performing and count >= 2 else
                    "MEDIUM" if count >= 2 or is_high_performing else
                    "LOW"
                )
            })

    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    gaps.sort(key=lambda g: (priority_order[g["priority"]], -g["competitor_count"]))

    your_unique_topics = [kw for kw in your_all if kw not in competitor_keyword_pool and len(kw) > 3]

    return {
        "content_gaps": gaps[:20],
        "your_unique_topics": your_unique_topics[:10],
        "total_gaps_found": len(gaps),
        "high_priority_gaps":   [g for g in gaps if g["priority"] == "HIGH"],
        "medium_priority_gaps": [g for g in gaps if g["priority"] == "MEDIUM"],
        "low_priority_gaps":    [g for g in gaps if g["priority"] == "LOW"]
    }


# ---------------------------------------------------------------------------
# Phase 4 — Function 5: Master pipeline
# ---------------------------------------------------------------------------

def run_full_analysis(your_channel_data: dict, competitor_result: dict) -> dict:
    """Run the complete Phase 4 pipeline in sequence."""
    print("🚀 Starting Phase 4 analysis...")

    competitors = competitor_result.get("competitors", [])
    print(f"📊 Running analysis on {len(competitors)} competitors")

    print(f"🎬 Fetching videos for {len(competitors)} competitors...")
    competitors_with_videos = fetch_competitor_videos(competitors)

    print("📈 Computing metrics for each competitor...")
    for comp in competitors_with_videos:
        comp["metrics"] = compute_metrics(comp)
        print(f"📈 {comp['channel_name']}: avg_views={comp['metrics']['avg_views']}, engagement={comp['metrics']['engagement_ratio']}%")

    print("🔑 Extracting keywords from competitor videos...")
    for comp in competitors_with_videos:
        comp["keywords"] = extract_competitor_keywords(comp)
        print(f"🔑 {comp['channel_name']}: {len(comp['keywords']['common_topics'])} topics found")

    print("🔍 Detecting content gaps...")
    gaps = detect_content_gaps(your_channel_data, competitors_with_videos)
    print(f"🔍 Content gaps found: {gaps['total_gaps_found']}")
    print(f"🔥 High priority gaps: {len(gaps['high_priority_gaps'])}")

    aggregated = {
        "avg_views_across_competitors": int(
            sum(c["metrics"]["avg_views"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1)
        ),
        "avg_likes_across_competitors": int(
            sum(c["metrics"]["avg_likes"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1)
        ),
        "avg_upload_frequency": round(
            sum(c["metrics"]["upload_frequency"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 2
        ),
        "avg_engagement_ratio": round(
            sum(c["metrics"]["engagement_ratio"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 2
        ),
        "avg_like_to_view_ratio": round(
            sum(c["metrics"]["like_to_view_ratio"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 2
        ),
        "avg_comments_to_views_ratio": round(
            sum(c["metrics"]["comments_to_views_ratio"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 2
        ),
        "avg_views_to_subscribers_ratio": round(
            sum(c["metrics"]["views_to_subscribers_ratio"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 4
        ),
        "avg_video_duration": round(
            sum(c["metrics"]["avg_duration_minutes"] for c in competitors_with_videos) /
            max(len(competitors_with_videos), 1), 2
        ),
        "best_performing_competitor": max(
            competitors_with_videos,
            key=lambda x: x["metrics"]["avg_views"]
        )["channel_name"] if competitors_with_videos else None,
        "most_engaging_competitor": max(
            competitors_with_videos,
            key=lambda x: x["metrics"]["engagement_ratio"]
        )["channel_name"] if competitors_with_videos else None
    }

    print(f"📊 Aggregated metrics: avg_views={aggregated['avg_views_across_competitors']}")

    all_competitor_topics = list(set(
        topic
        for comp in competitors_with_videos
        for topic in comp["keywords"]["common_topics"]
    ))

    high_performing_topics = list(set(
        topic
        for comp in competitors_with_videos
        for topic in comp["keywords"]["high_performing_keywords"]
    ))

    topic_clusters = _build_topic_clusters(competitors_with_videos)

    print(f"🔥 High priority content gaps: {[g['topic'] for g in gaps['high_priority_gaps']]}")
    print("✅ Analysis complete!")

    your_channel = your_channel_data.get("channel", {})
    your_summary = your_channel_data.get("summary", {})
    your_signals = your_channel_data.get("signals", {})

    return {
        "analysis_complete": True,
        "competitors_analyzed": len(competitors_with_videos),
        "competitors": competitors_with_videos,
        "aggregated_metrics": aggregated,
        "all_competitor_topics": all_competitor_topics,
        "high_performing_topics": high_performing_topics,
        "topic_clusters": topic_clusters,
        "content_gaps": gaps,
        "your_channel_summary": {
            "channel_name": your_channel.get("channel_name", ""),
            "subscribers": your_channel.get("subscribers", 0),
            "avg_views": your_summary.get("avg_views", 0),
            "avg_likes": your_summary.get("avg_likes", 0),
            "avg_comments": your_summary.get("avg_comments", 0),
            "upload_frequency": your_summary.get("upload_frequency", 0),
            "like_to_view_ratio": your_summary.get("like_to_view_ratio", 0),
            "comments_to_views_ratio": your_summary.get("comments_to_views_ratio", 0),
            "views_to_subscribers_ratio": your_summary.get("views_to_subscribers_ratio", 0),
            "your_topics": list(set(your_signals.get("all_keywords", [])))
        },
        "comparison": {
            "your_avg_views_vs_competitors": {
                "yours": your_summary.get("avg_views", 0),
                "competitors_avg": aggregated["avg_views_across_competitors"],
                "difference_percent": round(
                    (your_summary.get("avg_views", 0) -
                     aggregated["avg_views_across_competitors"]) /
                    max(aggregated["avg_views_across_competitors"], 1) * 100, 2
                )
            },
            "your_upload_frequency_vs_competitors": {
                "yours": your_summary.get("upload_frequency", 0),
                "competitors_avg": aggregated["avg_upload_frequency"]
            },
            "your_engagement_vs_competitors": {
                "yours": round(
                    (your_summary.get("avg_likes", 0) /
                     max(your_summary.get("avg_views", 1), 1)) * 100, 2
                ),
                "competitors_avg": aggregated["avg_engagement_ratio"]
            },
            "your_like_to_view_ratio_vs_competitors": {
                "yours": your_summary.get("like_to_view_ratio", 0),
                "competitors_avg": aggregated["avg_like_to_view_ratio"]
            },
            "your_comments_to_views_ratio_vs_competitors": {
                "yours": your_summary.get("comments_to_views_ratio", 0),
                "competitors_avg": aggregated["avg_comments_to_views_ratio"]
            },
            "your_views_to_subscribers_ratio_vs_competitors": {
                "yours": your_summary.get("views_to_subscribers_ratio", 0),
                "competitors_avg": aggregated["avg_views_to_subscribers_ratio"]
            }
        }
    }
