import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import { useAnalysis } from '../context/AnalysisContext';

function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export default function DashboardOverview() {
  const navigate = useNavigate();
  const {
    channelUrl, channelData, competitors, patterns,
    runAnalysisPipeline,
  } = useAnalysis();

  const [searchUrl, setSearchUrl] = useState(channelUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mergeCompetitorsWithMetrics = () => {
    const baseRows = competitors?.competitors || [];
    const analyzedRows = patterns?.competitors || [];

    if (!baseRows.length) return [];

    const analyzedMap = new Map(analyzedRows.map((row) => [row.channel_id, row]));
    return baseRows.map((row) => {
      const analyzed = analyzedMap.get(row.channel_id);
      return {
        ...row,
        metrics: analyzed?.metrics || row.metrics || null,
      };
    });
  };

  // Auto-run analysis pipeline when landing directly on dashboard.
  useEffect(() => {
    if (channelUrl && (!channelData || !competitors || !patterns) && !loading) {
      (async () => {
        setLoading(true);
        try {
          await runAnalysisPipeline(channelUrl, { includePatterns: true, includeStrategy: false });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelData, competitors, patterns, channelUrl, runAnalysisPipeline]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const trimmed = searchUrl.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      await runAnalysisPipeline(trimmed, {
        force: true,
        includePatterns: true,
        includeStrategy: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Derive stats from real data
  const channel = channelData?.channel || {};
  const compList = mergeCompetitorsWithMetrics();
  const aggregatedMetrics = patterns?.aggregated_metrics || {};
  const yourSummary = patterns?.your_channel_summary || channelData?.summary || {};

  const formatPercent = (value) => (value == null || isNaN(value) ? '—' : `${Number(value).toFixed(2)}%`);
  const formatRatio = (value) => (value == null || isNaN(value) ? '—' : Number(value).toFixed(3));

  const totalCompetitors = compList.length;
  const totalAnalyzedVideos = compList.reduce((acc, c) => acc + (c.metrics?.total_videos_analyzed || 0), 0);

  return (
    <>
      <SideNav />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-8">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="md:hidden text-lg font-black text-[#e2e2eb]">CS</h2>
            <form onSubmit={handleAnalyze} className="relative w-full max-w-2xl group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9ea0a3] group-focus-within:text-[#adc6ff] transition-colors">
                search
              </span>
              <input
                className="w-full bg-[#0c0e14] border-none rounded-full py-3 pl-12 pr-32 text-sm focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#9ea0a3]/50 text-[#e2e2eb]"
                placeholder="Enter your YouTube channel URL or niche keyword…"
                type="text"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-[#adc6ff]/20 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <a href="/profile" className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
              <span className="material-symbols-outlined">account_circle</span>
            </a>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="px-6 lg:px-12 mt-8 pb-12 space-y-8 w-full mx-auto">
          {/* Channel Name Banner */}
          {channel.channel_name && (
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#adc6ff]">tv</span>
              <span className="text-xl font-bold text-[#e2e2eb]">{channel.channel_name}</span>
              <span className="text-xs text-[#9ea0a3] bg-[#1e1f26] px-3 py-1 rounded-full">
                {formatNumber(channel.subscriber_count || channel.subscribers)} subscribers
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-[#adc6ff]/30 border-t-[#adc6ff] rounded-full animate-spin" />
              <p className="text-[#9ea0a3] text-sm animate-pulse">
                {competitors ? 'Re-analyzing channel...' : 'Discovering competitors...'}
              </p>
            </div>
          )}

          {/* Stat Cards Row */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Total Competitors Found</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">{totalCompetitors || '—'}</h3>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc6ff]" style={{ width: `${Math.min(totalCompetitors * 5, 100)}%` }} />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Avg Like-to-View</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">
                  {formatPercent(aggregatedMetrics.avg_like_to_view_ratio)}
                </h3>
                {totalAnalyzedVideos > 0 && <span className="text-[10px] text-[#9ea0a3] ml-2">({totalAnalyzedVideos} videos analyzed)</span>}
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#d0bcff] w-[45%]" />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Avg Comments-to-Views</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">
                  {formatPercent(aggregatedMetrics.avg_comments_to_views_ratio)}
                </h3>
                <span className="text-xs text-[#9ea0a3]">Competitor avg <br/>{totalAnalyzedVideos > 0 && <span className="text-[10px]">({totalAnalyzedVideos} videos analyzed)</span>}</span>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#a8edea] w-[80%]" />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Your Views-to-Subscribers</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#adc6ff]">
                  {formatRatio(yourSummary.views_to_subscribers_ratio)}
                </h3>
                <span className="material-symbols-outlined text-[#adc6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc6ff]/60 w-[88%]" />
              </div>
            </div>
          </div>

          {/* Competitor List Table */}
          <div className="bg-[#1e1f26] rounded-xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h4 className="text-lg font-bold text-[#e2e2eb]">Top Ranked Competitors</h4>
              <button
                onClick={() => navigate('/competitor_discovery')}
                className="text-xs font-bold text-[#adc6ff] hover:underline"
              >
                View All Intelligence
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-[#9ea0a3]/60">
                    <th className="px-6 py-4 font-bold">Channel Name</th>
                    <th className="px-6 py-4 font-bold">Subscribers</th>
                    <th className="px-6 py-4 font-bold">Avg Views</th>
                    <th className="px-6 py-4 font-bold">Like/View</th>
                    <th className="px-6 py-4 font-bold">Comments/View</th>
                    <th className="px-6 py-4 font-bold">Views/Subs</th>
                    <th className="px-6 py-4 font-bold">Relevance</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {compList.length === 0 && !loading && (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-[#9ea0a3]">
                        {channelData ? 'No competitors discovered yet.' : 'Analyze a channel to see competitors.'}
                      </td>
                    </tr>
                  )}
                  {compList.slice(0, 5).map((comp) => {
                    const score = comp.relevance_score ?? comp.similarity_score ?? 0;
                    const pct = Math.round(Math.min(score, 100));
                    const metrics = comp.metrics || {};
                    return (
                      <tr key={comp.channel_id || comp.channel_name} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm text-[#e2e2eb]">{comp.channel_name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{formatNumber(comp.subscriber_count || comp.subscribers)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{formatNumber(metrics.avg_views || comp.avg_views)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{formatPercent(metrics.like_to_view_ratio)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{formatPercent(metrics.comments_to_views_ratio)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{formatRatio(metrics.views_to_subscribers_ratio)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#adc6ff]">{pct}%</span>
                            <div className="flex-1 h-1 bg-white/10 rounded-full w-12">
                              <div className="h-full bg-[#adc6ff] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 rounded-lg hover:bg-[#adc6ff]/20 text-[#adc6ff] transition-all">
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts — keep structure, show placeholder until real data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views Comparison Bar Chart */}
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#9ea0a3]">Views Comparison</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#adc6ff]" />
                    <span className="text-[10px] font-bold text-[#c2c6d6]">Your Channel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d0bcff]" />
                    <span className="text-[10px] font-bold text-[#c2c6d6]">Top Competitor</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-48 gap-4 px-2">
                {(compList.length > 0 ? compList.slice(0, 4) : [{ channel_name: 'N/A' }, { channel_name: 'N/A' }, { channel_name: 'N/A' }, { channel_name: 'N/A' }]).map(
                  (c, i) => {
                    const cViews = c.metrics?.avg_views || c.avg_views || 0;
                    const maxV = Math.max(...compList.map(x => x.metrics?.avg_views || x.avg_views || 0), yourSummary.avg_views || 1, 1);
                    const h = cViews ? `${Math.max((cViews / maxV) * 100, 10)}%` : '15%';
                    return (
                      <div key={i} className="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
                        <div
                          className="w-full bg-[#adc6ff]/20 rounded-t-lg relative group-hover:bg-[#adc6ff]/30 transition-all"
                          style={{ height: h }}
                        >
                          <div className="absolute inset-x-0 bottom-0 bg-[#adc6ff] h-[80%] rounded-t-sm" />
                        </div>
                        <span className="text-[10px] font-medium text-[#9ea0a3] truncate max-w-full">{c.channel_name?.slice(0, 12) || `Ch ${i + 1}`}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Upload Frequency Line Chart */}
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#9ea0a3]">Upload Frequency Trend</h4>
                <span className="text-[10px] font-bold text-[#a8edea]">Live Monitoring</span>
              </div>
              <div className="relative h-48 w-full">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#adc6ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20 V100 H0 Z" fill="url(#lineGrad)" />
                  <path
                    d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20"
                    fill="none"
                    stroke="#adc6ff"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  {[[0, 80], [100, 60], [200, 30], [300, 70], [400, 20]].map(([cx, cy]) => (
                    <circle key={cx} cx={cx} cy={cy} fill="#adc6ff" r="3" />
                  ))}
                </svg>
                <div className="absolute bottom-0 w-full flex justify-between px-2">
                  {(compList.length > 0 ? compList.slice(0, 5).map(c => c.channel_name?.slice(0, 5) || '?') : ['Jan', 'Feb', 'Mar', 'Apr', 'May']).map((m) => (
                    <span key={m} className="text-[10px] font-medium text-[#9ea0a3]">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
