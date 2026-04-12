import os
import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    supabase_client: Client = None
else:
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_analysis_history(user_id: str, channel_url: str, channel_id: str, full_data: dict) -> bool:
    """
    Saves the completely generated analysis (strategy, patterns, competitors) 
    back to Supabase linked to the user's profile.
    """
    if not supabase_client:
        print("⚠️ Supabase not configured. Cannot save history.")
        return False
        
    try:
        data = {
            "user_id": user_id,
            "channel_url": channel_url,
            "channel_id": channel_id,
            "analysis_data": full_data,
        }
        
        response = supabase_client.table("analysis_history").insert(data).execute()
        print(f"✅ Saved analysis history for user {user_id}")
        return True
    except Exception as e:
        print(f"❌ Error saving analysis history: {e}")
        return False
