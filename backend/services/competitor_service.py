import os
import re
import json
import requests
from collections import Counter
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

STOP_WORDS = {
    "the", "a", "an", "in", "on", "at", "to", "for", "of", "and", "is", "it",
    "how", "what", "why", "with", "your", "you", "my", "i", "we", "this",
    "that", "from", "or", "be", "are", "was", "about", "us", "all", "more",
    "get", "can", "will", "have", "has", "just", "also", "new", "out", "up",
    "so", "do", "its", "by", "but", "not", "if", "as", "into",
    "episode", "shorts", "video", "videos", "2026", "2025", "2024"
}

# Score thresholds
STRONG_THRESHOLD   = 70   # Strong competitor
MODERATE_THRESHOLD = 45   # Moderate competitor
MINIMUM_THRESHOLD  = 30   # Absolute minimum (fallback only)
MAX_COMPETITORS    = 20   # Maximum to return
MIN_COMPETITORS    = 5    # Minimum required
MIN_STRONG         = 3    # Minimum strong competitors required

# ---------------------------------------------------------------------------
# Function 1 — Build Master Keywords
# ---------------------------------------------------------------------------

def build_master_keywords(dataset: dict) -> list:
    """Build a weighted keyword pool from all available signals."""
    signals = dataset.get("signals", {})
    score_map = {}

    def add_terms(terms: list, weight: int):
        for term in terms:
            word = str(term).lower().strip()
            # Strip leading # for hashtags
            word = word.lstrip("#")
            # Skip stop words, short words, purely numeric strings
            if word in STOP_WORDS:
                continue
            if len(word) < 3:
                continue
            if word.isdigit():
                continue
            score_map[word] = score_map.get(word, 0) + weight

    # channel_keywords → weight 5
    add_terms(signals.get("channel_keywords", []), 5)
    # topic_categories → weight 4
    add_terms(signals.get("topic_categories", []), 4)
    # all_hashtags (strip #) → weight 3
    add_terms(signals.get("all_hashtags", []), 3)
    # all_tags → weight 3
    add_terms(signals.get("all_tags", []), 3)
    # all_keywords → weight 1
    add_terms(signals.get("all_keywords", []), 1)

    # Sort by score descending, return top 10
    sorted_kws = sorted(score_map.items(), key=lambda x: x[1], reverse=True)
    return [kw for kw, _ in sorted_kws[:10]]


# ---------------------------------------------------------------------------
# Function 2 — Build Search Queries
# ---------------------------------------------------------------------------

def build_search_queries(master_keywords: list, dataset: dict) -> list:
    """Build 5 diverse search queries to maximise competitor discovery coverage."""
    signals = dataset.get("signals", {})
    topic_categories = signals.get("topic_categories", [])

    queries = []

    # Query 1: top 3 keywords joined by space
    if len(master_keywords) >= 1:
        queries.append(" ".join(master_keywords[:3]))

    # Query 2: first topic category
    if topic_categories:
        queries.append(topic_categories[0])

    # Query 3: top keyword + "highlights"
    if master_keywords:
        queries.append(f"{master_keywords[0]} highlights")

    # Query 4: top keyword + "official channel"
    if master_keywords:
        queries.append(f"{master_keywords[0]} official channel")

    # Query 5: second + third keyword
    if len(master_keywords) >= 3:
        queries.append(f"{master_keywords[1]} {master_keywords[2]}")

    # Deduplicate while preserving order
    seen = set()
    unique_queries = []
    for q in queries:
        q_stripped = q.strip()
        if q_stripped and q_stripped not in seen:
            seen.add(q_stripped)
            unique_queries.append(q_stripped)

    return unique_queries[:5]


# ---------------------------------------------------------------------------
# Function 3 — Search Channels by Query
# ---------------------------------------------------------------------------

