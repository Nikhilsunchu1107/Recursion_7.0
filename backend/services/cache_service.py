import os
import json
import redis
import time
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "fallback_cache.json")
os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

redis_client = None
try:
    # Attempt connection and ping to verify it's actively running
    client = redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=1, socket_connect_timeout=1)
    client.ping()
    redis_client = client
    print("✅ Connected to Redis cache.")
except Exception as e:
    print(f"⚠️ Redis unavailable. Using local file fallback cache. (Reason: {e})")

def _load_file_cache() -> dict:
    try:
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def _save_file_cache(cache: dict):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

def get_cache(key: str) -> dict | None:
    """Retrieve and deserialize JSON from Redis or fallback to local file."""
    if redis_client:
        try:
            data = redis_client.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            print(f"⚠️ Redis GET error for key '{key}': {e}")
            return None
    
    # Fallback to local file cache
    cache = _load_file_cache()
    entry = cache.get(key)
    if entry:
        expires_at = entry.get("__expires_at")
        if expires_at and time.time() > expires_at:
            # Token expired, clear it
            del cache[key]
            _save_file_cache(cache)
            return None
        return entry.get("data")
    return None

def set_cache(key: str, data: dict, ttl_seconds: int = 3600):
    """Serialize JSON and save it to Redis, or fallback to file system cache with manual TTL checking."""
    if redis_client:
        try:
            redis_client.setex(key, ttl_seconds, json.dumps(data))
        except Exception as e:
            print(f"⚠️ Redis SET error for key '{key}': {e}")
        return
        
    # Fallback to local file cache
    cache = _load_file_cache()
    cache[key] = {
        "__expires_at": time.time() + ttl_seconds,
        "data": data
    }
    _save_file_cache(cache)
