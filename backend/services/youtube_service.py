import os
import re
import json
import isodate
import requests
from collections import Counter
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

CACHE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "cache.json")


def get_youtube_client():
    return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)


# ---------------------------------------------------------------------------
# Core pipeline functions
# ---------------------------------------------------------------------------

def extract_channel_id(url: str) -> str:
    """
    Extract channel ID from YouTube URL.
    Handles:
      - https://www.youtube.com/@handle
      - https://www.youtube.com/channel/UCxxxxxx
    """
    # Direct channel ID format
    match = re.search(r"/channel/(UC[\w-]+)", url)
    if match:
        return match.group(1)

    # @handle format
    match = re.search(r"/@([\w.-]+)", url)
    if match:
        handle = match.group(1)
        try:
            youtube = get_youtube_client()
            response = youtube.search().list(
                part="snippet",
                q=f"@{handle}",
                type="channel",
                maxResults=1,
            ).execute()
            items = response.get("items", [])
            if items:
                return items[0]["snippet"]["channelId"]
        except HttpError as e:
            if e.resp.status == 403:
                raise ValueError("YouTube API quota exceeded. Please try again tomorrow.")
            raise ValueError(f"YouTube API error: {e}")

    raise ValueError(f"Could not extract channel ID from URL: {url}")


def get_uploads_playlist_id(channel_id: str) -> dict:
    """Return channel info + uploads playlist ID."""
    try:
        youtube = get_youtube_client()
        response = youtube.channels().list(
            part="snippet,statistics,contentDetails",
            id=channel_id,
        ).execute()

        items = response.get("items", [])
        if not items:
            raise ValueError(f"Channel not found. Please check the URL.")

        channel = items[0]
        snippet = channel["snippet"]
        stats = channel["statistics"]
        content = channel["contentDetails"]

        return {
            "channel_id": channel_id,
            "channel_name": snippet["title"],
            "description": snippet.get("description", ""),
            "subscribers": int(stats.get("subscriberCount", 0)),
            "total_views": int(stats.get("viewCount", 0)),
            "video_count": int(stats.get("videoCount", 0)),
            "uploads_playlist_id": content["relatedPlaylists"]["uploads"],
        }
    except HttpError as e:
        if e.resp.status == 403:
            raise ValueError("YouTube API quota exceeded. Please try again tomorrow.")
        if e.resp.status == 404:
            raise ValueError("Channel not found. Please check the URL.")
        raise


def get_video_ids(playlist_id: str, max_results: int = 20) -> list:
    """Return list of dicts with video_id and title from a playlist."""
    try:
        youtube = get_youtube_client()
        video_items = []
        next_page_token = None

        while len(video_items) < max_results:
            playlist_response = youtube.playlistItems().list(
                part="contentDetails,snippet",
                playlistId=playlist_id,
                maxResults=min(max_results - len(video_items), 50),
                pageToken=next_page_token,
            ).execute()

            for item in playlist_response.get("items", []):
                video_items.append({
                    "video_id": item["contentDetails"]["videoId"],
                    "title": item["snippet"]["title"],
                })

            next_page_token = playlist_response.get("nextPageToken")
            if not next_page_token:
                break

        return video_items
    except HttpError as e:
        if e.resp.status == 403:
            raise ValueError("YouTube API quota exceeded. Please try again tomorrow.")
        raise


def get_video_stats(video_ids: list) -> list:
    """Return views, likes, comments, duration, published_at per video."""
    if not video_ids:
        return []

    try:
        youtube = get_youtube_client()
        videos = []

        # video_ids can be a list of strings or list of dicts
        ids = []
        for v in video_ids:
            if isinstance(v, dict):
                ids.append(v["video_id"])
            else:
                ids.append(v)

        for i in range(0, len(ids), 50):
            batch = ids[i : i + 50]
            video_response = youtube.videos().list(
                part="snippet,statistics,contentDetails",
                id=",".join(batch),
            ).execute()

            for item in video_response.get("items", []):
                snippet = item["snippet"]
                stats = item.get("statistics", {})
                duration_iso = item["contentDetails"]["duration"]

                try:
                    duration = str(isodate.parse_duration(duration_iso))
                except Exception:
                    duration = duration_iso

                videos.append({
                    "video_id": item["id"],
                    "title": snippet["title"],
                    "views": int(stats.get("viewCount", 0)),
                    "likes": int(stats.get("likeCount", 0)),
                    "comments": int(stats.get("commentCount", 0)),
                    "duration": duration,
                    "published_at": snippet["publishedAt"],
                })

        return videos
    except HttpError as e:
        if e.resp.status == 403:
            raise ValueError("YouTube API quota exceeded. Please try again tomorrow.")
        raise


