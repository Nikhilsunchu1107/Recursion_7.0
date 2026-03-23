import os
import re
import json
from collections import Counter
from datetime import datetime
from dotenv import load_dotenv
from services.youtube_service import extract_channel_id, load_from_cache, save_to_cache

load_dotenv()


def analyze_upload_timing(all_videos: list) -> dict:
    """Find when competitors post their videos."""
    print("📅 Analyzing upload timing...")
    try:
        if not all_videos:
            return {}

        days = []
        hours = []

        for v in all_videos:
            pub_at = v.get("published_at")
            if not pub_at:
                continue
            try:
                dt = datetime.fromisoformat(pub_at.replace("Z", "+00:00"))
                days.append(dt.strftime("%A"))
                hours.append(str(dt.hour))
            except ValueError:
                continue

        posting_heatmap = dict(Counter(days))
        hourly_heatmap = dict(Counter(hours))

        best_days = [day for day, _ in Counter(days).most_common(3)]
        best_hours = [f"{hour}:00" for hour, _ in Counter(hours).most_common(3)]

        insight_day = best_days[0] if best_days else "unknown"
        insight_hour = best_hours[0] if best_hours else "unknown"

        return {
            "best_days": best_days,
            "best_hours": best_hours,
            "posting_heatmap": posting_heatmap,
            "hourly_heatmap": hourly_heatmap,
            "total_videos_analyzed": len(all_videos),
            "insight": f"Best time to post is {insight_day} at {insight_hour}"
        }
    except Exception as e:
        print(f"❌ Error in analyze_upload_timing: {e}")
        return {}


def analyze_video_length(all_videos: list) -> dict:
    """Find what video duration gets the most views."""
    print("⏱️  Analyzing video length patterns...")
    try:
        if not all_videos:
            return {}

        buckets = {
            "0-5 min": [],
            "5-10 min": [],
            "10-20 min": [],
            "20+ min": []
        }

        total_duration = 0.0
        top_video = None
        max_views = -1

        for v in all_videos:
            dur = v.get("duration_minutes", 0.0)
            views = v.get("views", 0)
            total_duration += dur

            if dur < 5:
                buckets["0-5 min"].append(views)
            elif 5 <= dur < 10:
                buckets["5-10 min"].append(views)
            elif 10 <= dur < 20:
                buckets["10-20 min"].append(views)
            else:
                buckets["20+ min"].append(views)

            if views > max_views:
                max_views = views
                top_video = v

        duration_vs_views = {}
        best_duration_range = None
        highest_avg_views = -1

        for bucket_name, views_list in buckets.items():
            count = len(views_list)
            avg_views = int(sum(views_list) / max(count, 1))
            duration_vs_views[bucket_name] = {
                "video_count": count,
                "avg_views": avg_views
            }
            if avg_views > highest_avg_views and count > 0:
                highest_avg_views = avg_views
                best_duration_range = bucket_name

        avg_duration_minutes = round(total_duration / max(len(all_videos), 1), 2)
        top_video_duration = top_video.get("duration_minutes", 0.0) if top_video else 0.0

        return {
            "avg_duration_minutes": avg_duration_minutes,
            "best_duration_range": best_duration_range,
            "duration_vs_views": duration_vs_views,
            "top_video_duration": top_video_duration,
            "insight": f"Videos between {best_duration_range} get the highest average views ({highest_avg_views:,})"
        }
    except Exception as e:
        print(f"❌ Error in analyze_video_length: {e}")
        return {}


