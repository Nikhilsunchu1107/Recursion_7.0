import React from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

export default function DashboardOverview() {
  return (
    <>
      <SideNav />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-8">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="md:hidden text-lg font-black text-[#e2e2eb]">CS</h2>
            <div className="relative w-full max-w-2xl group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9ea0a3] group-focus-within:text-[#adc6ff] transition-colors">
                search
              </span>
              <input
                className="w-full bg-[#0c0e14] border-none rounded-full py-3 pl-12 pr-32 text-sm focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#9ea0a3]/50 text-[#e2e2eb]"
                placeholder="Enter your YouTube channel URL or niche keyword…"
                type="text"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-[#adc6ff]/20">
                Analyze
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="px-6 mt-8 space-y-8 max-w-7xl mx-auto">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Total Competitors Found</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">124</h3>
                <span className="text-xs font-bold text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-1 rounded-md">+12%</span>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#adc6ff] w-[70%]" />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Avg Views/Video</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">42.8K</h3>
                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">-4%</span>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#d0bcff] w-[45%]" />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Upload Frequency</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#e2e2eb]">3.2</h3>
                <span className="text-xs text-[#9ea0a3]">Videos / Week</span>
              </div>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#a8edea] w-[80%]" />
              </div>
            </div>
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5 hover:bg-[#282a30] transition-colors">
              <p className="text-xs font-medium text-[#9ea0a3] mb-4 uppercase tracking-wider">Opportunity Score</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-extrabold tracking-tight text-[#adc6ff]">
                  88<span className="text-xl text-[#e2e2eb]">/100</span>
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
              <button className="text-xs font-bold text-[#adc6ff] hover:underline">View All Intelligence</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-[#9ea0a3]/60">
                    <th className="px-6 py-4 font-bold">Channel Name</th>
                    <th className="px-6 py-4 font-bold">Subscribers</th>
                    <th className="px-6 py-4 font-bold">Avg Views</th>
                    <th className="px-6 py-4 font-bold">Upload Freq</th>
                    <th className="px-6 py-4 font-bold">Niche Match %</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: 'TechFlow Pro', subs: '1.2M', views: '250K', freq: '2/week', match: 96 },
                    { name: 'Design Daily', subs: '450K', views: '85K', freq: 'Daily', match: 82 },
                    { name: 'Pixel Pioneer', subs: '890K', views: '112K', freq: '1/week', match: 74 },
                  ].map(({ name, subs, views, freq, match }) => (
                    <tr key={name} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-[#e2e2eb]">{name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{subs}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{views}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#c2c6d6]">{freq}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#adc6ff]">{match}%</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full w-12">
                            <div className="h-full bg-[#adc6ff] rounded-full" style={{ width: `${match}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-[#adc6ff]/20 text-[#adc6ff] transition-all">
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views Comparison Bar Chart */}
            <div className="bg-[#1e1f26] p-6 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#9ea0a3]">Views Comparison</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#adc6ff]" />
                    <span className="text-[10px] font-bold text-[#c2c6d6]">Average</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d0bcff]" />
                    <span className="text-[10px] font-bold text-[#c2c6d6]">Top Competitor</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-48 gap-4 px-2">
                {[['Week 1', '40%', '80%'], ['Week 2', '65%', '70%'], ['Week 3', '90%', '85%'], ['Week 4', '55%', '90%']].map(
                  ([week, h1]) => (
                    <div key={week} className="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
                      <div
                        className="w-full bg-[#adc6ff]/20 rounded-t-lg relative group-hover:bg-[#adc6ff]/30 transition-all"
                        style={{ height: h1 }}
                      >
                        <div className="absolute inset-x-0 bottom-0 bg-[#adc6ff] h-[80%] rounded-t-sm" />
                      </div>
                      <span className="text-[10px] font-medium text-[#9ea0a3]">{week}</span>
                    </div>
                  )
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
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((m) => (
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