def search_channels_by_query(query: str, max_results: int = 10) -> list:
    """Search YouTube for channels matching a query."""
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "id,snippet",
        "q": query,
        "type": "channel",
        "maxResults": max_results,
        "order": "relevance",
        "key": YOUTUBE_API_KEY
    }

    try:
        res = requests.get(url, params=params, timeout=15)
        if res.status_code == 403:
            raise Exception("YouTube API quota exceeded. Try again tomorrow.")
        res.raise_for_status()
        data = res.json()
    except Exception as e:
        if "quota exceeded" in str(e).lower():
            raise
        print(f"⚠️ Search failed for query '{query}': {e}")
        return []

    results = []
    for item in data.get("items", []):
        try:
            results.append({
                "channel_id": item["id"]["channelId"],
                "channel_name": item["snippet"]["title"],
                "description": item["snippet"].get("description", ""),
                "thumbnail": item["snippet"]["thumbnails"].get("medium", {}).get("url", "")
            })
        except (KeyError, TypeError) as e:
            print(f"⚠️ Skipping malformed search result item: {e}")
            continue

    return results


# ---------------------------------------------------------------------------
# Function 4 — Fetch Channel Stats (Batch)
# ---------------------------------------------------------------------------

def fetch_channel_stats(channel_ids: list) -> dict:
    """Fetch statistics for multiple channels in one batch API call."""
    if not channel_ids:
        return {}

    stats_map = {}
    url = "https://www.googleapis.com/youtube/v3/channels"

    # Batch in groups of 50
    for i in range(0, len(channel_ids), 50):
        batch = channel_ids[i:i + 50]
        params = {
            "part": "snippet,statistics,brandingSettings,topicDetails",
            "id": ",".join(batch),
            "key": YOUTUBE_API_KEY
        }

        try:
            res = requests.get(url, params=params, timeout=15)
            if res.status_code == 403:
                raise Exception("YouTube API quota exceeded. Try again tomorrow.")
            res.raise_for_status()
            data = res.json()
        except Exception as e:
            if "quota exceeded" in str(e).lower():
                raise
            print(f"⚠️ Batch stats fetch failed: {e}")
            continue

        for item in data.get("items", []):
            try:
                cid = item["id"]
                stats = item.get("statistics", {})
                branding = item.get("brandingSettings", {}).get("channel", {})
                topic_details = item.get("topicDetails", {})
                snippet = item.get("snippet", {})

                # Extract channel_keywords from brandingSettings
                keywords_raw = branding.get("keywords", "")
                channel_keywords = []
                if keywords_raw:
                    # Match quoted phrases or unquoted words
                    matches = re.findall(r'"([^"]*)"|\S+', keywords_raw)
                    # re.findall with one group returns str when that group matches; flatten
                    channel_keywords = [m.strip('"') for m in matches if m]

                # Extract topic_categories from topicDetails
                topic_categories = []
                for t in topic_details.get("topicCategories", []):
                    topic_name = t.split("/")[-1].replace("_", " ")
                    topic_categories.append(topic_name)

                stats_map[cid] = {
                    "subscribers": int(stats.get("subscriberCount", 0)),
                    "total_views": int(stats.get("viewCount", 0)),
                    "video_count": int(stats.get("videoCount", 0)),
                    "country": snippet.get("country", ""),
                    "channel_keywords": channel_keywords,
                    "topic_categories": topic_categories
                }
            except Exception as e:
                print(f"⚠️ Skipping channel stat parse error: {e}")
                continue

    return stats_map


# ---------------------------------------------------------------------------
# Function 5 — Apply Hard Filters
# ---------------------------------------------------------------------------

def apply_hard_filters(competitors: list, your_channel_id: str, your_subscribers: int) -> list:
    """Remove channels that are clearly not competitors."""
    filtered = []
    your_subs = max(your_subscribers, 1)

    for ch in competitors:
        cid = ch.get("channel_id", "")
        name = ch.get("channel_name", "Unknown")
        subs = ch.get("subscribers", 0)
        video_count = ch.get("video_count", 0)

        # Skip own channel
        if cid == your_channel_id:
            print(f"❌ {name} — own channel skipped ({subs} subs)")
            continue

        # Too small
        if subs < 1000:
            print(f"❌ {name} — too small ({subs} subs)")
            continue

        # Not active
        if video_count < 5:
            print(f"❌ {name} — not active enough ({video_count} videos)")
            continue

        ratio = subs / your_subs

        # Way too big
        if ratio > 50:
            print(f"❌ {name} — way too big ({subs} subs, ratio {ratio:.1f}x)")
            continue

        # Way too small
        if ratio < 0.02:
            print(f"❌ {name} — way too small ({subs} subs, ratio {ratio:.3f}x)")
            continue

        print(f"✅ {name} — PASSED ({subs} subs)")
        filtered.append(ch)

    return filtered


