# SpyGlass: Autonomous Competitive Intelligence for Content Creators
**Product Requirements Document | v1.0**

**Project Domain**: AI / ML — PS3
**Hackathon**: Recursion 7.0 (March 2026)
**Team Size**: 4 people
**Stack**: Python (FastAPI) + React (Vite, Tailwind)
**Deploy**: Render (Backend) + Vercel (Frontend)
**Status**: In development (Frontend screens drafted, Backend pending)

---

## 1. Executive Summary
SpyGlass is an autonomous competitive intelligence platform designed for digital content creators. Given a YouTube channel URL, SpyGlass automatically discovers competing channels, extracts structured performance data, identifies content patterns and gaps, and generates a data-backed growth strategy — all without any manual research.

The core insight driving SpyGlass is that competitive analysis in the creator economy is currently manual, biased, and time-consuming. Creators either skip it entirely or rely on intuition. SpyGlass replaces guesswork with an end-to-end intelligence pipeline powered by the YouTube Data API, scikit-learn clustering, and the OpenRouter LLM APIs.

## 2. Problem Statement
### 2.1 Background
Success in the creator economy is increasingly determined by strategic positioning — understanding competitors, working topics, and audience gaps. However, competitive analysis today suffers from:
- **Manual competitor discovery**: Creators rely on intuition, missing non-obvious competitors.
- **Unstructured data**: Competitor information is scattered across platform UIs.
- **No strategic translation**: Creators struggle to convert data into actionable growth strategies.

### 2.2 Target Users
| User Type | Pain Point | How SpyGlass Helps |
| :--- | :--- | :--- |
| **Independent creator (10k–500k subs)** | No time or skills for manual research | Fully automated analysis in under 60 seconds |
| **Growing channel (1k–10k subs)** | Does not know who their real competitors are | Automatic competitor discovery by niche |
| **Content strategist / manager** | Manually compiling competitor data into spreadsheets | Structured JSON export and dashboard |

## 3. Goals & Success Metrics
### 3.1 Goals
- Deliver a fully functional, demo-ready web application within 24 hours.
- Demonstrate autonomous competitor discovery with zero manual input from the user.
- Generate at least 4 specific, data-anchored strategy recommendations per analysis.
- Complete end-to-end analysis (input to strategy output) in under 60 seconds.

### 3.2 Success Metrics
| Metric | Target | Priority |
| :--- | :--- | :--- |
| End-to-end analysis time | < 60 seconds | High |
| Competitors auto-discovered | 5–8 per channel | High |
| Strategy recommendations generated | >= 4 per run | High |
| YouTube API quota used per analysis | < 600 units | Medium |
| Frontend load time | < 2 seconds | Medium |
| False positive competitor rate | < 20% | Medium |

## 4. Scope
### 4.1 In Scope (MVP)
- Channel analysis given a YouTube channel URL or handle
- Automatic competitor discovery using keyword and niche matching
- Data extraction: titles, views, upload cadence, tags for input + competitor channels
- Pattern recognition: top-performing topics, posting frequency analysis, content clustering
- LLM-powered strategy generation with data-anchored recommendations
- Dashboard UI with competitor comparison charts and strategy cards
- Redis caching to preserve YouTube API quota
- User authentication (Supabase OAuth) and account management

### 4.2 Out of Scope
- Multi-platform support (TikTok, Instagram, X)
- Historical trend tracking and time-series analysis
- Real-time notifications or scheduled re-analysis
- Monetization and advertising strategy integration

## 5. System Architecture
SpyGlass is a decoupled monorepo with two independently deployed services communicating over HTTPS REST.

| Layer | Technology | Deployment | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + Tailwind | Vercel (CDN) | UI, charts, strategy cards |
| **Backend API** | Python 3.11 + FastAPI | Render (Docker) | Pipeline orchestration, API routing |
| **Database/Auth**| Supabase (Postgres + Auth) | Supabase Cloud | OAuth, user accounts, persistence |
| **AI / ML** | OpenRouter API + scikit-learn | Within backend | NLP, clustering, strategy generation |
| **Cache** | Redis 7 | Render add-on | YouTube API quota protection |
| **Data Source**| YouTube Data API v3 | External | Channel and video data |

## 6. Functional Requirements

### 6.1 Channel Analysis Engine
- **FR-01**: Accept a YouTube channel URL or @handle as input (High)
- **FR-02**: Resolve channel URL to a valid `channel_id` via YouTube API (High)
- **FR-03**: Fetch channel name, subscriber count, total views, creation date (High)
- **FR-04**: Fetch the 20 most recent videos with title, views, tags, `published_at` (High)
- **FR-05**: Extract primary niche keywords using TF-IDF on video titles and tags (High)
- **FR-06**: Return a structured `ChannelData` Pydantic model (High)