def analyze_title_patterns(all_videos: list) -> dict:
    """Find what title formats and structures perform best."""
    print("📝 Analyzing title patterns...")
    try:
        if not all_videos:
            return {}

        total_title_len = 0
        titles_with_numbers = 0
        titles_with_questions = 0
        titles_with_caps = 0
        how_to_titles = 0
        numbered_list_titles = 0
        starter_words = []

        videos_with_numbers = []
        videos_without_numbers = []

        for v in all_videos:
            title = v.get("title", "")
            title_lower = title.lower()
            total_title_len += len(title)

            has_number = bool(re.search(r'\d+', title))
            if has_number:
                titles_with_numbers += 1
                videos_with_numbers.append(v)
            else:
                videos_without_numbers.append(v)

            if "?" in title:
                titles_with_questions += 1
            if re.search(r'\b[A-Z]{2,}\b', title):
                titles_with_caps += 1
            if title_lower.startswith("how"):
                how_to_titles += 1
            if re.match(r'^\d+', title):
                numbered_list_titles += 1

            words = title_lower.split()
            if words:
                clean_first_word = re.sub(r'[^\w\s]', '', words[0])
                if clean_first_word:
                    starter_words.append(clean_first_word)

        avg_title_length = int(total_title_len / max(len(all_videos), 1))
        common_starter_words = [w for w, _ in Counter(starter_words).most_common(5)]

        sorted_by_views = sorted(all_videos, key=lambda v: v.get("views", 0), reverse=True)
        viral_title_examples = [v.get("title", "") for v in sorted_by_views[:5]]

        avg_views_with_numbers = int(sum(v.get("views", 0) for v in videos_with_numbers) / max(len(videos_with_numbers), 1))
        avg_views_without_numbers = int(sum(v.get("views", 0) for v in videos_without_numbers) / max(len(videos_without_numbers), 1))

        if avg_views_without_numbers > 0:
            numbers_boost_views_percent = round((avg_views_with_numbers - avg_views_without_numbers) / avg_views_without_numbers * 100, 1)
        else:
            numbers_boost_views_percent = 0.0

        insight_text = f"Titles with numbers get {numbers_boost_views_percent}% more views on average" if numbers_boost_views_percent > 0 else "Numbered titles do not show a massive boost."

        return {
            "avg_title_length": avg_title_length,
            "titles_with_numbers": titles_with_numbers,
            "titles_with_questions": titles_with_questions,
            "titles_with_caps": titles_with_caps,
            "how_to_titles": how_to_titles,
            "numbered_list_titles": numbered_list_titles,
            "common_starter_words": common_starter_words,
            "viral_title_examples": viral_title_examples,
            "numbers_boost_views_percent": numbers_boost_views_percent,
            "insight": insight_text
        }
    except Exception as e:
        print(f"❌ Error in analyze_title_patterns: {e}")
        return {}


def analyze_engagement_patterns(all_videos: list) -> dict:
    """Find what content drives the most engagement."""
    print("💬 Analyzing engagement patterns...")
    try:
        if not all_videos:
            return {}

        total_likes = sum(v.get("likes", 0) for v in all_videos)
        total_comments = sum(v.get("comments", 0) for v in all_videos)
        total_views = sum(v.get("views", 0) for v in all_videos)

        avg_engagement_rate = round((total_likes + total_comments) / max(total_views, 1) * 100, 2)
        likes_to_views_ratio = round(total_likes / max(total_views, 1), 3)
        comments_to_views_ratio = round(total_comments / max(total_views, 1), 3)

        # Calculate engagement rate per video
        for v in all_videos:
            v_likes = v.get("likes", 0)
            v_comments = v.get("comments", 0)
            v_views = v.get("views", 0)
            v["engagement_rate"] = round((v_likes + v_comments) / max(v_views, 1) * 100, 2)

        top_engaged_videos = sorted(all_videos, key=lambda v: v.get("engagement_rate", 0), reverse=True)[:5]
        top_viewed_videos = sorted(all_videos, key=lambda v: v.get("views", 0), reverse=True)[:5]

        stop_words = {"the", "a", "an", "is", "it", "to", "for", "of", "and", "in", "on", "at", "with", "how", "what", "why"}
        engaged_words = []
        for v in top_engaged_videos:
            title = v.get("title", "").lower()
            cleaned = re.sub(r'[^\w\s]', '', title)
            words = [w for w in cleaned.split() if w not in stop_words and len(w) > 3]
            engaged_words.extend(words)

        highest_engagement_topics = [w for w, _ in Counter(engaged_words).most_common(5)]
        topic_str = highest_engagement_topics[0] if highest_engagement_topics else "Certain topics"

        return {
            "avg_engagement_rate": avg_engagement_rate,
            "likes_to_views_ratio": likes_to_views_ratio,
            "comments_to_views_ratio": comments_to_views_ratio,
            "highest_engagement_topics": highest_engagement_topics,
            "top_engaged_videos": [
                {
                    "title": v.get("title"),
                    "views": v.get("views"),
                    "likes": v.get("likes"),
                    "engagement_rate": v.get("engagement_rate")
                } for v in top_engaged_videos
            ],
            "top_viewed_videos": [
                {
                    "title": v.get("title"),
                    "views": v.get("views")
                } for v in top_viewed_videos
            ],
            "insight": f"{topic_str.capitalize()} content drives highest engagement at {avg_engagement_rate}%"
        }
    except Exception as e:
        print(f"❌ Error in analyze_engagement_patterns: {e}")
        return {}