# ---------------------------------------------------------------------------
# Function 6 — Calculate Relevance Score
# ---------------------------------------------------------------------------

def calculate_relevance_score(competitor: dict, your_signals: dict, your_subscribers: int) -> dict:
    """Score each competitor out of 100 based on 4 criteria."""
    score = 0
    subscriber_proximity_score = 0
    keyword_overlap_score = 0
    topic_match_score = 0
    channel_keyword_match_score = 0

    # Criteria 1 — Subscriber Proximity (30 pts)
    ratio = competitor.get("subscribers", 0) / max(your_subscribers, 1)
    if 0.5 <= ratio <= 2.0:
        subscriber_proximity_score = 30
    elif 0.2 <= ratio <= 5.0:
        subscriber_proximity_score = 20
    elif 0.1 <= ratio <= 10:
        subscriber_proximity_score = 10
    else:
        subscriber_proximity_score = 5
    score += subscriber_proximity_score

    # Criteria 2 — Keyword Overlap in Description (25 pts)
    your_keywords = set(kw.lower() for kw in your_signals.get("all_keywords", []))
    your_channel_kws = set(kw.lower() for kw in your_signals.get("channel_keywords", []))
    all_your_keywords = your_keywords | your_channel_kws

    comp_desc_words = set(competitor.get("description", "").lower().split())
    overlap = len(all_your_keywords & comp_desc_words)

    if overlap >= 5:
        keyword_overlap_score = 25
    elif overlap >= 3:
        keyword_overlap_score = 18
    elif overlap >= 1:
        keyword_overlap_score = 10
    score += keyword_overlap_score

    # Criteria 3 — Topic Category Match (25 pts)
    your_topics = set(t.lower() for t in your_signals.get("topic_categories", []))
    comp_topics = set(t.lower() for t in competitor.get("topic_categories", []))
    topic_intersection = len(your_topics & comp_topics)
    if topic_intersection >= 2:
        topic_match_score = 25
    elif topic_intersection >= 1:
        topic_match_score = 15
    score += topic_match_score

    # Criteria 4 — Channel Keyword Match (20 pts)
    your_channel_kws_set = set(kw.lower() for kw in your_signals.get("channel_keywords", []))
    comp_channel_kws = set(kw.lower() for kw in competitor.get("channel_keywords", []))
    kw_match = len(your_channel_kws_set & comp_channel_kws)
    if kw_match >= 3:
        channel_keyword_match_score = 20
    elif kw_match >= 1:
        channel_keyword_match_score = 12
    score += channel_keyword_match_score

    # Verdict
    if score >= STRONG_THRESHOLD:
        competitor["verdict"] = "STRONG COMPETITOR"
        competitor["verdict_emoji"] = "🏆"
    elif score >= MODERATE_THRESHOLD:
        competitor["verdict"] = "MODERATE COMPETITOR"
        competitor["verdict_emoji"] = "✅"
    elif score >= MINIMUM_THRESHOLD:
        competitor["verdict"] = "WEAK COMPETITOR"
        competitor["verdict_emoji"] = "⚠️"
    else:
        competitor["verdict"] = "IRRELEVANT"
        competitor["verdict_emoji"] = "❌"

    competitor["relevance_score"] = score
    competitor["score_breakdown"] = {
        "subscriber_proximity": subscriber_proximity_score,
        "keyword_overlap": overlap,
        "topic_match": topic_match_score,
        "channel_keyword_match": kw_match,
        "total": score,
        "max_possible": 100,
        "percentage": f"{score}%"
    }

    return competitor


# ---------------------------------------------------------------------------
# Function 7 — Apply Score Filters
# ---------------------------------------------------------------------------