# ---------------------------------------------------------------------------
# Cache helpers
# ---------------------------------------------------------------------------

def load_from_cache(channel_id: str) -> dict | None:
    """Load cached channel data if it exists and is less than 24 hours old."""
    try:
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return None

    entry = cache.get(channel_id)
    if not entry:
        return None

    fetched_at = entry.get("fetched_at")
    if fetched_at:
        try:
            time_obj = datetime.fromisoformat(fetched_at)
            # Support both aware and naive logic matching the user prompt
            if time_obj.tzinfo:
                now = datetime.now(time_obj.tzinfo)
                if now - time_obj >= timedelta(hours=24):
                    return None
            else:
                if datetime.utcnow() - time_obj >= timedelta(hours=24):
                    return None
        except Exception:
            return None

    return entry


def save_to_cache(channel_id: str, data: dict):
    """Save channel data to cache."""
    try:
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        cache = {}

    data["fetched_at"] = datetime.utcnow().isoformat()
    cache[channel_id] = data

    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)


# ---------------------------------------------------------------------------
# Keyword extraction
# ---------------------------------------------------------------------------

STOP_WORDS = {
    "the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "is", "it",
    "how", "what", "why", "with", "your", "you", "my", "i", "we", "this",
    "that", "from", "or", "be", "are", "was",
}


def extract_keywords(titles: list) -> list:
    """
    Extract top 5 most relevant keywords from video titles.

    - Removes common stop words
    - Only keeps words longer than 3 characters
    - Returns top 5 by frequency, all lowercase
    """
    words = []
    for title in titles:
        cleaned = re.sub(r"[^\w\s]", " ", title.lower())
        for word in cleaned.split():
            if word not in STOP_WORDS and len(word) > 3:
                words.append(word)

    counter = Counter(words)
    return [word for word, _ in counter.most_common(5)]


# ---------------------------------------------------------------------------
# Upload frequency calculation
# ---------------------------------------------------------------------------

def calculate_upload_frequency(videos: list) -> float:
    """
    Calculate upload frequency in videos per week.

    Parses published_at dates (ISO 8601), finds time span between
    oldest and newest video, returns videos / weeks.
    """
    dates = []
    for v in videos:
        published = v.get("published_at") or v.get("published_date")
        if not published:
            continue
        try:
            dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
            dates.append(dt)
        except Exception:
            continue

    if len(dates) < 2:
        return 0.0

    dates.sort()
    total_days = (dates[-1] - dates[0]).days
    if total_days == 0:
        return 0.0

    videos_per_week = len(dates) / (total_days / 7)
    return round(videos_per_week, 2)


# ---------------------------------------------------------------------------
# Competitor filtering
# ---------------------------------------------------------------------------

def filter_competitors(competitors: list, your_channel: dict) -> list:
    """
    Filter out irrelevant competitors:
    - Exclude your own channel
    - Exclude channels with < 1000 subscribers
    - Exclude channels with 0 videos
    - Sort by subscribers descending
    """
    your_id = your_channel.get("channel_id", "")

    filtered = []
    for c in competitors:
        if c.get("channel_id") == your_id:
            continue
        if c.get("subscribers", 0) < 1000:
            continue
        if c.get("video_count", 0) == 0:
            continue
        filtered.append(c)

    filtered.sort(key=lambda c: c.get("subscribers", 0), reverse=True)
    return filtered


# ---------------------------------------------------------------------------
# Competitor discovery (main function)
# ---------------------------------------------------------------------------