def analyze_trending_topics(competitors_with_keywords: list) -> list:
    """Find which topics appear most frequently and perform best across all competitors."""
    print("🔥 Analyzing trending topics...")
    try:
        topic_freq = {}  # topic -> count of competitors
        topic_views = {} # topic -> sum of views
        topic_videos = {} # topic -> count of videos

        overall_views = 0
        overall_vids = 0

        for comp in competitors_with_keywords:
            comp_topics = comp.get("keywords", {}).get("common_topics", [])
            for topic in comp_topics:
                topic_freq[topic] = topic_freq.get(topic, 0) + 1

            videos = comp.get("videos", [])
            overall_vids += len(videos)
            for v in videos:
                v_views = v.get("views", 0)
                overall_views += v_views
                title_lower = v.get("title", "").lower()
                for topic in comp_topics:
                    if topic in title_lower:
                        topic_views[topic] = topic_views.get(topic, 0) + v_views
                        topic_videos[topic] = topic_videos.get(topic, 0) + 1

        overall_avg_views = int(overall_views / max(overall_vids, 1))

        trending = []
        for topic, freq in topic_freq.items():
            t_views = topic_views.get(topic, 0)
            t_vids = topic_videos.get(topic, 0)
            avg_t_views = int(t_views / max(t_vids, 1))

            if freq >= 2 and avg_t_views > overall_avg_views:
                priority = "HIGH"
            elif freq >= 2 or avg_t_views > overall_avg_views:
                priority = "MEDIUM"
            else:
                priority = "LOW"

            trending.append({
                "topic": topic,
                "frequency": freq,
                "total_videos": t_vids,
                "avg_views": avg_t_views,
                "priority": priority
            })

        trending.sort(key=lambda t: (t["frequency"], t["avg_views"]), reverse=True)
        return trending[:20]
    except Exception as e:
        print(f"❌ Error in analyze_trending_topics: {e}")
        return []


def analyze_upload_frequency(competitors: list) -> dict:
    """Find how often competitors upload and who is most consistent."""
    print("📈 Analyzing upload frequency...")
    try:
        total_freq = 0
        breakdown = []
        most_active = None
        highest_freq = -1
        most_consistent = None
        highest_score = -1

        for comp in competitors:
            videos = comp.get("videos", [])
            c_name = comp.get("channel_name", "Unknown")

            dates = sorted([
                datetime.fromisoformat(v["published_at"].replace("Z", "+00:00"))
                for v in videos
                if v.get("published_at")
            ])

            if len(dates) >= 2:
                total_days = max((dates[-1] - dates[0]).days, 1)
                freq = round(len(videos) / (total_days / 7), 2)

                gaps = [(dates[i+1] - dates[i]).days for i in range(len(dates)-1)]
                avg_gap = sum(gaps) / max(len(gaps), 1)
                variance = sum((g - avg_gap)**2 for g in gaps) / max(len(gaps), 1)
                consistency = max(0, round(100 - min(variance, 100), 1))
            else:
                freq = 0.0
                consistency = 0.0

            total_freq += freq

            breakdown.append({
                "channel_name": c_name,
                "uploads_per_week": freq,
                "consistency_score": consistency
            })

            if freq > highest_freq:
                highest_freq = freq
                most_active = c_name

            if consistency > highest_score:
                highest_score = consistency
                most_consistent = c_name

        avg_uploads_per_week = round(total_freq / max(len(competitors), 1), 2)

        return {
            "avg_uploads_per_week": avg_uploads_per_week,
            "most_active_uploader": most_active or "Unknown",
            "most_consistent_uploader": most_consistent or "Unknown",
            "upload_frequency_breakdown": breakdown,
            "insight": f"Competitors upload {avg_uploads_per_week} videos/week on average. {most_active or 'None'} is most active."
        }
    except Exception as e:
        print(f"❌ Error in analyze_upload_frequency: {e}")
        return {}