def apply_score_filters(ranked: list) -> dict:
    """Split ranked competitors into tiers and select strategy competitors."""

    # Tier 1 — Strong competitors
    strong = [c for c in ranked if c["relevance_score"] >= STRONG_THRESHOLD]

    # Tier 2 — Moderate competitors
    moderate = [c for c in ranked if MODERATE_THRESHOLD <= c["relevance_score"] < STRONG_THRESHOLD]

    # Tier 3 — Weak (kept for reference but NOT used in strategy)
    weak = [c for c in ranked if MINIMUM_THRESHOLD <= c["relevance_score"] < MODERATE_THRESHOLD]

    # Qualified = strong + moderate only
    qualified = strong + moderate

    print(f"🏆 STRONG competitors (score >= {STRONG_THRESHOLD}): {len(strong)}")
    print(f"✅ MODERATE competitors (score >= {MODERATE_THRESHOLD}): {len(moderate)}")
    print(f"⚠️  WEAK competitors (score >= {MINIMUM_THRESHOLD}): {len(weak)} — excluded from strategy")
    print(f"📊 Total qualified for strategy: {len(qualified)}")

    # Fallback — if not enough qualified competitors found
    # lower threshold temporarily to avoid empty results
    if len(qualified) < MIN_COMPETITORS:
        print(f"⚠️ Only {len(qualified)} qualified competitors found")
        print(f"⚠️ Lowering threshold to {MINIMUM_THRESHOLD} to find more...")
        qualified = [c for c in ranked if c["relevance_score"] >= MINIMUM_THRESHOLD]
        strong = [c for c in qualified if c["relevance_score"] >= STRONG_THRESHOLD]
        moderate = [c for c in qualified if MODERATE_THRESHOLD <= c["relevance_score"] < STRONG_THRESHOLD]
        weak = []

    # Strategy competitors — top 5 STRONG only
    # If less than 3 strong, supplement with top moderate
    strategy_competitors = strong[:5]
    if len(strategy_competitors) < MIN_STRONG:
        needed = MIN_STRONG - len(strategy_competitors)
        strategy_competitors += moderate[:needed]
        print(f"⚠️ Less than {MIN_STRONG} strong competitors — supplementing with {needed} moderate ones")

    print(f"🎯 Strategy will use: {len(strategy_competitors)} competitors")
    for c in strategy_competitors:
        print(f"   → {c['channel_name']} (score: {c['relevance_score']}, {c['verdict']})")

    return {
        "qualified": qualified[:MAX_COMPETITORS],
        "strong": strong,
        "moderate": moderate,
        "weak": weak,
        "strategy_competitors": strategy_competitors
    }


# ---------------------------------------------------------------------------
# Function 8 — Discover Competitors (Master Pipeline)
# ---------------------------------------------------------------------------