def discover_competitors(channel_data: dict, max_results: int = 8, override_keyword: str = None) -> dict:
    """
    Main competitor discovery function.

    Steps:
      1. Extract keywords from your channel's video titles + description
      2. Search YouTube for competitor channels
      3. Fetch full details for each competitor
      4. Filter and return

    Returns dict with competitors list and keywords_used.
    """
    your_channel = channel_data.get("channel", {})
    videos = channel_data.get("videos", [])
    your_channel_id = your_channel.get("channel_id", "")

    # --- Step 1: Extract keywords ---
    if override_keyword:
        search_query = override_keyword
        keywords_used = override_keyword.split()
    else:
        titles = [v.get("title", "") for v in videos]

        # Also extract words from channel description
        description = your_channel.get("description", "")
        if description:
            titles.append(description)

        keywords = extract_keywords(titles)
        keywords_used = keywords[:3]
        search_query = " ".join(keywords_used)

    if not search_query.strip():
        print("[discover_competitors] No keywords found, skipping discovery")
        return {"competitors": [], "keywords_used": []}

    # --- Step 2: Search YouTube for competitor channels ---
    try:
        youtube = get_youtube_client()
        response = youtube.search().list(
            q=search_query,
            type="channel",
            part="id,snippet",
            maxResults=max_results + 2,
            order="relevance",
        ).execute()
    except HttpError as e:
        if e.resp.status == 403:
            print("[discover_competitors] Step 2 failed: YouTube API quota exceeded")
            raise ValueError("YouTube API quota exceeded. Please try again tomorrow.")
        print(f"[discover_competitors] Step 2 failed: {e}")
        return {"competitors": [], "keywords_used": keywords_used}

    # --- Step 3: Fetch full details for each competitor ---
    competitors = []
    for item in response.get("items", []):
        cid = item["id"].get("channelId") or item["snippet"].get("channelId")
        if not cid or cid == your_channel_id:
            continue

        try:
            details = get_uploads_playlist_id(cid)
            playlist_id = details.get("uploads_playlist_id")

            # Fetch latest 10 videos
            video_items = get_video_ids(playlist_id, max_results=10) if playlist_id else []
            video_stats = get_video_stats(video_items) if video_items else []

            details["videos"] = video_stats

            # Calculate avg_views
            if video_stats:
                total_views = sum(v.get("views", 0) for v in video_stats)
                details["avg_views"] = round(total_views / len(video_stats))
            else:
                details["avg_views"] = 0

            # Calculate upload_frequency
            details["upload_frequency"] = calculate_upload_frequency(video_stats)

            competitors.append(details)
        except Exception as e:
            print(f"[discover_competitors] Step 3 failed for channel {cid}: {e}")
            continue

    # --- Step 4: Filter and return ---
    filtered = filter_competitors(competitors, your_channel)
    final = filtered[:max_results]

    return {
        "competitors": final,
        "keywords_used": keywords_used,
    }


# ---------------------------------------------------------------------------
# Master pipeline
# ---------------------------------------------------------------------------

def build_channel_dataset(channel_url: str, niche_keyword: str = None) -> dict:
    """
    Master function: runs full pipeline for a channel and discovers competitors.

    1. Extract channel ID
    2. Get channel details
    3. Get video IDs and stats
    4. Discover competitors
    5. Save everything to cache
    """
    # Step 1
    channel_id = extract_channel_id(channel_url)

    # Check cache
    cached = load_from_cache(channel_id)
    if cached:
        return cached

    # Step 2
    channel_info = get_uploads_playlist_id(channel_id)
    playlist_id = channel_info.get("uploads_playlist_id")

    # Step 3
    video_items = get_video_ids(playlist_id, max_results=20) if playlist_id else []
    videos = get_video_stats(video_items) if video_items else []

    dataset = {
        "channel": channel_info,
        "videos": videos,
    }

    # Step 4 — Discover competitors
    discovery = discover_competitors(dataset, max_results=8, override_keyword=niche_keyword)
    dataset["competitors"] = discovery.get("competitors", [])
    dataset["keywords_used"] = discovery.get("keywords_used", [])

    # Step 5 — Save to cache
    save_to_cache(channel_id, dataset)

    return dataset


# ---------------------------------------------------------------------------
# Detailed Channel Endpoint Logic
# ---------------------------------------------------------------------------

def parse_duration(duration: str) -> float:
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match: return 0.0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return round(hours * 60 + minutes + seconds / 60, 2)


