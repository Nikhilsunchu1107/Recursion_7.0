
import React from 'react';
import parse from 'html-react-parser';

// Use a simple template literal to safely inject HTML without needing raw loaders.
// Since HTML may contain backticks, we escape them.
const htmlString = `
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen z-40 bg-[#191b22] dark:bg-[#191b22] hidden md:flex flex-col w-64 border-r border-outline-variant/10">
<div class="p-6">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">monitoring</span>
</div>
<div>
<h1 class="text-xl font-bold tracking-tight text-[#e2e2eb] font-headline">Competitor Spy</h1>
<p class="text-[10px] uppercase tracking-widest text-primary/60 font-bold">Intelligence Layer</p>
</div>
</div>
</div>
<nav class="flex-1 px-4 space-y-2 mt-4">
<!-- Dashboard Active -->
<a class="flex items-center gap-3 px-4 py-3 text-[#adc6ff] bg-[#33343b]/60 backdrop-blur-md rounded-lg font-bold transition-all scale-98" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="text-sm">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-all hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined" data-icon="search_check">search_check</span>
<span class="text-sm">Competitor Discovery</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-all hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="text-sm">Channel Analysis</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-all hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined" data-icon="insights">insights</span>
<span class="text-sm">Pattern Insights</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-all hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined" data-icon="trending_up">trending_up</span>
<span class="text-sm">Growth Strategy</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-all hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined" data-icon="lightbulb">lightbulb</span>
<span class="text-sm">Opportunity Gaps</span>
</a>
</nav>
<div class="p-4 border-t border-outline-variant/10">
<div class="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer">
<img alt="Profile" class="w-10 h-10 rounded-full" data-alt="User profile avatar close up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtc25bf1vk2LvyrcCDTQ9BJsdmQGYn3RPiwkl5SWHEsx_F5GsaKfvQA_l-Di7oifK4xi3qWfn-f6i7XY9Za5RG0rN8M1C0-6wlp-pwAk2Qf_vd_1_63qtXksBBV_hIq-pq-pZxFadP8oCAIr96Cbjy_DHJ43EwPfmHPmXOyJnUXwvRZETGwqykRO2MNrFMkwtNxy_-AH2YS7zhwWsh7uPTn3Eh1KwdSSG0FYyDs9T-iys27I7045l2HCXJ_cinTFZIPWK1u3cAl1KG"/>
<div class="overflow-hidden">
<p class="text-sm font-bold truncate">Alex Chen</p>
<p class="text-xs text-on-surface-variant truncate">Pro Intelligence</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="ml-0 md:ml-64 min-h-screen pb-24 md:pb-8">
<!-- TopNavBar -->
<header class="sticky top-0 z-30 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-4 flex-1">
<h2 class="md:hidden text-lg font-black text-[#e2e2eb] font-headline">CS</h2>
<div class="relative w-full max-w-2xl group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
<input class="w-full bg-surface-container-lowest border-none rounded-full py-3 pl-12 pr-32 text-sm focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-outline/50" placeholder="Enter your YouTube channel URL or niche keyword…" type="text"/>
<button class="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-on-primary font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                        Analyze
                    </button>
</div>
</div>
<div class="flex items-center gap-4 ml-6">
<button class="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="p-2 text-[#9ea0a3] hover:bg-[#1e1f26] rounded-full transition-all">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
<!-- Page Canvas -->
<div class="px-6 mt-8 space-y-8 max-w-7xl mx-auto">
<!-- Stat Cards Row -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<div class="glass p-6 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-colors group">
<p class="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">Total Competitors Found</p>
<div class="flex items-end justify-between">
<h3 class="text-4xl font-extrabold font-headline tracking-tight">124</h3>
<span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">+12%</span>
</div>
<div class="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary w-[70%]"></div>
</div>
</div>
<div class="glass p-6 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-colors group">
<p class="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">Avg Views/Video</p>
<div class="flex items-end justify-between">
<h3 class="text-4xl font-extrabold font-headline tracking-tight">42.8K</h3>
<span class="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded-md">-4%</span>
</div>
<div class="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-secondary w-[45%]"></div>
</div>
</div>
<div class="glass p-6 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-colors group">
<p class="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">Upload Frequency</p>
<div class="flex items-end justify-between">
<h3 class="text-4xl font-extrabold font-headline tracking-tight">3.2</h3>
<span class="text-xs text-on-surface-variant">Videos / Week</span>
</div>
<div class="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-[80%]"></div>
</div>
</div>
<div class="glass p-6 rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-colors group">
<p class="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">Opportunity Score</p>
<div class="flex items-end justify-between">
<h3 class="text-4xl font-extrabold font-headline tracking-tight text-primary">88<span class="text-xl">/100</span></h3>
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
</div>
<div class="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary-container w-[88%]"></div>
</div>
</div>
</div>
<!-- Competitor List Table -->
<div class="glass rounded-xl overflow-hidden border border-outline-variant/10">
<div class="p-6 border-b border-outline-variant/5 flex justify-between items-center">
<h4 class="text-lg font-bold font-headline">Top Ranked Competitors</h4>
<button class="text-xs font-bold text-primary hover:underline">View All Intelligence</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="text-[10px] uppercase tracking-widest text-on-surface-variant/60">
<th class="px-6 py-4 font-bold">Channel Name</th>
<th class="px-6 py-4 font-bold">Subscribers</th>
<th class="px-6 py-4 font-bold">Avg Views</th>
<th class="px-6 py-4 font-bold">Upload Freq</th>
<th class="px-6 py-4 font-bold">Niche Match %</th>
<th class="px-6 py-4 font-bold text-right">Action</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/5">
<tr class="hover:bg-surface-container-highest/30 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<img alt="Logo" class="w-8 h-8 rounded-lg" data-alt="Social media tech channel logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWoJsMaIkg9bK8wIVHC_QTr3cZchhzSpO-o4cW9L7yGiEIVhdV7S_2wDjujRSMN1RtRAeWWHlN7Qf5Fv2IfRt6DYhu-xje-XHor1x_XCXHeJzqNVpxeySg6IdcLKIRbbIY3LDEpkEtJ4WPmug0_u_9fhctGHWOy-eyF4CedmjNksYbqLhO_J7f-thgUTroFEJKcMzFAENNnCkvtcoQq0Bhx9Tp97kmxAxpGPqLhl8P9ur3CGz1v6-Xt_XJugEePTrRYw4DCH1-PLF8"/>
<span class="font-bold text-sm">TechFlow Pro</span>
</div>
</td>
<td class="px-6 py-4 text-sm font-medium">1.2M</td>
<td class="px-6 py-4 text-sm font-medium">250K</td>
<td class="px-6 py-4 text-sm font-medium">2/week</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-primary">96%</span>
<div class="flex-1 h-1 bg-surface-container-high rounded-full w-12">
<div class="h-full bg-primary w-[96%]"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all">
<span class="material-symbols-outlined text-sm">open_in_new</span>
</button>
</td>
</tr>
<tr class="hover:bg-surface-container-highest/30 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<img alt="Logo" class="w-8 h-8 rounded-lg" data-alt="Modern creative agency logo circular" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtyT0Icp7SrsxZhLmCSZhikUlHkNrxqaZJGo7FWVaBJRCmdJQscq_wpwuPUl0WctZK7dlgaKhsxjOpN8YeZWTYe5M8fBa7WTEMifblcPIjWAhZVk71rMscDuwIZpNm6_0sPkUxVojlKByizweQwWF3L7p73qdXfee4pU2KrusGjq4dODiG1V5cqvhFwwsExgvLVdeB6_ijIZlqIhkJ_FrhC3GHk6xmKFNXPD4CfK_3SaWAmZUyhodze1-iOlCoz3OL6KW47pOb3_wK"/>
<span class="font-bold text-sm">Design Daily</span>
</div>
</td>
<td class="px-6 py-4 text-sm font-medium">450K</td>
<td class="px-6 py-4 text-sm font-medium">85K</td>
<td class="px-6 py-4 text-sm font-medium">Daily</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-secondary">82%</span>
<div class="flex-1 h-1 bg-surface-container-high rounded-full w-12">
<div class="h-full bg-secondary w-[82%]"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all">
<span class="material-symbols-outlined text-sm">open_in_new</span>
</button>
</td>
</tr>
<tr class="hover:bg-surface-container-highest/30 transition-colors group">
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<img alt="Logo" class="w-8 h-8 rounded-lg" data-alt="Retro hardware tech logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4pREqDIQAPBlZUEzK2LavIMzL2siwq5NnmkIeISshh5cOhnwjBTOJY1OZJ6tUnRJT_yFh_ThL1iUNfu0E8RKe5pyQfk_pEliWHKw_ElTIsm1NY0MDfBBUtwwNJjXt9Na6lenEMASz6E5jsQAqoVajP7NdIofSfU67qg-hXCamHflRn-lrZ9UNSE8jMJgn9swjO_nkiCToGBqKfmN93KS1Ego2iJs6P1war5FeZZylg1VVygIK5fwRUKbeN0pIR-Azq4F_jUZBSNoj"/>
<span class="font-bold text-sm">Pixel Pioneer</span>
</div>
</td>
<td class="px-6 py-4 text-sm font-medium">890K</td>
<td class="px-6 py-4 text-sm font-medium">112K</td>
<td class="px-6 py-4 text-sm font-medium">1/week</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<span class="text-xs font-bold text-tertiary">74%</span>
<div class="flex-1 h-1 bg-surface-container-high rounded-full w-12">
<div class="h-full bg-tertiary w-[74%]"></div>
</div>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all">
<span class="material-symbols-outlined text-sm">open_in_new</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Side-by-Side Charts -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
<!-- Views Comparison Bar Chart -->
<div class="glass p-6 rounded-xl border border-outline-variant/10">
<div class="flex items-center justify-between mb-8">
<h4 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Views Comparison</h4>
<div class="flex items-center gap-4">
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="text-[10px] font-bold">Average</span>
</div>
<div class="flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="text-[10px] font-bold">Top Competitor</span>
</div>
</div>
</div>
<div class="flex items-end justify-between h-48 gap-4 px-2">
<div class="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
<div class="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/30 transition-all h-[40%]">
<div class="absolute inset-x-0 bottom-0 bg-primary h-[80%] rounded-t-sm"></div>
</div>
<span class="text-[10px] font-medium text-on-surface-variant">Week 1</span>
</div>
<div class="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
<div class="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/30 transition-all h-[65%]">
<div class="absolute inset-x-0 bottom-0 bg-primary h-[70%] rounded-t-sm"></div>
</div>
<span class="text-[10px] font-medium text-on-surface-variant">Week 2</span>
</div>
<div class="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
<div class="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/30 transition-all h-[90%]">
<div class="absolute inset-x-0 bottom-0 bg-primary h-[85%] rounded-t-sm"></div>
</div>
<span class="text-[10px] font-medium text-on-surface-variant">Week 3</span>
</div>
<div class="flex-1 flex flex-col gap-2 items-center h-full justify-end group">
<div class="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/30 transition-all h-[55%]">
<div class="absolute inset-x-0 bottom-0 bg-primary h-[90%] rounded-t-sm"></div>
</div>
<span class="text-[10px] font-medium text-on-surface-variant">Week 4</span>
</div>
</div>
</div>
<!-- Upload Frequency Line Chart -->
<div class="glass p-6 rounded-xl border border-outline-variant/10">
<div class="flex items-center justify-between mb-8">
<h4 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Upload Frequency Trend</h4>
<span class="text-[10px] font-bold text-tertiary">Live Monitoring</span>
</div>
<div class="relative h-48 w-full">
<!-- Simulated Line Chart -->
<svg class="w-full h-full" preserveaspectratio="none" viewbox="0 0 400 100">
<defs>
<lineargradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#adc6ff" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#adc6ff" stop-opacity="0"></stop>
</lineargradient>
</defs>
<path d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20 V100 H0 Z" fill="url(#lineGrad)"></path>
<path d="M0,80 Q50,40 100,60 T200,30 T300,70 T400,20" fill="none" stroke="#adc6ff" stroke-linecap="round" stroke-width="3"></path>
<!-- Dots -->
<circle cx="0" cy="80" fill="#adc6ff" r="3"></circle>
<circle cx="100" cy="60" fill="#adc6ff" r="3"></circle>
<circle cx="200" cy="30" fill="#adc6ff" r="3"></circle>
<circle cx="300" cy="70" fill="#adc6ff" r="3"></circle>
<circle cx="400" cy="20" fill="#adc6ff" r="3"></circle>
</svg>
<div class="absolute bottom-0 w-full flex justify-between px-2">
<span class="text-[10px] font-medium text-on-surface-variant">Jan</span>
<span class="text-[10px] font-medium text-on-surface-variant">Feb</span>
<span class="text-[10px] font-medium text-on-surface-variant">Mar</span>
<span class="text-[10px] font-medium text-on-surface-variant">Apr</span>
<span class="text-[10px] font-medium text-on-surface-variant">May</span>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center p-2 bg-[#1e1f26]/80 backdrop-blur-lg md:hidden rounded-t-xl border-t border-[#33343b]/15 shadow-2xl">
<a class="flex flex-col items-center justify-center text-[#adc6ff] bg-[#adc6ff]/10 rounded-xl px-3 py-1 scale-95 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="text-[10px] font-medium">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3] active:bg-[#33343b] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="search">search</span>
<span class="text-[10px] font-medium">Discovery</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3] active:bg-[#33343b] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="query_stats">query_stats</span>
<span class="text-[10px] font-medium">Analysis</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3] active:bg-[#33343b] transition-all" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
<span class="text-[10px] font-medium">Gaps</span>
</a>
</nav>
`;

export default function DashboardOverview() {
  return parse(htmlString);
}