def discover_competitors(dataset: dict, max_results: int = 20) -> dict:
    """Master function that runs the full competitor discovery pipeline."""
    your_channel = dataset.get("channel", {})
    your_channel_id = your_channel.get("channel_id", "")
    your_channel_name = your_channel.get("channel_name", "")
    your_subscribers = your_channel.get("subscribers", 1)
    your_signals = dataset.get("signals", {})

    # Step 1: Build master keywords
    master_keywords = build_master_keywords(dataset)
    print(f"🔑 Master keywords: {master_keywords}")

    # Step 2: Build search queries
    search_queries = build_search_queries(master_keywords, dataset)
    print(f"🔎 Search queries: {search_queries}")

    # Step 3: Search for channels
    all_results_map = {}  # channel_id -> search result dict
    for i, query in enumerate(search_queries):
        print(f"📡 Searching query {i+1}/{len(search_queries)}: '{query}'")
        try:
            results = search_channels_by_query(query, max_results=10)
            for r in results:
                cid = r.get("channel_id")
                if cid and cid not in all_results_map:
                    all_results_map[cid] = r
        except Exception as e:
            if "quota exceeded" in str(e).lower():
                raise
            print(f"⚠️ No results or error for query '{query}': {e}")
            continue

    all_channel_ids = list(all_results_map.keys())
    print(f"🔍 Total unique channels found before filtering: {len(all_channel_ids)}")

    # Step 4: Batch fetch stats (batched in groups of 50)
    stats_map = fetch_channel_stats(all_channel_ids)

    # Step 5: Merge search results with stats
    merged = []
    for cid, search_data in all_results_map.items():
        stats = stats_map.get(cid, {})
        merged.append({
            "channel_id": cid,
            "channel_name": search_data.get("channel_name", ""),
            "description": search_data.get("description", ""),
            "thumbnail": search_data.get("thumbnail", ""),
            "subscribers": stats.get("subscribers", 0),
            "total_views": stats.get("total_views", 0),
            "video_count": stats.get("video_count", 0),
            "country": stats.get("country", ""),
            "channel_keywords": stats.get("channel_keywords", []),
            "topic_categories": stats.get("topic_categories", [])
        })

    # Step 6: Apply hard filters
    filtered = apply_hard_filters(merged, your_channel_id, your_subscribers)
    print(f"✅ Channels after hard filters: {len(filtered)}")

    # Step 7: Score each remaining channel
    print(f"📊 Scoring {len(filtered)} competitors...")
    scored = []
    for comp in filtered:
        try:
            scored_comp = calculate_relevance_score(comp, your_signals, your_subscribers)
            scored.append(scored_comp)
        except Exception as e:
            print(f"⚠️ Scoring failed for {comp.get('channel_name', 'Unknown')}: {e}")
            comp["relevance_score"] = 0
            comp["verdict"] = "IRRELEVANT"
            comp["verdict_emoji"] = "❌"
            comp["score_breakdown"] = {"total": 0, "max_possible": 100, "percentage": "0%"}
            scored.append(comp)

    # Step 8: Sort by relevance_score descending
    scored.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)

    # Step 9: Top max_results channels
    ranked = scored[:max_results]
    print(f"🏆 Top {len(ranked)} competitors ranked by relevance score")

    # Add rank field
    for idx, comp in enumerate(ranked):
        comp["rank"] = idx + 1

    # Step 10: Apply score filters
    print(f"🔍 Total raw channels from search: {len(all_channel_ids)}")
    print(f"✅ After hard filters: {len(filtered)}")
    tiers = apply_score_filters(ranked)

    print(f"🏆 STRONG (70+): {len(tiers['strong'])}")
    print(f"✅ MODERATE (45-69): {len(tiers['moderate'])}")
    print(f"⚠️  WEAK (30-44): {len(tiers['weak'])} — excluded")
    print(f"🎯 Strategy competitors: {[c['channel_name'] for c in tiers['strategy_competitors']]}")

    # Step 11: Return updated response shape
    return {
        # Channel info
        "your_channel": your_channel_name,
        "your_channel_id": your_channel_id,
        "your_subscribers": your_subscribers,

        # Discovery metadata
        "master_keywords_used": master_keywords,
        "search_queries_used": search_queries,
        "total_raw_found": len(all_channel_ids),
        "total_after_hard_filters": len(filtered),

        # Tier counts
        "total_qualified": len(tiers["qualified"]),
        "strong_count": len(tiers["strong"]),
        "moderate_count": len(tiers["moderate"]),
        "weak_count": len(tiers["weak"]),

        # Full qualified list for dashboard (strong + moderate only)
        "competitors": tiers["qualified"],

        # Top competitors for strategy generation (strong only)
        "strategy_competitors": tiers["strategy_competitors"],

        # Tier breakdown for frontend display
        "tiers": {
            "strong": tiers["strong"],
            "moderate": tiers["moderate"]
        },

        # Strategy ready data — pre-built summary of top competitors
        # This gets passed directly to strategy generation
        "strategy_ready_data": {
            "top_competitors": [
                {
                    "channel_name": c["channel_name"],
                    "subscribers": c["subscribers"],
                    "total_views": c["total_views"],
                    "video_count": c["video_count"],
                    "relevance_score": c["relevance_score"],
                    "verdict": c["verdict"]
                }
                for c in tiers["strategy_competitors"]
            ],
            "avg_subscribers": int(sum(c["subscribers"] for c in tiers["strategy_competitors"]) / max(len(tiers["strategy_competitors"]), 1)),
            "avg_total_views": int(sum(c["total_views"] for c in tiers["strategy_competitors"]) / max(len(tiers["strategy_competitors"]), 1)),
            "strongest_competitor": tiers["strategy_competitors"][0] if tiers["strategy_competitors"] else None,
            "total_strategy_competitors": len(tiers["strategy_competitors"])
        }
    }
