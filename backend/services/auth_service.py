import os
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Service role key or anon key

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_KEY not set.")
    supabase_client: Client = None
else:
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the bearer token using Supabase and returns the user object.
    Also ensures the user profile is stored in the database.
    """
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Supabase not configured on the server")

    token = credentials.credentials
    try:
        # get_user() will validate the JWT with Supabase auth server
        user_response = supabase_client.auth.get_user(token)
        user = user_response.user
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Upsert the user profile into 'users' table (FR-35)
        user_id = user.id
        email = user.email
        
        # Store user profile snippet
        try:
            supabase_client.table('users').upsert({
                "id": user_id,
                "email": email,
                "last_sign_in": user.last_sign_in_at
            }).execute()
        except Exception as e:
            print(f"Error upserting user profile: {e}")
            # Non-fatal error for hackathon scope
            pass

        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {str(e)}")
