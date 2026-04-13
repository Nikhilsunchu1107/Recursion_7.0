import os
import re
import json
import requests
from collections import Counter
from datetime import datetime, timedelta
from dotenv import load_dotenv

from services.cache_service import get_cache, set_cache
from services.tfidf_service import extract_tfidf_keywords

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

STOP_WORDS = {
    "the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "is", "it", 
    "how", "what", "why", "with", "your", "you", "my", "i", "we", "this", 
    "that", "from", "or", "be", "are", "was", "about", "our", "us", "all", 
    "more", "get", "can", "will", "have", "has", "just", "also", "new", 
    "out", "up", "so", "do", "its", "by", "but", "not", "if", "as", "into"
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_duration_to_minutes(duration: str) -> float:
    """Parse ISO 8601 duration string like PT8M30S to minutes float."""
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if not match: return 0.0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return round(hours * 60 + minutes + seconds / 60, 2)

def save_to_cache(channel_id: str, data: dict):
    """Save dataset to Redis cache with 1-hour TTL."""
    set_cache(channel_id, data, ttl_seconds=3600)

def load_from_cache(channel_id: str) -> dict | None:
    """Load from Redis cache."""
    return get_cache(channel_id)

def _extract_top_keywords(text: str, num: int = 5) -> list:
    """Helper to extract top N keywords from arbitrary text."""
    cleaned = re.sub(r'http\S+', '', text.lower())  # Remove URLs
    cleaned = re.sub(r'[^\w\s]', ' ', cleaned)      # Remove special chars
    
    words = []
    for word in cleaned.split():
        if word not in STOP_WORDS and len(word) > 3:
            words.append(word)
            
    counter = Counter(words)
    return [word for word, _ in counter.most_common(num)]


def _safe_ratio(numerator: float, denominator: float) -> float:
    if not denominator:
        return 0.0
    return numerator / denominator

# ---------------------------------------------------------------------------
# Phase 2.1 — URL → Channel ID
# ---------------------------------------------------------------------------

def extract_channel_id(url: str) -> str:
    print(f"🔍 Extracting channel ID from: {url}")
    
    # 1. Direct channel ID
    match = re.search(r"/channel/(UC[\w-]+)", url)
    if match:
        cid = match.group(1)
        print(f"✅ Channel ID: {cid}")
        return cid

    # 2. Raw channel ID
    if re.match(r"^UC[\w-]{22}$", url):
        print(f"✅ Channel ID: {url}")
        return url

    # 3. Handle or custom URL resolving
    search_query = None
    handle_match = re.search(r"/@([\w.-]+)", url)
    if handle_match:
        search_query = f"@{handle_match.group(1)}"
        
    name_match = re.search(r"/(?:c|user)/([\w.-]+)", url)
    if name_match:
        search_query = name_match.group(1)

    if search_query:
        search_url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": search_query,
            "type": "channel",
            "maxResults": 1,
            "key": YOUTUBE_API_KEY
        }
        try:
            res = requests.get(search_url, params=params)
            res.raise_for_status()
            data = res.json()
            items = data.get("items", [])
            if items:
                cid = items[0]["snippet"]["channelId"]
                print(f"✅ Channel ID: {cid}")
                return cid
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                raise Exception("YouTube API quota exceeded")
            raise Exception(f"Failed to search for channel ID: {e}")

    raise ValueError(f"Could not extract a valid YouTube Channel ID from URL: {url}")

# ---------------------------------------------------------------------------
# Phase 2.2 — Fetch Channel Info + Videos
# ---------------------------------------------------------------------------

def extract_from_description(description: str) -> dict:
    """Extract hashtags and keywords from text."""
    # Extract hashtags
    hashtags = re.findall(r'#(\w+)', description)
    description_hashtags = [f"#{h}" for h in hashtags]
    
    # Remove hashtags for keyword parsing
    desc_no_hash = re.sub(r'#\w+', '', description)
    description_keywords = _extract_top_keywords(desc_no_hash, 10)
    
    return {
        "description_hashtags": description_hashtags,
        "description_keywords": description_keywords
    }

