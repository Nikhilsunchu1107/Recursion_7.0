import re
from collections import Counter
from datetime import datetime
from typing import List


def _parse_duration_minutes(duration_str: str) -> float:
    """Parse an ISO 8601 duration or HH:MM:SS string to minutes."""
    # Try HH:MM:SS format (from isodate.parse_duration str output)
    parts = duration_str.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 60 + int(m) + int(s) / 60
    if len(parts) == 2:
        m, s = parts
        return int(m) + int(s) / 60

    # Try ISO 8601 PT format (e.g. PT12M34S)
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


def analyze_patterns(competitors: list) -> dict:
    """
    Analyze content patterns across competitor channels.

    Returns:
        avg_upload_frequency: videos per week
        avg_video_length_minutes: average length in minutes
        best_posting_days: most common posting days
        top_keywords: top topic keywords from titles
        viral_title_examples: top 5 viral titles by view count
    """
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

    # --- Average upload frequency (videos per week) ---
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

    # --- Average video length ---
    durations = [_parse_duration_minutes(v["duration"]) for v in all_videos]
    durations = [d for d in durations if d > 0]
    avg_video_length = round(sum(durations) / len(durations), 2) if durations else 0.0

    # --- Best posting days ---
    day_counter = Counter()
    for v in all_videos:
        try:
            dt = datetime.fromisoformat(v["published_date"].replace("Z", "+00:00"))
            day_counter[dt.strftime("%A")] += 1
        except Exception:
            continue

    best_posting_days = [day for day, _ in day_counter.most_common(3)]

    # --- Top keywords ---
    titles = [v["title"] for v in all_videos]
    top_keywords = _extract_keywords(titles)

    # --- Viral title examples (top 5 by views) ---
    sorted_videos = sorted(all_videos, key=lambda v: v.get("views", 0), reverse=True)
    viral_title_examples = [v["title"] for v in sorted_videos[:5]]

    return {
        "avg_upload_frequency": avg_upload_frequency,
        "avg_video_length_minutes": avg_video_length,
        "best_posting_days": best_posting_days,
        "top_keywords": top_keywords,
        "viral_title_examples": viral_title_examples,
    }
