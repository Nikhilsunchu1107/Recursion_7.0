import React from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

const heatmapRows = [
  { hour: '08:00', cells: ['bg-white/5', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/10', 'bg-[#adc6ff]/30', 'bg-white/5', 'bg-white/5'] },
  { hour: '12:00', cells: ['bg-[#adc6ff]/60', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]/60', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/10'] },
  { hour: '16:00', cells: ['bg-[#adc6ff]/80', 'bg-[#adc6ff]', 'bg-[#adc6ff]/80', 'bg-[#adc6ff]', 'bg-[#adc6ff]/90', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/30'] },
  { hour: '20:00', cells: ['bg-[#adc6ff]/40', 'bg-[#adc6ff]/60', 'bg-[#adc6ff]/30', 'bg-[#adc6ff]/40', 'bg-[#adc6ff]/20', 'bg-[#adc6ff]/10', 'bg-white/5'] },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const retentionData = [
  { label: 'Alpha Competitor', time: '12:45 min', pct: 85, color: 'bg-[#adc6ff]', textColor: 'text-[#adc6ff]' },
  { label: 'Market Average', time: '08:12 min', pct: 55, color: 'bg-[#d0bcff]', textColor: 'text-[#d0bcff]' },
  { label: 'Micro Competitors', time: '03:30 min', pct: 25, color: 'bg-[#a8edea]', textColor: 'text-[#a8edea]' },
];

const keywords = [
  ['Artificial Intelligence', 'text-5xl font-black text-[#adc6ff] opacity-90'],
  ['Scalability', 'text-3xl font-bold text-[#d0bcff] opacity-70'],
  ['Automation', 'text-4xl font-extrabold text-[#e2e2eb]'],
  ['Workflow Sync', 'text-2xl font-medium text-[#a8edea] opacity-80'],
  ['Cloud Native', 'text-4xl font-bold text-[#adc6ff]/80'],
  ['User Retention', 'text-2xl font-semibold text-[#9ea0a3] opacity-60'],
  ['Data Visuals', 'text-3xl font-extrabold text-[#d0bcff]/80'],
  ['API Mesh', 'text-xl font-medium text-[#c2c6d6] opacity-50'],
  ['Competitive Edge', 'text-4xl font-black text-[#adc6ff] opacity-80'],
  ['SaaS Ops', 'text-2xl font-bold text-[#a8edea] opacity-70'],
];

const metrics = [
  { label: 'Pattern Velocity', value: '14.2%', sub: 'Increase in weekly content output across primary competitors.', borderColor: 'border-[#adc6ff]/20', textColor: 'text-[#adc6ff]', badge: '+2.1%' },
  { label: 'Visual Style Dominance', value: 'Minimalist', sub: 'Current trending aesthetic for high-engagement B2B creative.', borderColor: 'border-[#d0bcff]/20', textColor: 'text-[#d0bcff]' },
  { label: 'Optimal Frequency', value: '3.5x', sub: 'Sweet spot for maintaining reach without audience burnout.', borderColor: 'border-[#a8edea]/20', textColor: 'text-[#a8edea]', badge: '/week' },
];

export default function PatternInsights() {
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
          <button className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">Analyze</button>
          <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full"><span className="material-symbols-outlined">notifications</span></button>
        </div>
      </header>

      <main className="pt-24 pb-20 md:ml-64 px-6 md:px-10 min-h-screen">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb] mb-2">Pattern Insights</h2>
          <p className="text-[#9ea0a3] max-w-2xl">Detecting behavioral clusters across competitor ecosystems. Use these signals to optimize timing and content architecture.</p>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Heatmap */}
          <section className="col-span-12 lg:col-span-8 bg-[#1e1f26] p-6 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#e2e2eb]">Global Posting Heatmap</h3>
                <p className="text-xs text-[#9ea0a3]">Optimal engagement windows based on 50+ competitors</p>
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

          {/* Retention */}
          <section className="col-span-12 lg:col-span-4 bg-[#1e1f26] p-6 rounded-xl flex flex-col justify-between border border-white/5">
            <div>
              <h3 className="text-xl font-bold text-[#e2e2eb] mb-6">Retention Benchmark</h3>
              <div className="space-y-6">
                {retentionData.map(({ label, time, pct, color, textColor }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#c2c6d6] font-medium">{label}</span>
                      <span className={`${textColor} font-bold`}>{time}</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 p-4 bg-[#adc6ff]/10 rounded-xl border border-[#adc6ff]/10">
              <p className="text-xs text-[#adc6ff] leading-relaxed">
                <span className="material-symbols-outlined align-middle text-sm mr-1">bolt</span>
                <strong>Insight:</strong> Videos over 10m are seeing 22% higher mid-roll retention this quarter.
              </p>
            </div>
          </section>

          {/* Word Cloud */}
          <section className="col-span-12 bg-[#1e1f26] p-8 rounded-xl border border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h3 className="text-2xl font-black text-[#e2e2eb]">Semantic Hotspots</h3>
                <p className="text-sm text-[#9ea0a3]">Top performing keywords and topics by share of voice</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-[#c2c6d6]">Last 30 Days</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-[#c2c6d6]">Engagement Vol.</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 p-6">
              {keywords.map(([word, cls]) => (
                <span key={word} className={`${cls} hover:scale-110 transition-transform cursor-default`}>{word}</span>
              ))}
            </div>
          </section>

          {/* Metrics */}
          {metrics.map(({ label, value, sub, borderColor, textColor, badge }) => (
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
