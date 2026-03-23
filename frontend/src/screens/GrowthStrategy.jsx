import React from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

const strategies = [
  {
    icon: 'video_library',
    title: 'Post 2–3 Videos/Week',
    desc: 'Your top 3 competitors increased engagement by 42% by adopting a high-frequency short-form video rhythm.',
    priority: 'High Priority',
    priorityColor: 'text-red-400 bg-red-400/10',
    accentColor: 'text-[#adc6ff]',
  },
  {
    icon: 'hub',
    title: 'Cross-Platform Sync',
    desc: "Coordinate LinkedIn insights with Twitter threads to capture professional cross-traffic before competitors do.",
    priority: 'Medium',
    priorityColor: 'text-[#a8edea] bg-[#a8edea]/10',
    accentColor: 'text-[#d0bcff]',
  },
  {
    icon: 'forum',
    title: 'Direct Response SEO',
    desc: 'Shift ad spend to high-intent "vs" keywords where competitors are under-bidding by 15%.',
    priority: 'High Priority',
    priorityColor: 'text-red-400 bg-red-400/10',
    accentColor: 'text-[#a8edea]',
  },
  {
    icon: 'campaign',
    title: 'Micro-Influencer Blitz',
    desc: 'Partner with 5 niche accounts in the DevOps space; competitors are ignoring this sub-vertical.',
    priority: 'Low',
    priorityColor: 'text-[#9ea0a3] bg-white/10',
    accentColor: 'text-[#9ea0a3]',
  },
];

const gaps = [
  { title: 'Serverless Security', desc: 'Competitors focus on infrastructure but miss runtime security topics. 800% search growth this quarter.', volume: '12.5k/mo', score: '94/100', accent: 'border-[#adc6ff] text-[#adc6ff]' },
  { title: 'AI Integration Guide', desc: "Lack of 'How-To' content for mid-market CTOs. Primary competitors are too technical or too abstract.", volume: '8.2k/mo', score: '88/100', accent: 'border-[#d0bcff] text-[#d0bcff]' },
  { title: 'FinOps Automation', desc: 'Emerging trend in cost-optimization clusters. No competitor has dedicated video content yet.', volume: '4.1k/mo', score: '82/100', accent: 'border-[#a8edea] text-[#a8edea]' },
];

export default function GrowthStrategy() {
  return (
    <>
      <SideNav />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-8">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 py-4 bg-[#111319]/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
          <div className="flex items-center gap-4 flex-1">
            <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
            <div className="hidden md:flex items-center bg-[#0c0e14] rounded-full px-4 py-2 w-full max-w-md">
              <span className="material-symbols-outlined text-[#9ea0a3] text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#9ea0a3]/50 text-[#e2e2eb] ml-2"
                placeholder="Search insights..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#9ea0a3] hover:text-[#adc6ff] transition-colors">
              notifications
            </button>
            <button className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">
              Analyze
            </button>
          </div>
        </header>

        {/* Growth Content Canvas */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#e2e2eb] tracking-tight">Growth Strategy</h2>
            <p className="text-[#9ea0a3] mt-2 max-w-2xl">
              AI-curated recommendations based on cross-channel competitor performance and market velocity.
            </p>
          </div>

          {/* Recommendations Panel */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#e2e2eb]">
                <span className="material-symbols-outlined text-[#adc6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                Actionable Recommendations
              </h3>
              <span className="text-xs text-[#9ea0a3] font-medium bg-[#1e1f26] px-3 py-1 rounded-full">Updated 4h ago</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {strategies.map(({ icon, title, desc, priority, priorityColor, accentColor }) => (
                <div
                  key={title}
                  className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 flex flex-col h-full hover:bg-[#282a30] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                    <span className={`material-symbols-outlined ${accentColor}`}>{icon}</span>
                  </div>
                  <h4 className={`text-lg font-bold mb-2 group-hover:${accentColor} transition-colors text-[#e2e2eb]`}>{title}</h4>
                  <p className="text-sm text-[#9ea0a3] mb-6 flex-grow">{desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-3 py-1 ${priorityColor} text-[10px] font-bold rounded-full uppercase tracking-wider`}>
                      {priority}
                    </span>
                    <button className={`${accentColor} material-symbols-outlined`}>arrow_forward_ios</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunity Gap Section */}
          <div className="space-y-6 pb-8" id="gaps">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a8edea]" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
              <h3 className="text-xl font-bold text-[#e2e2eb]">Opportunity Gaps</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gaps.map(({ title, desc, volume, score, accent }) => (
                <div
                  key={title}
                  className={`bg-[#1e1f26] rounded-xl p-8 border-l-4 ${accent.split(' ')[0]} relative overflow-hidden group`}
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 bg-white/5 ${accent.split(' ')[1]} text-[10px] font-bold rounded`}>
                      🚀 Low Competition + High Demand
                    </span>
                  </div>
                  <h4 className="text-2xl font-extrabold mb-3 text-[#e2e2eb]">{title}</h4>
                  <p className="text-[#9ea0a3] text-sm leading-relaxed">{desc}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#9ea0a3] uppercase font-bold">Search Volume</span>
                      <span className="text-lg font-bold text-[#e2e2eb]">{volume}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#9ea0a3] uppercase font-bold">Gap Score</span>
                      <span className={`text-lg font-bold ${accent.split(' ')[1]}`}>{score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