def get_channel_full_data(channel_id: str, max_videos: int = 20) -> dict:
    print(f"📡 Fetching channel info...")
    
    # --- Step A: Fetch Channel Info ---
    channel_url = "https://www.googleapis.com/youtube/v3/channels"
    params = {
        "part": "snippet,statistics,contentDetails,brandingSettings,topicDetails",
        "id": channel_id,
        "key": YOUTUBE_API_KEY
    }
    try:
        res = requests.get(channel_url, params=params)
        res.raise_for_status()
        data = res.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            raise Exception("YouTube API quota exceeded")
        if e.response.status_code == 404:
            raise Exception("Channel not found")
        raise Exception(f"Failed to fetch channel info: {e}")

    items = data.get("items", [])
    if not items:
        raise Exception("Channel not found")

    channel_data = items[0]
    snippet = channel_data.get("snippet", {})
    statistics = channel_data.get("statistics", {})
    content = channel_data.get("contentDetails", {})
    branding = channel_data.get("brandingSettings", {}).get("channel", {})
    topics = channel_data.get("topicDetails", {}).get("topicCategories", [])

    channel_name = snippet.get("title", "")
    description = snippet.get("description", "")
    subscribers = int(statistics.get("subscriberCount", 0))
    
    print(f"✅ Channel: {channel_name} | Subs: {subscribers}")
    
    # Extract Branding Keywords
    keywords_raw = branding.get("keywords", "")
    channel_keywords = []
    if keywords_raw:
        # Hacky split that respects quotes, but simple split works for MVP
        channel_keywords = re.findall(r'"([^"]*)"|(\S+)', keywords_raw)
        channel_keywords = [g1 or g2 for g1, g2 in channel_keywords if (g1 or g2)]
    print(f"🏷️  Channel keywords: {channel_keywords}")
    
    # Extract Topic Categories
    topic_categories = []
    for t in topics:
        topic_name = t.split("/")[-1].replace("_", " ")
        topic_categories.append(topic_name)
        
    # --- Step B: Extract from description ---
    extracted = extract_from_description(description)
    description_hashtags = extracted["description_hashtags"]
    description_keywords = extracted["description_keywords"]
    print(f"#️⃣  Description hashtags: {description_hashtags}")

    # Build channel payload
    channel_info = {
        "channel_id": channel_id,
        "channel_name": channel_name,
        "description": description,
        "subscribers": subscribers,
        "total_views": int(statistics.get("viewCount",  0)),
        "video_count": int(statistics.get("videoCount", 0)),
        "country": snippet.get("country", "Unknown"),
        "uploads_playlist_id": content.get("relatedPlaylists", {}).get("uploads", ""),
        "channel_keywords": channel_keywords,
        "topic_categories": topic_categories,
        "description_hashtags": description_hashtags,
        "description_keywords": description_keywords
    }

    # --- Step C: Fetch Latest Videos from Playlist ---
    uploads_playlist_id = channel_info["uploads_playlist_id"]
    print(f"🎬 Fetching {max_videos} videos from playlist...")
    
    videos = []
    if uploads_playlist_id:
        videos_url = "https://www.googleapis.com/youtube/v3/playlistItems"
        v_params = {
            "part": "snippet,contentDetails",
            "playlistId": uploads_playlist_id,
            "maxResults": max_videos,
            "key": YOUTUBE_API_KEY
        }
        try:
            v_res = requests.get(videos_url, params=v_params)
            v_res.raise_for_status()
            v_data = v_res.json()
            
            for item in v_data.get("items", []):
                videos.append({
                    "video_id": item["contentDetails"]["videoId"],
                    "title": item["snippet"]["title"],
                    "published_at": item["contentDetails"]["videoPublishedAt"],
                    "thumbnail": item["snippet"]["thumbnails"].get("medium", {}).get("url", "")
                })
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                raise Exception("YouTube API quota exceeded")
            print(f"⚠️ Warning: Failed to fetch playlist items: {e}")

    print(f"✅ Got {len(videos)} video IDs")
    return {
        "channel": channel_info,
        "playlist_videos": videos
    }

