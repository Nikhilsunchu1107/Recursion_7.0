
import React from 'react';
import parse from 'html-react-parser';

// Use a simple template literal to safely inject HTML without needing raw loaders.
// Since HTML may contain backticks, we escape them.
const htmlString = `
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen z-40 bg-[#191b22] w-64 hidden md:flex flex-col">
<div class="p-6">
<h1 class="text-xl font-bold tracking-tight text-[#e2e2eb] font-headline">Competitor Spy</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-primary opacity-70">Intelligence Layer</p>
</div>
<nav class="flex-1 px-4 space-y-2 mt-4">
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-sm font-label">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined">search_check</span>
<span class="text-sm font-label">Competitor Discovery</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined">analytics</span>
<span class="text-sm font-label">Channel Analysis</span>
</a>
<!-- Active State -->
<a class="flex items-center gap-3 px-4 py-3 text-[#adc6ff] bg-[#33343b]/60 backdrop-blur-md rounded-lg font-bold scale-98 transition-transform" href="#">
<span class="material-symbols-outlined">insights</span>
<span class="text-sm font-label">Pattern Insights</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined">trending_up</span>
<span class="text-sm font-label">Growth Strategy</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9ea0a3] hover:text-[#e2e2eb] transition-colors hover:bg-[#33343b]/40" href="#">
<span class="material-symbols-outlined">lightbulb</span>
<span class="text-sm font-label">Opportunity Gaps</span>
</a>
</nav>
<div class="p-4 mt-auto">
<div class="glass-card p-4 flex items-center gap-3 bg-surface-container-high/40">
<div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold">JD</div>
<div>
<p class="text-xs font-bold text-on-surface">John Doe</p>
<p class="text-[10px] text-on-surface-variant">Admin Access</p>
</div>
</div>
</div>
</aside>
<!-- TopNavBar -->
<header class="fixed top-0 left-0 md:left-64 right-0 z-30 flex justify-between items-center px-6 py-4 bg-[#111319]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(173,198,255,0.06)]">
<div class="flex items-center gap-4 flex-1">
<span class="md:hidden text-lg font-black text-[#e2e2eb] font-headline">Competitor Spy</span>
<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input class="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 text-on-surface" placeholder="Global search patterns..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="flex items-center gap-2 bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-on-primary-container px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">
                Analyze
            </button>
<div class="flex items-center gap-2">
<button class="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-all">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-all">
<span class="material-symbols-outlined">account_circle</span>
</button>
</div>
</div>
</header>
<!-- Main Content -->
<main class="pt-24 pb-20 md:ml-64 px-6 md:px-10 min-h-screen max-w-[1600px]">
<header class="mb-10">
<h2 class="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Pattern Insights</h2>
<p class="text-on-surface-variant max-w-2xl font-body">Detecting behavioral clusters across competitor ecosystems. Use these signals to optimize timing and content architecture.</p>
</header>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-12 gap-6">
<!-- Heatmap: Best Posting Times -->
<section class="col-span-12 lg:col-span-8 glass-card p-6 shadow-2xl relative overflow-hidden group">
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
<div class="flex justify-between items-center mb-8">
<div>
<h3 class="text-xl font-bold font-headline text-on-surface">Global Posting Heatmap</h3>
<p class="text-xs text-on-surface-variant">Optimal engagement windows based on 50+ competitors</p>
</div>
<div class="flex items-center gap-2 text-xs text-on-surface-variant">
<span class="w-2 h-2 rounded-full bg-surface-container-highest"></span> Low
                        <span class="w-2 h-2 rounded-full bg-primary-container"></span>
<span class="w-2 h-2 rounded-full bg-primary"></span> High
                    </div>
</div>
<div class="grid grid-cols-8 gap-1">
<!-- Day Labels -->
<div class="col-span-1"></div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Mon</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Tue</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Wed</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Thu</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Fri</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Sat</div>
<div class="text-[10px] text-center text-on-surface-variant font-bold uppercase">Sun</div>
<!-- Hours & Cells -->
<div class="text-[10px] text-right pr-2 text-on-surface-variant font-bold py-2">08:00</div>
<div class="bg-surface-container-highest/30 rounded-sm aspect-square"></div>
<div class="bg-primary/20 rounded-sm aspect-square"></div>
<div class="bg-primary/40 rounded-sm aspect-square"></div>
<div class="bg-primary/10 rounded-sm aspect-square"></div>
<div class="bg-primary/30 rounded-sm aspect-square"></div>
<div class="bg-surface-container-highest/30 rounded-sm aspect-square"></div>
<div class="bg-surface-container-highest/30 rounded-sm aspect-square"></div>
<div class="text-[10px] text-right pr-2 text-on-surface-variant font-bold py-2">12:00</div>
<div class="bg-primary/60 rounded-sm aspect-square"></div>
<div class="bg-primary-container rounded-sm aspect-square"></div>
<div class="bg-primary/80 rounded-sm aspect-square"></div>
<div class="bg-primary-container rounded-sm aspect-square"></div>
<div class="bg-primary/60 rounded-sm aspect-square"></div>
<div class="bg-primary/20 rounded-sm aspect-square"></div>
<div class="bg-primary/10 rounded-sm aspect-square"></div>
<div class="text-[10px] text-right pr-2 text-on-surface-variant font-bold py-2">16:00</div>
<div class="bg-primary/80 rounded-sm aspect-square"></div>
<div class="bg-primary rounded-sm aspect-square border border-primary/50 shadow-[0_0_10px_rgba(173,198,255,0.4)]"></div>
<div class="bg-primary-container rounded-sm aspect-square"></div>
<div class="bg-primary rounded-sm aspect-square"></div>
<div class="bg-primary/90 rounded-sm aspect-square"></div>
<div class="bg-primary/40 rounded-sm aspect-square"></div>
<div class="bg-primary/30 rounded-sm aspect-square"></div>
<div class="text-[10px] text-right pr-2 text-on-surface-variant font-bold py-2">20:00</div>
<div class="bg-primary/40 rounded-sm aspect-square"></div>
<div class="bg-primary/60 rounded-sm aspect-square"></div>
<div class="bg-primary/30 rounded-sm aspect-square"></div>
<div class="bg-primary/40 rounded-sm aspect-square"></div>
<div class="bg-primary/20 rounded-sm aspect-square"></div>
<div class="bg-primary/10 rounded-sm aspect-square"></div>
<div class="bg-surface-container-highest/30 rounded-sm aspect-square"></div>
</div>
</section>
<!-- Video Length Stats -->
<section class="col-span-12 lg:col-span-4 glass-card p-6 flex flex-col justify-between">
<div>
<h3 class="text-xl font-bold font-headline text-on-surface mb-6">Retention Benchmark</h3>
<div class="space-y-6">
<div class="space-y-2">
<div class="flex justify-between text-xs mb-1">
<span class="text-on-surface font-medium">Alpha Competitor</span>
<span class="text-primary font-bold">12:45 min</span>
</div>
<div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 85%"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-xs mb-1">
<span class="text-on-surface font-medium">Market Average</span>
<span class="text-secondary font-bold">08:12 min</span>
</div>
<div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 55%"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-xs mb-1">
<span class="text-on-surface font-medium">Micro Competitors</span>
<span class="text-tertiary font-bold">03:30 min</span>
</div>
<div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
<div class="bg-tertiary h-full rounded-full" style="width: 25%"></div>
</div>
</div>
</div>
</div>
<div class="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/10">
<p class="text-xs text-primary leading-relaxed">
<span class="material-symbols-outlined align-middle text-sm mr-1">bolt</span>
<strong>Insight:</strong> Videos over 10m are seeing 22% higher mid-roll retention this quarter.
                    </p>
</div>
</section>
<!-- Word Cloud: Top Performing Topics -->
<section class="col-span-12 glass-card p-8">
<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
<div>
<h3 class="text-2xl font-black font-headline text-on-surface">Semantic Hotspots</h3>
<p class="text-sm text-on-surface-variant">Top performing keywords and topics by share of voice</p>
</div>
<div class="flex gap-2">
<span class="px-3 py-1 bg-surface-container-high rounded-full text-xs text-on-surface">Last 30 Days</span>
<span class="px-3 py-1 bg-surface-container-high rounded-full text-xs text-on-surface">Engagement Vol.</span>
</div>
</div>
<div class="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 p-6">
<span class="text-5xl font-black font-headline text-primary opacity-90 hover:scale-110 transition-transform cursor-default">Artificial Intelligence</span>
<span class="text-3xl font-bold font-headline text-secondary opacity-70 hover:scale-110 transition-transform cursor-default">Scalability</span>
<span class="text-4xl font-extrabold font-headline text-on-surface opacity-100 hover:scale-110 transition-transform cursor-default">Automation</span>
<span class="text-2xl font-medium font-headline text-tertiary opacity-80 hover:scale-110 transition-transform cursor-default">Workflow Sync</span>
<span class="text-4xl font-bold font-headline text-primary-container opacity-90 hover:scale-110 transition-transform cursor-default">Cloud Native</span>
<span class="text-2xl font-semibold font-headline text-on-surface-variant opacity-60 hover:scale-110 transition-transform cursor-default">User Retention</span>
<span class="text-3xl font-extrabold font-headline text-secondary-container opacity-80 hover:scale-110 transition-transform cursor-default">Data Visuals</span>
<span class="text-xl font-medium font-headline text-on-surface opacity-50 hover:scale-110 transition-transform cursor-default">API Mesh</span>
<span class="text-4xl font-black font-headline text-primary opacity-80 hover:scale-110 transition-transform cursor-default">Competitive Edge</span>
<span class="text-2xl font-bold font-headline text-tertiary opacity-70 hover:scale-110 transition-transform cursor-default">SaaS Ops</span>
</div>
</section>
<!-- Secondary Metrics -->
<div class="col-span-12 md:col-span-4 glass-card p-6 border-l-4 border-primary/20">
<p class="text-[10px] uppercase font-bold text-primary tracking-widest mb-2">Pattern Velocity</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-black font-headline text-on-surface">14.2%</span>
<span class="text-xs text-primary flex items-center"><span class="material-symbols-outlined text-xs">trending_up</span>+2.1%</span>
</div>
<p class="text-xs text-on-surface-variant mt-2 font-body">Increase in weekly content output across primary competitors.</p>
</div>
<div class="col-span-12 md:col-span-4 glass-card p-6 border-l-4 border-secondary/20">
<p class="text-[10px] uppercase font-bold text-secondary tracking-widest mb-2">Visual Style Dominance</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-black font-headline text-on-surface">Minimalist</span>
</div>
<p class="text-xs text-on-surface-variant mt-2 font-body">Current trending aesthetic for high-engagement B2B creative.</p>
</div>
<div class="col-span-12 md:col-span-4 glass-card p-6 border-l-4 border-tertiary/20">
<p class="text-[10px] uppercase font-bold text-tertiary tracking-widest mb-2">Optimal Frequency</p>
<div class="flex items-baseline gap-2">
<span class="text-4xl font-black font-headline text-on-surface">3.5x</span>
<span class="text-xs text-on-surface-variant">/week</span>
</div>
<p class="text-xs text-on-surface-variant mt-2 font-body">Sweet spot for maintaining reach without audience burnout.</p>
</div>
</div>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#1e1f26]/80 backdrop-blur-lg flex justify-around items-center p-2 border-t border-[#33343b]/15 shadow-2xl">
<a class="flex flex-col items-center justify-center text-[#9ea0a3] px-3 py-1" href="#">
<span class="material-symbols-outlined">home</span>
<span class="text-[10px] font-medium font-label">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3] px-3 py-1" href="#">
<span class="material-symbols-outlined">search</span>
<span class="text-[10px] font-medium font-label">Discovery</span>
</a>
<!-- Active Tab -->
<a class="flex flex-col items-center justify-center text-[#adc6ff] bg-[#adc6ff]/10 rounded-xl px-3 py-1" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">query_stats</span>
<span class="text-[10px] font-medium font-label">Analysis</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3] px-3 py-1" href="#">
<span class="material-symbols-outlined">auto_awesome</span>
<span class="text-[10px] font-medium font-label">Gaps</span>
</a>
</nav>
`;

export default function PatternInsights() {
  return parse(htmlString);
}
