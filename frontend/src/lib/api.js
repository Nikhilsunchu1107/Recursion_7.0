import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(endpoint, options = {}) {
  let token = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token;
  } catch {
    // Supabase may not be configured — continue without auth
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`API error: ${response.status} - ${errorDetails}`);
  }

  return response.json();
}

// ─── Typed API helpers ──────────────────────────────────────────────

/** Analyze a YouTube channel and return channel dataset */
export function analyzeChannel(channelUrl) {
  return fetchWithAuth(`/channel/${encodeURIComponent(channelUrl)}`);
}

/** Discover competitors for a previously analyzed channel */
export function discoverCompetitors(channelUrl, maxResults = 20) {
  return fetchWithAuth('/competitors/discover', {
    method: 'POST',
    body: JSON.stringify({ channel_url: channelUrl, max_results: maxResults }),
  });
}

/** Analyze content patterns from competitor data */
export function analyzePatterns(competitors) {
  return fetchWithAuth('/patterns/analyze', {
    method: 'POST',
    body: JSON.stringify({ competitors }),
  });
}

/** Generate an AI growth strategy for a channel */
export function generateStrategy(channelUrl) {
  return fetchWithAuth('/strategy/generate', {
    method: 'POST',
    body: JSON.stringify({ channel_url: channelUrl }),
  });
}

/** Run the full analysis pipeline (requires channel + competitors in cache) */
export function runFullAnalysis(channelUrl) {
  return fetchWithAuth('/analysis/run', {
    method: 'POST',
    body: JSON.stringify({ channel_url: channelUrl }),
  });
}

/** Health check */
export function checkHealth() {
  return fetchWithAuth('/health');
}