# ---------------------------------------------------------------------------
# Phase 2.3 — Fetch Video Stats + Hashtags + Tags
# ---------------------------------------------------------------------------

def get_video_details(video_ids: list) -> dict:
    if not video_ids:
        return {}
        
    print(f"📊 Fetching stats + tags + hashtags for all videos...")
    stats_url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "statistics,contentDetails,snippet",
        "id": ",".join(video_ids),
        "key": YOUTUBE_API_KEY
    }
    
    try:
        res = requests.get(stats_url, params=params)
        res.raise_for_status()
        data = res.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            raise Exception("YouTube API quota exceeded")
        print(f"⚠️ Warning: Failed to fetch video stats: {e}")
        return {}

    stats_map = {}
    for item in data.get("items", []):
        try:
            vid = item["id"]
            stats = item.get("statistics", {})
            content = item.get("contentDetails", {})
            snippet = item.get("snippet", {})
            
            # Tags
            tags = snippet.get("tags", [])
            
            # Hashtags
            desc = snippet.get("description", "")
            hashtags = [f"#{h}" for h in re.findall(r'#(\w+)', desc)]
            
            title = snippet.get("title", "")
            
            stats_map[vid] = {
                "title": title,
                "published_at": snippet.get("publishedAt", ""),
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "comments": int(stats.get("commentCount", 0)),
                "duration_minutes": parse_duration_to_minutes(content.get("duration", "PT0S")),
                "tags": tags,
                "video_hashtags": hashtags
            }
        except Exception as e:
            print(f"⚠️ Single video parse failed, skipping: {e}")
            continue
            
    print(f"✅ Stats fetched for {len(stats_map)} videos")
    return stats_map

# ---------------------------------------------------------------------------
# Phase 2.4 — Build Combined Dataset
# ---------------------------------------------------------------------------