def get_channel_full_data(channel_url: str) -> dict:
    # Build complete detailed dataset via requests for one channel
    channel_id = extract_channel_id(channel_url)
    
    # Check cache first
    cached = load_from_cache(channel_id)
    if cached and "summary" in cached:
        fetched_at = datetime.fromisoformat(cached["fetched_at"])
        if datetime.utcnow() - fetched_at < timedelta(hours=24):
            return cached

    # Step 1 - Get channel Info
    try:
        channel_info = get_uploads_playlist_id(channel_id)
        uploads_playlist_id = channel_info.get("uploads_playlist_id")
    except ValueError as e:
        if "quota" in str(e).lower():
            raise ValueError("YouTube API quota exceeded. Try again tomorrow.")
        raise
        
    print(f"📋 Fetching videos from playlist: {uploads_playlist_id}")

    # Step 2 - Fetch Video IDs from Playlist using requests
    videos_url = "https://www.googleapis.com/youtube/v3/playlistItems"
    params = {
        "part": "snippet,contentDetails",
        "playlistId": uploads_playlist_id,
        "maxResults": 10,
        "key": YOUTUBE_API_KEY
    }
    
    try:
        res = requests.get(videos_url, params=params)
        res.raise_for_status()
        playlist_data = res.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            raise ValueError("YouTube API quota exceeded. Try again tomorrow.")
        raise ValueError(f"Failed to fetch playlist items")

    playlist_items = playlist_data.get("items", [])
    if not playlist_items:
        print("⚠️ Warning: No items found in playlist.")
        videos = []
    else:
        video_ids = [item["contentDetails"]["videoId"] for item in playlist_items]
        print(f"✅ Found {len(video_ids)} videos")

        # Step 3 - Fetch Video Stats in One Batch Call
        print(f"📊 Fetching stats for {len(video_ids)} videos...")
        stats_url = "https://www.googleapis.com/youtube/v3/videos"
        stats_params = {
            "part": "statistics,contentDetails",
            "id": ",".join(video_ids),
            "key": YOUTUBE_API_KEY
        }
        
        try:
            stats_res = requests.get(stats_url, params=stats_params)
            stats_res.raise_for_status()
            stats_data = stats_res.json()
            print("✅ Stats fetched successfully")
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                raise ValueError("YouTube API quota exceeded. Try again tomorrow.")
            raise ValueError(f"Failed to fetch video stats")

        # Step 4 - Combine Videos + Stats
        videos = []
        stats_map = {item["id"]: item for item in stats_data.get("items", [])}

        for item in playlist_items:
            try:
                video_id = item["contentDetails"]["videoId"]
                stats = stats_map.get(video_id, {}).get("statistics", {})
                content = stats_map.get(video_id, {}).get("contentDetails", {})
                
                videos.append({
                    "videoId": video_id,
                    "title": item["snippet"]["title"],
                    "publishedAt": item["contentDetails"]["videoPublishedAt"],
                    "thumbnail": item["snippet"]["thumbnails"].get("medium", {}).get("url", ""),
                    "views": int(stats.get("viewCount", 0)),
                    "likes": int(stats.get("likeCount", 0)),
                    "comments": int(stats.get("commentCount", 0)),
                    "duration_minutes": parse_duration(content.get("duration", "PT0S"))
                })
            except Exception as e:
                print(f"⚠️ Failed to parse stats for single video: {e}")
                continue

        videos.sort(key=lambda x: x["views"], reverse=True)

    # Step 5 - Build Summary
    summary = {
        "total_videos_fetched": len(videos),
        "avg_views": int(sum(v["views"] for v in videos) / len(videos)) if videos else 0,
        "avg_likes": int(sum(v["likes"] for v in videos) / len(videos)) if videos else 0,
        "avg_duration_minutes": round(sum(v["duration_minutes"] for v in videos) / len(videos), 2) if videos else 0.0,
        "top_video": videos[0] if videos else None
    }

    # Step 6 - Combine all into final response
    final_data = {
        "channel_id": channel_info["channel_id"],
        "channel_name": channel_info["channel_name"],
        "subscribers": channel_info["subscribers"],
        "total_views": channel_info["total_views"],
        "video_count": channel_info["video_count"],
        "uploads_playlist_id": channel_info["uploads_playlist_id"],
        "videos": videos,
        "summary": summary
    }

    # Step 7 - Save to Cache
    try:
        with open(CACHE_FILE, "r") as f:
            cache = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        cache = {}

    final_data["fetched_at"] = datetime.utcnow().isoformat()
    cache[channel_id] = final_data
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)
    print("💾 Saved to cache")

    return final_data