### 6.2 Competitor Discovery Module
- **FR-07**: Autonomously search YouTube for channels matching extracted niche keywords (High)
- **FR-08**: Filter results to channels within 0.1x–10x the input channel subscriber count (High)
- **FR-09**: Score similarity using keyword overlap + subscriber proximity + upload cadence (High)
- **FR-10**: Return the top 5–8 most similar channels with similarity scores (High)
- **FR-11**: Exclude the input channel from competitor results (High)
- **FR-12**: Handle edge case: fewer than 5 competitors found — return all available (Medium)

### 6.3 Data Extraction & Pattern Recognition
- **FR-13**: Fetch top 10 videos by view count for each competitor channel (High)
- **FR-14**: Compute average views per video for each channel (High)
- **FR-15**: Compute upload frequency (videos per week) for each channel (High)
- **FR-16**: Cluster video titles into topic groups using sentence-transformers (High)
- **FR-17**: Identify topics present in competitor channels but absent from input channel (High)
- **FR-18**: Identify topics where input channel underperforms vs competitors (Medium)
- **FR-19**: Return structured JSON with all metrics per channel (High)

### 6.4 Strategy Generation
- **FR-20**: Send structured analysis JSON to OpenRouter API with a strategy prompt (High)
- **FR-21**: Generate minimum 4 specific, actionable recommendations (High)
- **FR-22**: Each recommendation must cite a specific competitor channel by name (High)
- **FR-23**: Identify and return a list of content gaps (topics to target) (High)
- **FR-24**: Suggest an optimal upload frequency based on competitor data (Medium)
- **FR-25**: Return strategy output as structured Pydantic model (High)

### 6.5 Dashboard UI *(Currently Implemented in `frontend/src/screens/`)*
- **FR-26**: Channel URL input field with submit button and loading state (High)
- **FR-27**: Animated progress steps: Analyzing > Discovering > Generating (High)
- **FR-28**: Bar chart comparing average views per video across all channels (High)
- **FR-29**: Competitor profile cards with name, subs, similarity score (High)
- **FR-30**: Strategy recommendation cards (min 4), each with title and description (High)
- **FR-31**: Content gaps list with topic labels (High)
- **FR-32**: Responsive layout functional on 1280px+ screens (Medium)

### 6.6 Authentication & User Accounts
- **FR-33**: Integrate Supabase Auth for user login/signup via OAuth (Google/GitHub) (High)
- **FR-34**: Protect backend endpoints to only allow authenticated requests (High)
- **FR-35**: Store user profiles and link them to their analysis history in Supabase Postgres (Medium)

## 7. Non-Functional Requirements
- **Performance**: End-to-end analysis completes in < 60s
- **Caching**: YouTube API responses cached in Redis (1-hour TTL)
- **Reliability**: Meaningful error messages for invalid URLs, quota exhaustion, API failures
- **Security**: API keys stored as server-side environment variables only
- **CORS**: Backend allows requests only from `FRONTEND_URL`
- **Scalability**: Stateless backend design
- **Quota Safety**: < 600 YouTube API units per full analysis

## 8. API Contract
### 8.1 Endpoints
- `POST /analyze` - Triggers the full analysis pipeline for a given channel.
  - Body: `{ "channel_url": "https://youtube.com/@mkbhd" }`
  - Response: `AnalysisResult` JSON
- `GET /competitors/{channel_id}` - Returns cached competitor list for a previously analyzed channel.
- `GET /health` - Liveness check.

### 8.2 Core Schemas
- `ChannelInput`: `channel_url: str`
- `VideoStats`: `title`, `views`, `published_at`, `tags`
- `ChannelData`: `channel_id`, `name`, `subscriber_count`, `videos[]`
- `Competitor`: `channel_id`, `name`, `similarity_score`, `subscriber_count`
- `StrategyRecommendation`: `title`, `description`, `based_on`
- `AnalysisResult`: `input_channel`, `competitors[]`, `recommendations[]`, `content_gaps[]`

## 9. Environment Variables
- `YOUTUBE_API_KEY`: Google Cloud Console API key (Backend)
- `OPENROUTER_API_KEY`: OpenRouter API key (Backend)
- `REDIS_URL`: Redis connection string (Backend)
- `FRONTEND_URL`: Hosted frontend URL for CORS (Backend)
- `SUPABASE_URL`: Supabase project URL (Backend)
- `VITE_SUPABASE_URL`: Supabase project URL (Frontend)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (Frontend)
- `VITE_API_URL`: Backend API URL (Frontend)