def build_channel_dataset(channel_url: str, max_videos: int = 20, niche_keyword: str = None) -> dict:
    # Step 1
    channel_id = extract_channel_id(channel_url)
    
    # Step 2
    cached = load_from_cache(channel_id)
    if cached:
        print("⚡ Returning fast cached result")
        return cached

    # Step 3
    full_data = get_channel_full_data(channel_id, max_videos)
    channel_info = full_data["channel"]
    playlist_videos = full_data["playlist_videos"]
    
    # Step 4
    video_ids = [v["video_id"] for v in playlist_videos]
    stats_map = get_video_details(video_ids)
    
    # Step 5 - Combine per video
    combined_videos = []
    
    all_hashtags = set(channel_info.get("description_hashtags", []))
    all_tags = set()
    title_words = []
    
    for video in playlist_videos:
        vid = video["video_id"]
        stats = stats_map.get(vid, {})
        
        c_video = {
            "video_id": vid,
            "title": video.get("title", ""),
            "published_at": video.get("published_at", ""),
            "thumbnail": video.get("thumbnail", ""),
            "views": stats.get("views", 0),
            "likes": stats.get("likes", 0),
            "comments": stats.get("comments", 0),
            "duration_minutes": stats.get("duration_minutes", 0.0),
            "tags": stats.get("tags", []),
            "video_hashtags": stats.get("video_hashtags", [])
        }
        
        # Accumulate signal data
        all_hashtags.update(c_video["video_hashtags"])
        all_tags.update(c_video["tags"])
        
        # Track title words for all_keywords
        title_cleaned = re.sub(r'[^\w\s]', ' ', c_video["title"].lower())
        title_words.extend([w for w in title_cleaned.split() if w not in STOP_WORDS and len(w) > 3])
            
        combined_videos.append(c_video)
        
    combined_videos.sort(key=lambda x: x["views"], reverse=True)
    
    # Compile top 15 all_keywords using corpus-level TF-IDF
    title_documents = [v.get("title", "") for v in combined_videos if v.get("title")]
    description_document = channel_info.get("description", "")
    corpus_documents = title_documents + ([description_document] if description_document else [])
    final_all_keywords = extract_tfidf_keywords(corpus_documents, 15)
    
    # Calculate most used tags/hashtags for summary
    hash_counter = Counter([h for v in combined_videos for h in v["video_hashtags"]])
    tag_counter = Counter([t for v in combined_videos for t in v["tags"]])
    
    most_used_hashtags = [h for h, _ in hash_counter.most_common(5)]
    most_used_tags = [t for t, _ in tag_counter.most_common(5)]
    
    ordered_all_hashtags = list(all_hashtags)
    ordered_all_tags = list(all_tags)
    
    # --- Step 6: Build Signals ---
    # Top search query 1: Top 3 keywords
    query_1 = " ".join(final_all_keywords[:3]) if final_all_keywords else ""
    # Top search query 2: Top 2 hashtags
    query_2 = " ".join([h.replace("#", "") for h in most_used_hashtags[:2]]) if most_used_hashtags else ""
    # Top search query 3: First topic category
    query_3 = channel_info["topic_categories"][0] if channel_info.get("topic_categories") else ""
    # Top search query 4: top channel keyword + tutorial/review
    q4_base = channel_info["channel_keywords"][0] if channel_info.get("channel_keywords") else final_all_keywords[0] if final_all_keywords else ""
    
    # Guess if review or tutorial is more common
    rev_count = title_words.count("review")
    tut_count = title_words.count("tutorial")
    suffix = "review" if rev_count >= tut_count else "tutorial"
    query_4 = f"{q4_base} {suffix}".strip()
    
    # Top search query 5: top tag + top keyword
    t_tag = most_used_tags[0] if most_used_tags else ""
    t_key = final_all_keywords[0] if final_all_keywords else ""
    query_5 = f"{t_tag} {t_key}".strip()
    
    top_search_queries = [q for q in [query_1, query_2, query_3, query_4, query_5] if q]
    
    signals = {
        "all_hashtags": ordered_all_hashtags,
        "all_tags": ordered_all_tags,
        "all_keywords": final_all_keywords,
        "channel_keywords": channel_info.get("channel_keywords", []),
        "topic_categories": channel_info.get("topic_categories", []),
        "top_search_queries": top_search_queries
    }
    
    print(f"🔗 Signals built: {len(signals['all_hashtags'])} hashtags | {len(signals['all_tags'])} tags | {len(signals['all_keywords'])} keywords")
    print(f"🔎 Top search queries for competitor discovery: {signals['top_search_queries']}")

    # --- Step 7: Build Summary ---
    total_videos = len(combined_videos)
    total_views = sum(v["views"] for v in combined_videos)
    total_likes = sum(v["likes"] for v in combined_videos)
    total_comments = sum(v["comments"] for v in combined_videos)

    avg_views = int(total_views / total_videos) if combined_videos else 0
    avg_likes = int(total_likes / total_videos) if combined_videos else 0
    avg_comments = int(total_comments / total_videos) if combined_videos else 0

    published_dates = sorted([
        datetime.fromisoformat(v["published_at"].replace("Z", "+00:00"))
        for v in combined_videos
        if v.get("published_at")
    ])

    if len(published_dates) >= 2:
        span_days = max((published_dates[-1] - published_dates[0]).days, 1)
        upload_frequency = round(total_videos / (span_days / 7), 2)
    else:
        upload_frequency = 0.0

    summary = {
        "total_videos_fetched": total_videos,
        "avg_views": avg_views,
        "avg_likes": avg_likes,
        "avg_comments": avg_comments,
        "avg_duration_minutes": round(sum(v["duration_minutes"] for v in combined_videos) / total_videos, 2) if combined_videos else 0,
        "upload_frequency": upload_frequency,
        "like_to_view_ratio": round(_safe_ratio(total_likes, total_views) * 100, 2),
        "comments_to_views_ratio": round(_safe_ratio(total_comments, total_views) * 100, 2),
        "views_to_subscribers_ratio": round(_safe_ratio(avg_views, channel_info.get("subscribers", 0)), 4),
        "top_video": combined_videos[0] if combined_videos else None,
        "most_used_hashtags": most_used_hashtags,
        "most_used_tags": most_used_tags
    }
    
    # Clean up channel payload before returning
    _ = channel_info.pop("description_hashtags", None)
    _ = channel_info.pop("description_keywords", None)

    # --- Step 8: Build and return dataset ---
    dataset = {
        "fetched_at": datetime.utcnow().isoformat(),
        "channel": channel_info,
        "videos": combined_videos,
        "signals": signals,
        "summary": summary
    }
    
    # --- Step 9: Save to Cache ---
    save_to_cache(channel_id, dataset)
    print(f"💾 Dataset saved to cache")
    
    return dataset

