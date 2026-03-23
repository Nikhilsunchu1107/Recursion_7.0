import React from 'react';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';

const competitors = [
  {
    name: 'ProTech Mastery',
    handle: '@protech_official',
    subs: '1.2M',
    views: '240K',
    tags: ['Productivity', 'Workflows', 'Tech Reviews'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4AcnyjJVC98OsiqllueKwsTZt9CPakPEqL56ao48yzWDkYVkg_v0loK1bnM_3EjbmgithVVky9vDf50oi308JN2E-BvxHNnjZ-72cmTSyemJp-P05kXy-ThN3rAJlx1gRNWqb5wQB8D31QXdyb5pQN52IviM0mkmfYBhxdgcs0K5EEey7BisQkMoOBMx_jm29qLWk4opRqF4KtIsTN5B2kEKv4cuWKKCbo1oTtkC32h7Plm2MOyqnHp8y5m3x09iKcnF8NN5d-9W8',
  },
  {
    name: 'Study Theory',
    handle: '@study_with_me',
    subs: '850K',
    views: '510K',
    tags: ['Study Tips', 'Education', 'Focus'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnZ_gHtewoaxLnG64BXLHhANx6TH4SXZL9ecPlMLP8o1Kn8zk7Zmt1_f-T_kwdUKEZ3cbxxbqbsfwEMamgW7i9vOzmjn0Vg_nV-lUK3bQSHREQp7xkV9Pv12sn4XXQcc3jvwgxb7ed3ZvaaDaImklKYl1nTX_1V0DM4vqAMSrEZ5pX7Lpv0BRHM6NKcokAtqb9cY2rKpzA19uM7QH0XeyoEUepYDOi3rNoOrknReuoeTIP-JVb2szXdZIS5fGdOUNM6Rel33tDMjNi',
  },
  {
    name: 'Code Devotion',
    handle: '@codedev_ninja',
    subs: '420K',
    views: '115K',
    tags: ['Development', 'AI', 'Tutorials'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbQdoRA-MwESYbU0iKQi_iyorUG0prInt6sOQowhVjIKuNA99wMrURcgOM7n8w8UttVOUi-oUd9yuTB2u9-PqA1ZJgH_ybJibSZV0JJhih73xR0OdOEfQXoz72Of7OtZD9d-yTUwBR4rLTZCfkhEv9o6LfjQnX42PNf4mLznisxujUvjamR4vRVVTO19vNDbnNcrPkcmwLc4j51ihiy4hiw_orsQzIY-Q1wfLkTlg0Beyb0cuw6RINhXDHqJ9kRtGhDuySCWD1Cazy',
  },
  {
    name: 'Finance Mind',
    handle: '@finance_mindset',
    subs: '2.1M',
    views: '680K',
    tags: ['Investing', 'Markets', 'Budgeting'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh0dZ-tUmcaZ4xHfQcuIb0dyk9uY2CY4EmPmQh8b374MVL7NCBJ0waSl2_ktqeA8QD2Z7Ymp8JHbhwVySdmf3NpROLxIqB1SkHUdy19VugvkO0tu-3d4Dg55u9M9WpeU-brMjysZGPWroe4MhI6IcfYLQk7K2hiHeJuhYUmCeobYggClg3UdOf4gzH_mZArDS2_yUxMegtE3J15M-4CpuONKNn5zbo0DdNYzaHe7dzJr8YZH1jUYk7fizlxMGWfxIqQVD-Q8ChTl45',
  },
  {
    name: 'Fit Evolution',
    handle: '@fit_evo_yt',
    subs: '3.4M',
    views: '1.1M',
    tags: ['Fitness', 'Health', 'Motivation'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-pW7jpm-zeXenhkTM5Qat_2__c5HKZo46VMvXQ60P1554ZwXOtRGm4pkr0NNfalc8E4eqNzd1b6Wa92bM2qZUcePWbI4vcpjcTZIWuVs7hS8EIzt4OrpK2TjBKzSqHn4Qf3-BIeSRLrrDbEMHGniAGYBTTXUUR38Th-lF3rxg94IkTgmF6jyKQk0E3Bsul2hX8R-xKv90XiXl-fLEd5FeguTc2nn18z98O-iaP3wB4ioStUfDQcC4qbEUmMcTjVP3rxVrz0qq9G0',
  },
  {
    name: 'Creative Arc',
    handle: '@creative_arc_visuals',
    subs: '540K',
    views: '88K',
    tags: ['Digital Art', 'Design', 'VFX'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNFWsgVXioWYPXEMFByI7uXfCNqRPTicsNlCeKW0s-AEX1s17AOmePV4wlN7ZI988rQpEuvOAYEGcYLEkRbTF3bTOzMSjp6-7VMWDll8iPlXlLFAb2PSAI58Xq4bSuKfSyf_dA7_gzd9PdWSERIlktXxFQVYti4iydNd8ob6juhijDGo1fQ7CPOTZ2vABD15jdnnJHf0rK2rMsgM9OzXj1CpIZvH2kJucjO_ti_F90z0y2xEakzJry6SUXpoyKHS7wV-Bh_DYpom2J',
  },
];

export default function CompetitorDiscovery() {
  return (
    <>
      <SideNav />

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 ml-0 md:ml-64 bg-[#111319]/60 backdrop-blur-xl fixed top-0 z-30 shadow-[0_8px_32px_rgba(173,198,255,0.06)]" style={{ maxWidth: 'calc(100% - 0px)' }}>
        <div className="flex items-center gap-4 flex-1">
          <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9ea0a3] text-sm">
              search
            </span>
            <input
              className="w-full bg-[#0c0e14] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#9ea0a3]/50 text-[#e2e2eb]"
              placeholder="Search competitors..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#adc6ff]/10">
            Analyze
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
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1e1f26] rounded-lg text-sm font-medium border border-white/5 hover:bg-[#282a30] transition-colors text-[#c2c6d6]">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1e1f26] rounded-lg text-sm font-medium border border-white/5 hover:bg-[#282a30] transition-colors text-[#c2c6d6]">
                <span className="material-symbols-outlined text-sm">sort</span>
                Sort by Engagement
              </button>
            </div>
          </div>

          {/* Competitor Card Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
            {competitors.map(({ name, handle, subs, views, tags, img }) => (
              <div
                key={name}
                className="bg-[#1e1f26] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/20 group"
              >
                <div className="relative h-40 w-full overflow-hidden bg-[#0c0e14]">
                  <img
                    alt="Channel Preview"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    src={img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1f26] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[#adc6ff] overflow-hidden bg-[#33343b]">
                      <img alt="Profile" src={img} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#e2e2eb] leading-tight">{name}</h3>
                      <p className="text-xs text-[#adc6ff] font-medium">{handle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0c0e14] rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[#9ea0a3] font-bold mb-1">Subscribers</p>
                      <p className="text-xl font-bold text-[#e2e2eb]">{subs}</p>
                    </div>
                    <div className="bg-[#0c0e14] rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-[#9ea0a3] font-bold mb-1">Avg Views</p>
                      <p className="text-xl font-bold text-[#e2e2eb]">{views}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
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
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#e2e2eb] font-bold text-sm rounded-lg transition-all border border-white/5">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-4">
            <button className="p-2 bg-[#1e1f26] rounded-lg text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-[#adc6ff] text-[#00285d] font-bold">1</button>
              <button className="w-10 h-10 rounded-lg bg-[#1e1f26] text-[#9ea0a3] hover:bg-[#282a30] transition-colors font-bold">2</button>
              <button className="w-10 h-10 rounded-lg bg-[#1e1f26] text-[#9ea0a3] hover:bg-[#282a30] transition-colors font-bold">3</button>
            </div>
            <button className="p-2 bg-[#1e1f26] rounded-lg text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
