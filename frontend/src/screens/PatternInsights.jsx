import React, { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import { useAnalysis } from '../context/AnalysisContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultHeatmapRows = [
  { hour: '08:00', cells: ['bg-white/5', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/10', 'bg-[#adc6ff]/30', 'bg-white/5', 'bg-white/5'] },
  { hour: '12:00', cells: ['bg-[#adc6ff]/60', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/60', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/10'] },
  { hour: '16:00', cells: ['bg-[#adc6ff]/80', 'bg-[#adc6ff]', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]', 'bg-[#adc6ff]/90', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/30'] },
  { hour: '20:00', cells: ['bg-[#adc6ff]/40', 'bg-[#adc6ff]/60', 'bg-[#adc6ff]/30', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/10', 'bg-white/5'] },
];

const accentColors = ['text-[#adc6ff]', 'text-[#d0bcff]', 'text-[#a8edea]', 'text-[#adc6ff]'];

export default function PatternInsights() {
  const { channelUrl, patterns, runAnalysisPipeline } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (channelUrl && !patterns && !loading) {
      fetchPatterns();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelUrl]);

  const fetchPatterns = async () => {
    if (!channelUrl) {
      setError('Enter a channel URL in Dashboard first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await runAnalysisPipeline(channelUrl, {
        includePatterns: true,
        includeStrategy: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract data from analysis result
  const topicClusters = patterns?.topic_clusters || patterns?.pattern_analysis?.topic_clusters || [];
  const postingDays = patterns?.best_posting_days || patterns?.pattern_analysis?.best_posting_days || [];
  const uploadFreq = patterns?.avg_upload_frequency || patterns?.pattern_analysis?.avg_upload_frequency_per_week;
  const avgVideoLength = patterns?.avg_video_length_minutes || patterns?.pattern_analysis?.avg_video_length_minutes;
  const topKeywords = patterns?.top_keywords || patterns?.pattern_analysis?.top_keywords || [];
  const viralTitles = patterns?.viral_title_examples || patterns?.pattern_analysis?.viral_title_examples || [];

  // Build heatmap from posting days when available
  const heatmapRows = postingDays.length > 0
    ? defaultHeatmapRows.map(row => ({
        ...row,
        cells: days.map(d =>
          postingDays.some(pd => pd.toLowerCase().startsWith(d.toLowerCase()))
            ? 'bg-[#adc6ff]'
            : 'bg-white/5'
        ),
      }))
    : defaultHeatmapRows;

  // Build keyword list from API data or fallback
  const keywordList = topKeywords.length > 0
    ? topKeywords.map((kw, i) => {
        const sizes = ['text-5xl font-black', 'text-3xl font-bold', 'text-4xl font-extrabold', 'text-2xl font-medium', 'text-4xl font-bold', 'text-2xl font-semibold', 'text-3xl font-extrabold', 'text-xl font-medium', 'text-4xl font-black', 'text-2xl font-bold'];
        const colors = ['text-[#adc6ff] opacity-90', 'text-[#d0bcff] opacity-70', 'text-[#e2e2eb]', 'text-[#a8edea] opacity-80', 'text-[#adc6ff]/80', 'text-[#9ea0a3] opacity-60', 'text-[#d0bcff]/80', 'text-[#c2c6d6] opacity-50', 'text-[#adc6ff] opacity-80', 'text-[#a8edea] opacity-70'];
        return [kw, `${sizes[i % sizes.length]} ${colors[i % colors.length]}`];
      })
    : [
        ['No data yet', 'text-3xl font-bold text-[#9ea0a3] opacity-50'],
        ['Analyze a channel first', 'text-2xl font-medium text-[#9ea0a3] opacity-30'],
      ];

  const metricData = [
    { label: 'Upload Frequency', value: uploadFreq ? `${Number(uploadFreq).toFixed(1)}x` : '—', sub: 'Average uploads per week across analyzed competitors.', borderColor: 'border-[#adc6ff]/20', textColor: 'text-[#adc6ff]', badge: '/week' },
    { label: 'Avg Video Length', value: avgVideoLength ? `${Number(avgVideoLength).toFixed(0)}m` : '—', sub: 'Average video duration for top-performing competitor content.', borderColor: 'border-[#d0bcff]/20', textColor: 'text-[#d0bcff]' },
    { label: 'Topic Clusters', value: topicClusters.length > 0 ? String(topicClusters.length) : '—', sub: 'Number of distinct content themes identified across competitors.', borderColor: 'border-[#a8edea]/20', textColor: 'text-[#a8edea]' },
  ];

  return (
    <>
      <SideNav />

      <header className="fixed top-0 left-0 md:left-64 right-0 z-30 flex justify-between items-center px-6 py-4 bg-[#111319]/60 backdrop-blur-xl">
        <div className="flex items-center gap-4 flex-1">
          <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ea0a3] text-sm">search</span>
            <input className="w-full bg-[#0c0e14] border-none rounded-lg pl-10 pr-4 py-2 text-sm text-[#e2e2eb] placeholder:text-[#9ea0a3]/50 focus:ring-2 focus:ring-[#adc6ff]/30" placeholder="Global search patterns..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchPatterns}
            disabled={loading || !channelUrl}
            className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full"><span className="material-symbols-outlined">notifications</span></button>
        </div>
      </header>

      <main className="pt-24 pb-20 md:ml-64 px-6 md:px-10 min-h-screen">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb] mb-2">Pattern Insights</h2>
          <p className="text-[#9ea0a3] max-w-2xl">Detecting behavioral clusters across competitor ecosystems. Use these signals to optimize timing and content architecture.</p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#adc6ff]/30 border-t-[#adc6ff] rounded-full animate-spin" />
            <p className="text-[#9ea0a3] text-sm animate-pulse">Running full pattern analysis...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Heatmap */}
          <section className="col-span-12 lg:col-span-8 bg-[#1e1f26] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#e2e2eb]">Global Posting Heatmap</h3>
                <p className="text-xs text-[#9ea0a3]">
                  {postingDays.length > 0
                    ? `Best days: ${postingDays.join(', ')}`
                    : 'Optimal engagement windows based on competitor analysis'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9ea0a3]">
                <span className="w-2 h-2 rounded-full bg-white/10" /> Low
                <span className="w-2 h-2 rounded-full bg-[#adc6ff]/60" />
                <span className="w-2 h-2 rounded-full bg-[#adc6ff]" /> High
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1">
              <div className="col-span-1" />
              {days.map((d) => <div key={d} className="text-[10px] text-center text-[#9ea0a3] font-bold uppercase">{d}</div>)}
              {heatmapRows.map(({ hour, cells }) => (
                <React.Fragment key={hour}>
                  <div className="text-[10px] text-right pr-2 text-[#9ea0a3] font-bold py-2">{hour}</div>
                  {cells.map((cls, i) => <div key={i} className={`${cls} rounded-sm aspect-square`} />)}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Viral Titles / Retention */}
          <section className="col-span-12 lg:col-span-4 bg-[#1e1f26] p-6 rounded-xl flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-xl font-bold text-[#e2e2eb] mb-6">
                {viralTitles.length > 0 ? 'Viral Title Examples' : 'Retention Benchmark'}
              </h3>
              <div className="space-y-4">
                {viralTitles.length > 0 ? (
                  viralTitles.slice(0, 5).map((title, i) => (
                    <div key={i} className="bg-[#0c0e14] rounded-lg p-3">
                      <p className="text-sm text-[#e2e2eb] font-medium">{title}</p>
                    </div>
                  ))
                ) : (
                  [
                    { label: 'Alpha Competitor', time: '—', pct: 85, color: 'bg-[#adc6ff]', textColor: 'text-[#adc6ff]' },
                    { label: 'Market Average', time: '—', pct: 55, color: 'bg-[#d0bcff]', textColor: 'text-[#d0bcff]' },
                    { label: 'Micro Competitors', time: '—', pct: 25, color: 'bg-[#a8edea]', textColor: 'text-[#a8edea]' },
                  ].map(({ label, time, pct, color, textColor }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#c2c6d6] font-medium">{label}</span>
                        <span className={`${textColor} font-bold`}>{time}</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-8 p-4 bg-[#adc6ff]/10 rounded-xl border border-[#adc6ff]/10">
              <p className="text-xs text-[#adc6ff] leading-relaxed">
                <span className="material-symbols-outlined align-middle text-sm mr-1">bolt</span>
                <strong>Insight:</strong> {patterns
                  ? 'Pattern analysis completed. Navigate to Growth Strategy for AI-powered recommendations.'
                  : 'Analyze a channel to unlock detailed pattern insights.'}
              </p>
            </div>
          </section>

          {/* Word Cloud / Topic Clusters */}
          <section className="col-span-12 bg-[#1e1f26] p-8 rounded-xl border border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-[#e2e2eb]">
                  {topicClusters.length > 0 ? 'Topic Clusters' : 'Semantic Hotspots'}
                </h3>
                <p className="text-sm text-[#9ea0a3]">
                  {topicClusters.length > 0
                    ? 'Content themes identified across competitor channels'
                    : 'Top performing keywords and topics by share of voice'}
                </p>
              </div>
            </div>
            {topicClusters.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                {topicClusters.map((cluster, i) => (
                  <div key={i} className="bg-[#0c0e14] p-5 rounded-xl border border-white/5 hover:bg-[#1e1f26] transition-all">
                    <h4 className={`text-lg font-bold mb-2 ${accentColors[i % accentColors.length]}`}>
                      {cluster.topic_name || cluster.name || `Cluster ${i + 1}`}
                    </h4>
                    <p className="text-sm text-[#9ea0a3] leading-relaxed mb-3">
                      {cluster.description || ''}
                    </p>
                    {(cluster.competitors_using_this || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {cluster.competitors_using_this.map((c) => (
                          <span key={c} className="text-[10px] font-bold text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-1 rounded-full">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 p-6">
                {keywordList.map(([word, cls]) => (
                  <span key={word} className={`${cls} hover:scale-110 transition-transform cursor-default`}>{word}</span>
                ))}
              </div>
            )}
          </section>

          {/* Metrics */}
          {metricData.map(({ label, value, sub, borderColor, textColor, badge }) => (
            <div key={label} className={`col-span-12 md:col-span-4 bg-[#1e1f26] p-6 rounded-xl border-l-4 ${borderColor} border border-white/5`}>
              <p className={`text-[10px] uppercase font-bold ${textColor} tracking-widest mb-2`}>{label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#e2e2eb]">{value}</span>
                {badge && <span className={`text-xs ${textColor}`}>{badge}</span>}
              </div>
              <p className="text-xs text-[#9ea0a3] mt-2">{sub}</p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
