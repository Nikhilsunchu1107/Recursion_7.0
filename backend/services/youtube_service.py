import os
import re
import isodate
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def get_youtube_client():
    return build("youtube", "v3", developerKey=YOUTUBE_API_KEY)


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

    raise ValueError(f"Could not extract channel ID from URL: {url}")


def get_channel_details(channel_id: str) -> dict:
    """Return name, subscribers, total views, video count, and uploads playlist ID."""
    youtube = get_youtube_client()
    response = youtube.channels().list(
        part="snippet,statistics,contentDetails",
        id=channel_id,
    ).execute()

    items = response.get("items", [])
    if not items:
        raise ValueError(f"Channel not found: {channel_id}")

    channel = items[0]
    snippet = channel["snippet"]
    stats = channel["statistics"]
    content = channel["contentDetails"]

    return {
        "channel_id": channel_id,
        "name": snippet["title"],
        "subscribers": int(stats.get("subscriberCount", 0)),
        "total_views": int(stats.get("viewCount", 0)),
        "video_count": int(stats.get("videoCount", 0)),
        "uploads_playlist_id": content["relatedPlaylists"]["uploads"],
    }


def get_channel_videos(playlist_id: str, max_results: int = 20) -> list:
    """Return title, views, likes, comments, duration, and published date for each video."""
    youtube = get_youtube_client()

    # Step 1: Get video IDs from the playlist
    video_ids = []
    next_page_token = None

    while len(video_ids) < max_results:
        playlist_response = youtube.playlistItems().list(
            part="contentDetails",
            playlistId=playlist_id,
            maxResults=min(max_results - len(video_ids), 50),
            pageToken=next_page_token,
        ).execute()

        for item in playlist_response.get("items", []):
            video_ids.append(item["contentDetails"]["videoId"])

        next_page_token = playlist_response.get("nextPageToken")
        if not next_page_token:
            break

    if not video_ids:
        return []

    # Step 2: Get detailed video info
    videos = []
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i : i + 50]
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
                "title": snippet["title"],
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "comments": int(stats.get("commentCount", 0)),
                "duration": duration,
                "published_date": snippet["publishedAt"],
            })

    return videos


def discover_competitors(keyword: str, max_results: int = 8) -> list:
    """Search for related channels by keyword."""
    youtube = get_youtube_client()
    response = youtube.search().list(
        part="snippet",
        q=keyword,
        type="channel",
        maxResults=max_results,
        order="relevance",
    ).execute()

    competitors = []
    for item in response.get("items", []):
        channel_id = item["snippet"]["channelId"]
        try:
            details = get_channel_details(channel_id)
            competitors.append(details)
        except Exception:
            continue

    return competitors