def generate_actionable_insights(patterns: dict, your_channel_data: dict) -> list:
    """Generate human-readable actionable insights by comparing your channel against patterns."""
    print("💡 Generating actionable insights...")
    insights = []
    try:
        # Upload timing
        ut = patterns.get("upload_timing", {})
        best_days = ut.get("best_days", [])
        best_hours = ut.get("best_hours", [])
        if best_days and best_hours:
            insights.append(f"📅 Post on {best_days[0]} at {best_hours[0]} — competitors get highest engagement at this time")

        # Video length
        vl = patterns.get("video_length", {})
        best_range = vl.get("best_duration_range")
        if best_range and vl.get("duration_vs_views"):
            best_views = vl["duration_vs_views"].get(best_range, {}).get("avg_views", 0)
            insights.append(f"⏱️ Make videos {best_range} long — this range averages {best_views:,} views across competitors")

        # Title patterns
        tp = patterns.get("title_patterns", {})
        boost = tp.get("numbers_boost_views_percent", 0)
        if boost > 0:
            insights.append(f"📝 Add numbers to your titles — competitors with numbered titles get {boost}% more views")

        # Upload frequency
        uf = patterns.get("upload_frequency", {})
        comp_freq = uf.get("avg_uploads_per_week", 0)
        your_freq = your_channel_data.get("summary", {}).get("upload_frequency", 0)
        if your_freq < comp_freq:
            insights.append(f"📈 Increase upload frequency to {comp_freq} videos/week — you currently post {your_freq} (competitors average {comp_freq})")

        # Engagement
        ep = patterns.get("engagement", {})
        top_topics = ep.get("highest_engagement_topics", [])
        if top_topics:
            insights.append(f"🔥 Create content about {', '.join(top_topics[:3])} — these topics drive highest engagement")

        # Trending topics
        tt = patterns.get("trending_topics", [])
        high_priority = [t for t in tt if t.get("priority") == "HIGH"]
        if high_priority:
            topics_str = ", ".join([t["topic"] for t in high_priority[:3]])
            insights.append(f"🚀 Cover these trending topics: {topics_str} — high frequency + high views across competitors")

        return insights
    except Exception as e:
        print(f"❌ Error generating insights: {e}")
        return insights


def run_pattern_analysis(your_channel_data: dict, analysis_data: dict) -> dict:
    """Master function that runs all pattern analysis functions in sequence."""
    competitors = analysis_data.get("competitors", [])
    print(f"🔍 Running pattern analysis on {len(competitors)} competitors")

    all_videos = []
    for comp in competitors:
        videos = comp.get("videos", [])
        for v in videos:
            v["channel_name"] = comp["channel_name"]
        all_videos.extend(videos)

    print(f"🎬 Total videos for analysis: {len(all_videos)}")
    if not all_videos:
        raise ValueError("No video data found. Make sure Phase 4 analysis has been run with competitor videos.")

    upload_timing = analyze_upload_timing(all_videos)
    video_length = analyze_video_length(all_videos)
    title_patterns = analyze_title_patterns(all_videos)
    engagement = analyze_engagement_patterns(all_videos)
    trending_topics = analyze_trending_topics(competitors)
    upload_frequency = analyze_upload_frequency(competitors)

    patterns = {
        "upload_timing": upload_timing,
        "video_length": video_length,
        "title_patterns": title_patterns,
        "engagement": engagement,
        "trending_topics": trending_topics,
        "upload_frequency": upload_frequency
    }

    insights = generate_actionable_insights(patterns, your_channel_data)

    print(f"✅ Pattern analysis complete! {len(insights)} insights generated")
    
    # Safely get Best Posting Day/Hour considering empty dictionaries
    best_day = "Unknown"
    best_hour = "Unknown"
    if upload_timing and upload_timing.get("best_days"):
         best_day = upload_timing["best_days"][0]
    if upload_timing and upload_timing.get("best_hours"):
         best_hour = upload_timing["best_hours"][0]
         
    print(f"📊 Best posting day: {best_day}")
    print(f"⏱️  Best video length: {video_length.get('best_duration_range', 'Unknown')}")
    print(f"🔥 Top trending topic: {trending_topics[0]['topic'] if trending_topics else 'None'}")

    return {
        "pattern_analysis_complete": True,
        "competitors_analyzed": len(competitors),
        "total_videos_analyzed": len(all_videos),
        "patterns": patterns,
        "actionable_insights": insights,
        "your_channel": your_channel_data.get("channel", {}).get("channel_name", "Unknown"),
        "summary": {
            "best_posting_day": best_day,
            "best_posting_hour": best_hour,
            "best_video_length": video_length.get("best_duration_range", "Unknown"),
            "avg_competitor_engagement": engagement.get("avg_engagement_rate", 0),
            "top_trending_topic": trending_topics[0]["topic"] if trending_topics else "Unknown",
            "recommended_upload_frequency": upload_frequency.get("avg_uploads_per_week", 0)
        }
    }