# ---------------------------------------------------------------------------
# Phase 3 — Fetch Competitor Videos (FR-13 to FR-15)
# ---------------------------------------------------------------------------

def fetch_videos_for_competitors(competitors: list, max_videos: int = 10) -> list:
    """Fetch the most recent videos and their stats for a list of competitor channels."""
    if not competitors:
        return []

    print(f"🎬 Fetching recent videos for {len(competitors)} competitors...")
    channel_ids = [c["channel_id"] for c in competitors]
    
    # 1. Get upload playlist IDs for all competitors (in batches of 50)
    uploads_playlists = {}
    channels_url = "https://www.googleapis.com/youtube/v3/channels"
    
    for i in range(0, len(channel_ids), 50):
        batch = channel_ids[i:i + 50]
        params = {
            "part": "contentDetails",
            "id": ",".join(batch),
            "key": YOUTUBE_API_KEY
        }
        try:
            res = requests.get(channels_url, params=params)
            res.raise_for_status()
            data = res.json()
            for item in data.get("items", []):
                pid = item.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads")
                if pid:
                    uploads_playlists[item["id"]] = pid
        except Exception as e:
            print(f"⚠️ Failed to fetch playlists for batch: {e}")

    # 2. Fetch video IDs from each playlist
    all_video_ids = []
    comp_videos_map = {cid: [] for cid in channel_ids}
    
    playlist_url = "https://www.googleapis.com/youtube/v3/playlistItems"
    for cid in channel_ids:
        pid = uploads_playlists.get(cid)
        if not pid:
            continue
            
        params = {
            "part": "contentDetails,snippet",
            "playlistId": pid,
            "maxResults": max_videos,
            "key": YOUTUBE_API_KEY
        }
        try:
            res = requests.get(playlist_url, params=params)
            res.raise_for_status()
            data = res.json()
            for item in data.get("items", []):
                vid = item["contentDetails"]["videoId"]
                all_video_ids.append(vid)
                comp_videos_map[cid].append({
                    "video_id": vid,
                    "title": item["snippet"]["title"],
                    "published_at": item["contentDetails"]["videoPublishedAt"],
                    "thumbnail": item["snippet"]["thumbnails"].get("medium", {}).get("url", "")
                })
        except Exception as e:
            print(f"⚠️ Failed to fetch videos for channel {cid}: {e}")

    # 3. Batch fetch video stats
    # get_video_details takes a list of IDs and batches them internally?
    # Wait, the current get_video_details joins video_ids. YouTube API max length is 50 for ids.
    # Let's batch all_video_ids in groups of 50
    stats_map = {}
    for i in range(0, len(all_video_ids), 50):
        batch = all_video_ids[i:i + 50]
        batch_stats = get_video_details(batch)
        stats_map.update(batch_stats)
        
    # 4. Attach videos and stats to competitors
    enriched_competitors = []
    for c in competitors:
        cid = c["channel_id"]
        videos = comp_videos_map.get(cid, [])
        
        enriched_videos = []
        for v in videos:
            vid = v["video_id"]
            stats = stats_map.get(vid, {})
            v["views"] = stats.get("views", 0)
            v["likes"] = stats.get("likes", 0)
            v["comments"] = stats.get("comments", 0)
            v["duration_minutes"] = stats.get("duration_minutes", 0.0)
            v["tags"] = stats.get("tags", [])
            enriched_videos.append(v)
            
        # Reconstruct competitor with recent_videos
        c_copy = c.copy()
        c_copy["recent_videos"] = enriched_videos
        enriched_competitors.append(c_copy)
        
    print(f"✅ Extracted videos for {len(enriched_competitors)} competitors.")
    return enriched_competitors
