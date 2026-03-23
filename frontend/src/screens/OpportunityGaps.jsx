import React from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

const gaps = [
  { title: 'Serverless Security', desc: 'Competitors focus on infrastructure but miss runtime security topics. 800% search growth this quarter.', volume: '12.5k/mo', score: '94/100', accent: 'border-[#adc6ff] text-[#adc6ff]' },
  { title: 'AI Integration Guide', desc: "Lack of 'How-To' content for mid-market CTOs. Primary competitors are too technical or too abstract.", volume: '8.2k/mo', score: '88/100', accent: 'border-[#d0bcff] text-[#d0bcff]' },
  { title: 'FinOps Automation', desc: 'Emerging trend in cost-optimization clusters. No competitor has dedicated video content yet.', volume: '4.1k/mo', score: '82/100', accent: 'border-[#a8edea] text-[#a8edea]' },
];

export default function OpportunityGaps() {
  return (
    <>
      <SideNav />
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-12">
        <header className="flex justify-between items-center w-full px-6 md:px-12 py-6 bg-[#111319]/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
          <div className="flex items-center gap-4 flex-1">
            <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
            <div className="hidden md:flex items-center bg-[#0c0e14] rounded-full px-4 py-2 w-full max-w-md">
              <span className="material-symbols-outlined text-[#9ea0a3] text-lg">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#9ea0a3]/50 text-[#e2e2eb] ml-2" placeholder="Search gap analysis..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">
              Analyze New
            </button>
          </div>
        </header>

        <div className="w-full mx-auto px-6 md:px-12 pt-8 md:pt-12 space-y-12">
          <div className="mb-4">
            <h2 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Opportunity Gaps</h2>
            <p className="text-[#9ea0a3] mt-3 max-w-2xl text-lg">
              Untapped content topics with high search velocity and low competitor coverage.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
            {gaps.map(({ title, desc, volume, score, accent }) => (
              <div key={title} className={`bg-[#1e1f26] rounded-2xl p-8 border-l-4 ${accent.split(' ')[0]} relative overflow-hidden group shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                <div className="flex items-center gap-2 mb-6">
                  <span className={`px-3 py-1 bg-white/5 ${accent.split(' ')[1]} text-[10px] font-bold rounded uppercase tracking-wide`}>
                    🚀 Low Competition + High Demand
                  </span>
                </div>
                <h4 className="text-2xl font-black mb-4 text-[#e2e2eb]">{title}</h4>
                <p className="text-[#9ea0a3] text-sm leading-relaxed mb-8">{desc}</p>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#9ea0a3] uppercase font-bold tracking-wider mb-1">Search Volume</span>
                    <span className="text-xl font-black text-[#e2e2eb]">{volume}</span>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[#9ea0a3] uppercase font-bold tracking-wider mb-1">Gap Score</span>
                    <span className={`text-xl font-black ${accent.split(' ')[1]}`}>{score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
