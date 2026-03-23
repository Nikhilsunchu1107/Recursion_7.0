import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const accentSets = [
  { border: 'border-[#adc6ff]', text: 'text-[#adc6ff]' },
  { border: 'border-[#d0bcff]', text: 'text-[#d0bcff]' },
  { border: 'border-[#a8edea]', text: 'text-[#a8edea]' },
];

export default function OpportunityGaps() {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelUrl, setChannelUrl] = useState('');
  const [channelName, setChannelName] = useState('');

  const fetchGaps = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/strategy/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_url: url }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch opportunity gaps');
      }
      const data = await res.json();
      setGaps(data?.strategy?.content_gaps || []);
      setChannelName(data?.channel || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideNav />
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-12">
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-6 bg-[#111319]/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
          <div className="flex items-center gap-4 flex-1">
            <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
            <form
              className="hidden md:flex items-center bg-[#0c0e14] rounded-full px-4 py-2 w-full max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                if (channelUrl.trim()) fetchGaps(channelUrl.trim());
              }}
            >
              <span className="material-symbols-outlined text-[#9ea0a3] text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#9ea0a3]/50 text-[#e2e2eb] ml-2"
                placeholder="Enter YouTube channel URL to find gaps..."
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-5 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap"
              >
                Analyze
              </button>
            </form>
          </div>
        </header>

        <div className="w-full mx-auto px-6 md:px-12 pt-8 md:pt-12 space-y-12">
          <div className="mb-4">
            <h2 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Opportunity Gaps</h2>
            <p className="text-[#9ea0a3] mt-3 max-w-2xl text-lg">
              Untapped content topics with high search velocity and low competitor coverage.
            </p>
            {channelName && (
              <p className="text-[#adc6ff] mt-2 text-sm font-bold">Analyzing: {channelName}</p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-[#adc6ff]/30 border-t-[#adc6ff] rounded-full animate-spin" />
              <p className="text-[#9ea0a3] text-sm animate-pulse">Scanning competitor landscape for content gaps...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-red-400 text-3xl mb-2">error</span>
              <p className="text-red-400 font-bold text-lg">Analysis Failed</p>
              <p className="text-[#9ea0a3] text-sm mt-2">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && gaps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <span className="material-symbols-outlined text-[#a8edea]/30 text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <div>
                <p className="text-[#e2e2eb] text-xl font-bold">No Gaps Discovered Yet</p>
                <p className="text-[#9ea0a3] mt-2 max-w-md">
                  Enter a YouTube channel URL above to discover untapped content opportunities that your competitors are capitalizing on.
                </p>
              </div>
            </div>
          )}

          {/* Gap Cards */}
          {!loading && gaps.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
              {gaps.map((gap, i) => {
                const accent = accentSets[i % accentSets.length];
                const demand = gap.demand_level?.toLowerCase() || 'medium';
                const demandLabel = demand === 'high' ? '🚀 High Demand' : demand === 'medium' ? '📈 Medium Demand' : '📊 Low Demand';
                return (
                  <div
                    key={i}
                    className={`bg-[#1e1f26] rounded-2xl p-8 border-l-4 ${accent.border} relative overflow-hidden group shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
                  >
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                    <div className="flex items-center gap-2 mb-6">
                      <span className={`px-3 py-1 bg-white/5 ${accent.text} text-[10px] font-bold rounded uppercase tracking-wide`}>
                        {demandLabel}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black mb-4 text-[#e2e2eb]">{gap.topic}</h4>
                    <p className="text-[#9ea0a3] text-sm leading-relaxed">{gap.reason}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
