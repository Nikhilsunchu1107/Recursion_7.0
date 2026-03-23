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

export default function GrowthStrategy() {
  return (
    <>
      <SideNav />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-12">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-6 bg-[#111319]/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
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
        <div className="w-full mx-auto px-6 md:px-12 pt-8 md:pt-12 space-y-12">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Growth Strategy</h2>
            <p className="text-[#9ea0a3] mt-3 max-w-2xl text-lg">
              AI-curated recommendations based on cross-channel competitor performance and market velocity.
            </p>
          </div>

          {/* Recommendations Panel */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-[#e2e2eb]">
                <span className="material-symbols-outlined text-[#adc6ff] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                Actionable Recommendations
              </h3>
              <span className="text-xs text-[#9ea0a3] font-bold uppercase tracking-wider bg-[#1e1f26] px-4 py-2 rounded-full">Updated 4h ago</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
              {strategies.map(({ icon, title, desc, priority, priorityColor, accentColor }) => (
                <div
                  key={title}
                  className="bg-[#1e1f26] p-8 rounded-2xl border border-white/5 flex flex-col h-full hover:bg-[#282a30] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(173,198,255,0.1)] group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                    <span className={`material-symbols-outlined text-3xl ${accentColor}`}>{icon}</span>
                  </div>
                  <h4 className={`text-xl font-bold mb-3 group-hover:${accentColor} transition-colors text-[#e2e2eb]`}>{title}</h4>
                  <p className="text-sm text-[#9ea0a3] mb-8 flex-grow leading-relaxed">{desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <span className={`px-4 py-1.5 ${priorityColor} text-[10px] font-black rounded-full uppercase tracking-widest`}>
                      {priority}
                    </span>
                    <button className={`${accentColor} material-symbols-outlined hover:translate-x-1 transition-transform`}>arrow_forward</button>
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
