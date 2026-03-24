import React, { useEffect, useState } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export default function CompetitorDiscovery() {
  const { channelUrl, competitors, runCorePipeline } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchUrl, setSearchUrl] = useState(channelUrl || '');

  // Auto-load if context has channelUrl but no competitors
  useEffect(() => {
    if (channelUrl && !competitors && !loading) {
      fetchCompetitors(channelUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelUrl]);

  const fetchCompetitors = async (url) => {
    setLoading(true);
    setError(null);
    try {
      await runCorePipeline(url, { force: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchUrl.trim();
    if (trimmed) fetchCompetitors(trimmed);
  };

  const compList = competitors?.competitors || [];

  return (
    <>
      <SideNav />

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 ml-0 md:ml-64 bg-[#111319]/60 backdrop-blur-xl fixed top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]" style={{ maxWidth: 'calc(100% - 0px)' }}>
        <div className="flex items-center gap-4 flex-1">
          <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
          <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ea0a3] text-sm">
              search
            </span>
            <input
              className="w-full bg-[#0c0e14] border-none rounded-full py-2 pl-10 pr-24 text-sm focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#9ea0a3]/50 text-[#e2e2eb]"
              placeholder="Enter channel URL to discover competitors..."
              type="text"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'Discover'}
            </button>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-20 md:pb-12 ml-0 md:ml-64 min-h-screen px-6 lg:px-12">
        <section className="w-full mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">Competitor Discovery</h2>
              <p className="text-[#9ea0a3] max-w-lg">
                Identify top-performing channels within your niche and uncover the secrets behind their engagement velocity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9ea0a3] bg-[#1e1f26] px-3 py-1.5 rounded-lg">
                {compList.length} competitors found
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-[#adc6ff]/30 border-t-[#adc6ff] rounded-full animate-spin" />
              <p className="text-[#9ea0a3] text-sm animate-pulse">Discovering competitors...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && compList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <span className="material-symbols-outlined text-[#adc6ff]/30 text-7xl">search_check</span>
              <div>
                <p className="text-[#e2e2eb] text-xl font-bold">No Competitors Discovered Yet</p>
                <p className="text-[#9ea0a3] mt-2 max-w-md">
                  Enter a YouTube channel URL above or start from the Search page to discover competitors in your niche.
                </p>
              </div>
            </div>
          )}

          {/* Competitor Card Grid */}
          {!loading && compList.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
              {compList.map((comp, idx) => {
                const tags = comp.niche_keywords || comp.tags || [];
                return (
                  <div
                    key={comp.channel_id || comp.channel_name}
                    className="bg-[#1e1f26] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/20 group"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-[#0c0e14]">
                      <div className="w-full h-full bg-gradient-to-br from-[#adc6ff]/20 to-[#d0bcff]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-[#adc6ff]/30">smart_display</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1f26] via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-[#adc6ff] overflow-hidden bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center text-[#00285d] font-bold text-lg">
                          {comp.channel_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-[#e2e2eb] leading-tight">{comp.channel_name}</h3>
                          {comp.relevance_score != null && (
                            <p className="text-xs text-[#adc6ff] font-medium">
                              {Math.round(comp.relevance_score * 100)}% match
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0c0e14] rounded-lg p-3">
                          <p className="text-[10px] uppercase tracking-wider text-[#9ea0a3] font-bold mb-1">Subscribers</p>
                          <p className="text-xl font-bold text-[#e2e2eb]">{formatNumber(comp.subscriber_count || comp.subscribers)}</p>
                        </div>
                        <div className="bg-[#0c0e14] rounded-lg p-3">
                          <p className="text-[10px] uppercase tracking-wider text-[#9ea0a3] font-bold mb-1">Avg Views</p>
                          <p className="text-xl font-bold text-[#e2e2eb]">{formatNumber(comp.avg_views)}</p>
                        </div>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={tag}
                              className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                                i === 0
                                  ? 'bg-[#adc6ff]/10 text-[#adc6ff] border-[#adc6ff]/20'
                                  : i === 1
                                  ? 'bg-[#d0bcff]/10 text-[#d0bcff] border-[#d0bcff]/20'
                                  : 'bg-[#a8edea]/10 text-[#a8edea] border-[#a8edea]/20'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-[#9ea0a3]">
                        <span>{comp.video_count ? `${comp.video_count} videos` : ''}</span>
                        <span>{comp.upload_frequency ? `${comp.upload_frequency.toFixed(1)}/wk` : ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </>
  );
}
