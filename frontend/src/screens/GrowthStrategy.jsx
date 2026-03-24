import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import { useAnalysis } from '../context/AnalysisContext';
import { generateStrategy } from '../lib/api';

const priorityStyles = {
  high: { label: 'High Priority', classes: 'text-red-400 bg-red-400/10' },
  medium: { label: 'Medium', classes: 'text-[#a8edea] bg-[#a8edea]/10' },
  low: { label: 'Low', classes: 'text-[#9ea0a3] bg-white/10' },
};

const accentColors = ['text-[#adc6ff]', 'text-[#d0bcff]', 'text-[#a8edea]', 'text-[#adc6ff]'];
const iconPool = ['auto_awesome', 'hub', 'forum', 'campaign', 'trending_up', 'video_library'];

export default function GrowthStrategy() {
  const { channelUrl, strategy: ctxStrategy, setStrategy: setCtxStrategy } = useAnalysis();
  const [strategy, setStrategy] = useState(ctxStrategy || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelInput, setChannelInput] = useState(channelUrl || '');

  // Sync from context on mount
  useEffect(() => {
    if (ctxStrategy && !strategy) {
      setStrategy(ctxStrategy);
    }
  }, [ctxStrategy]);

  const fetchStrategy = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateStrategy(url);
      setStrategy(data);
      setCtxStrategy(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = strategy?.strategy?.recommendations || [];
  const topicClusters = strategy?.strategy?.topic_clusters || [];
  const contentGaps = strategy?.strategy?.content_gaps || [];
  const suggestedCadence = strategy?.strategy?.suggested_upload_frequency_per_week;

  return (
    <>
      <SideNav />

      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-12">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-6 bg-[#111319]/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
          <div className="flex items-center gap-4 flex-1">
            <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
            <form
              className="hidden md:flex items-center bg-[#0c0e14] rounded-full px-4 py-2 w-full max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                if (channelInput.trim()) fetchStrategy(channelInput.trim());
              }}
            >
              <span className="material-symbols-outlined text-[#9ea0a3] text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#9ea0a3]/50 text-[#e2e2eb] ml-2"
                placeholder="Enter YouTube channel URL to generate strategy..."
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="ml-2 bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-5 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </form>
          </div>
        </header>

        {/* Growth Content Canvas */}
        <div className="w-full mx-auto px-6 md:px-12 pt-8 md:pt-12 space-y-12">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Growth Strategy</h2>
            <p className="text-[#9ea0a3] mt-3 max-w-2xl text-lg">
              AI-curated recommendations based on cross-channel competitor performance and market velocity.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-[#adc6ff]/30 border-t-[#adc6ff] rounded-full animate-spin" />
              <p className="text-[#9ea0a3] text-sm animate-pulse">Analyzing competitors & generating AI strategy...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-red-400 text-3xl mb-2">error</span>
              <p className="text-red-400 font-bold text-lg">Strategy Generation Failed</p>
              <p className="text-[#9ea0a3] text-sm mt-2">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !strategy && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <span className="material-symbols-outlined text-[#adc6ff]/30 text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <div>
                <p className="text-[#e2e2eb] text-xl font-bold">No Strategy Generated Yet</p>
                <p className="text-[#9ea0a3] mt-2 max-w-md">
                  Enter a YouTube channel URL above and hit <strong>Generate</strong> to get AI-powered growth recommendations based on competitor analysis.
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && strategy && (
            <>
              {/* Channel Badge */}
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-[#adc6ff]">tv</span>
                <span className="text-[#e2e2eb] font-bold text-lg">{strategy.channel}</span>
                <span className="text-xs text-[#9ea0a3] bg-[#1e1f26] px-3 py-1 rounded-full">
                  Based on {strategy.competitor_count} competitors
                </span>
                {suggestedCadence && (
                  <span className="text-xs text-[#a8edea] bg-[#a8edea]/10 px-3 py-1 rounded-full font-bold">
                    📅 Suggested: {suggestedCadence} videos/week
                  </span>
                )}
              </div>

              {/* Topic Clusters */}
              {topicClusters.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-[#d0bcff] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      hub
                    </span>
                    <h3 className="text-2xl font-bold text-[#e2e2eb]">Topic Clusters</h3>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                    {topicClusters.map((cluster, i) => (
                      <div
                        key={i}
                        className="bg-[#1e1f26] p-6 rounded-2xl border border-white/5 hover:bg-[#282a30] transition-all hover:-translate-y-1"
                      >
                        <h4 className={`text-lg font-bold mb-2 ${accentColors[i % accentColors.length]}`}>
                          {cluster.topic_name}
                        </h4>
                        <p className="text-sm text-[#9ea0a3] leading-relaxed mb-4">{cluster.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(cluster.competitors_using_this || []).map((c) => (
                            <span key={c} className="text-[10px] font-bold text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-1 rounded-full">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Panel */}
              {recommendations.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-[#e2e2eb]">
                      <span className="material-symbols-outlined text-[#adc6ff] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                      </span>
                      Actionable Recommendations
                    </h3>
                    <span className="text-xs text-[#9ea0a3] font-bold uppercase tracking-wider bg-[#1e1f26] px-4 py-2 rounded-full">
                      AI Generated
                    </span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
                    {recommendations.map((rec, i) => {
                      const prio = priorityStyles[rec.priority?.toLowerCase()] || priorityStyles.medium;
                      const accent = accentColors[i % accentColors.length];
                      const icon = iconPool[i % iconPool.length];
                      return (
                        <div
                          key={i}
                          className="bg-[#1e1f26] p-8 rounded-2xl border border-white/5 flex flex-col h-full hover:bg-[#282a30] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(173,198,255,0.1)] group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                            <span className={`material-symbols-outlined text-3xl ${accent}`}>{icon}</span>
                          </div>
                          <h4 className="text-xl font-bold mb-3 text-[#e2e2eb]">{rec.title}</h4>
                          <p className="text-sm text-[#9ea0a3] mb-4 flex-grow leading-relaxed">{rec.description}</p>
                          {rec.based_on_competitor && (
                            <p className="text-xs text-[#d0bcff] mb-4">
                              📊 Based on: <span className="font-bold">{rec.based_on_competitor}</span>
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                            <span className={`px-4 py-1.5 ${prio.classes} text-[10px] font-black rounded-full uppercase tracking-widest`}>
                              {prio.label}
                            </span>
                            <button className={`${accent} material-symbols-outlined hover:translate-x-1 transition-transform`}>
                              arrow_forward
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Content Gaps */}
              {contentGaps.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-[#a8edea] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lightbulb
                    </span>
                    <h3 className="text-2xl font-bold text-[#e2e2eb]">Content Gaps</h3>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
                    {contentGaps.map((gap, i) => {
                      const accent = accentColors[i % accentColors.length];
                      const borderColor = accent.replace('text-', 'border-');
                      return (
                        <div
                          key={i}
                          className={`bg-[#1e1f26] rounded-2xl p-8 border-l-4 ${borderColor} relative overflow-hidden group shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
                        >
                          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                          <div className="flex items-center gap-2 mb-6">
                            <span className={`px-3 py-1 bg-white/5 ${accent} text-[10px] font-bold rounded uppercase tracking-wide`}>
                              🚀 {gap.demand_level?.toUpperCase() || 'HIGH'} DEMAND
                            </span>
                          </div>
                          <h4 className="text-2xl font-black mb-4 text-[#e2e2eb]">{gap.topic}</h4>
                          <p className="text-[#9ea0a3] text-sm leading-relaxed">{gap.reason}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
