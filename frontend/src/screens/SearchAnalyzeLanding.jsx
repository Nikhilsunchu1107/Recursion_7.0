
import React from 'react';
import parse from 'html-react-parser';

// Use a simple template literal to safely inject HTML without needing raw loaders.
// Since HTML may contain backticks, we escape them.
const htmlString = `
<!-- TopNavBar Implementation -->
<nav class="fixed top-0 left-0 w-full z-50 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
<div class="flex items-center gap-2">
<span class="text-xl font-bold tracking-tight text-[#e2e2eb] font-headline">Competitor Spy</span>
<span class="hidden md:inline-block text-[10px] uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">Intelligence Layer</span>
</div>
<div class="hidden md:flex items-center gap-8">
<a class="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">About</a>
<a class="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">Pricing</a>
<a class="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">Solutions</a>
</div>
<div class="flex items-center gap-4">
<button class="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium hidden sm:block">Login</button>
<button class="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-on-primary-container px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                Analyze
            </button>
<span class="material-symbols-outlined text-[#9ea0a3] cursor-pointer hover:text-primary transition-colors">account_circle</span>
</div>
</nav>
<!-- Main Hero Section -->
<main class="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
<!-- Background Decorative Elements -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full hero-glow pointer-events-none"></div>
<div class="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
<div class="absolute bottom-1/4 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
<!-- Content Wrapper -->
<div class="relative z-10 w-full max-w-4xl text-center space-y-12">
<!-- Branding/Subhead -->
<div class="space-y-4">
<h1 class="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight">
                    Unlock Competitive <br/>
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-container">Intelligence</span>
</h1>
<p class="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl font-body leading-relaxed">
                    Analyze any YouTube channel or niche to uncover growth patterns, content gaps, and competitor secrets.
                </p>
</div>
<!-- Search Interface -->
<div class="w-full">
<div class="glass-panel p-2 rounded-2xl shadow-2xl border border-outline-variant/15 group focus-within:border-primary/30 transition-all">
<div class="flex flex-col md:flex-row gap-2">
<div class="relative flex-grow flex items-center">
<span class="material-symbols-outlined absolute left-4 text-outline">search</span>
<input class="w-full bg-surface-container-lowest border-none focus:ring-0 text-on-surface placeholder:text-outline/60 pl-12 pr-4 py-5 rounded-xl font-body transition-all" placeholder="Enter your YouTube channel URL or niche keyword..." type="text"/>
</div>
<button class="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-on-primary-container px-10 py-5 rounded-xl font-bold text-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group/btn">
                            Analyze
                            <span class="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</div>
<!-- Quick Suggestions -->
<div class="mt-6 flex flex-wrap justify-center gap-3">
<span class="text-xs font-bold text-outline uppercase tracking-wider self-center">Trending:</span>
<button class="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-sm border border-outline-variant/10 hover:border-primary/40 hover:text-primary transition-all">#MrBeast Analysis</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-sm border border-outline-variant/10 hover:border-primary/40 hover:text-primary transition-all">#TechReviews</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-sm border border-outline-variant/10 hover:border-primary/40 hover:text-primary transition-all">#AI SaaS Gaps</button>
</div>
</div>
<!-- Social Proof -->
<div class="pt-12 space-y-6">
<p class="text-outline text-sm font-medium tracking-wide uppercase">Trusted by 10,000+ Creators</p>
<div class="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
<div class="flex items-center gap-2">
<img alt="" class="w-6 h-6" data-alt="YouTube red play icon logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgiNJYurcPNA5j8dUjaCxctAXS7CTHooHnbFVvWs0Sqgm54PbjufK569xuk1N_az5-MJ3oMaxMfR2Vm0o_ve4sFov4wRZp-6g9akruSY-69higw_W6b0_A4t2k88DAvrBwjHjiPy1u7s67Sozfg3POAyMGda8TAtjitlIfTpntCAEFzUIZmVsAFnwg5UaxDBB2zs7FNIytebyZrtl31VdAsylYFd77TJcc2A8Uysx8yJECJZ85kpIQ_llwt3ww5nFyOCZBFFbKHHHt"/>
<span class="font-headline font-bold text-lg">CreatorPulse</span>
</div>
<div class="flex items-center gap-2">
<img alt="" class="w-6 h-6" data-alt="Data chart icon for brand logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX2T8gt61zaGrE3WXRgUbPIT7gXDDHCX5W0Q_pSLteSUB00n0LSO_cvRPlWe6K7Cbr3v9EjMXd1XzeGkGvzNDlObP8O0n-tdS3qwihDmRMEz6iQ2wl4smZvTq0UzjcwoYAx662pm8Z3OwKgDtywOX7BfvZkNe2UMJJeUUlEmav7uHPQy0_dxhKP-jV3iGTss9aArf2sN7Jb70luCPvqJOhCWN0ttjjFQs3UnfsEqHnq9mYYW6jrcRW-0bQMOtq8Ek78IVgcRHNqK4m"/>
<span class="font-headline font-bold text-lg">NicheMetrics</span>
</div>
<div class="flex items-center gap-2">
<img alt="" class="w-6 h-6" data-alt="Rocket icon for brand logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBriUYtXgjQYmwO3pP3OUDlubzOMhzuPeuWMhyJT5Vn2QxLs_-W_z4NXUNJmivphvtmuwJm0coMesnFY67_n1vHB3ChJIaF1EjDgcWzADo5LvBGBrswdADiSsPamomnRzi6eBik0kxT8A-HSGFmF06U24D2d0zwICVQKCTid1ZA8vdcTjRMJibW1IUkI2PXqCShSCW5pK7_sTh_Wa6S-JNQGN3FMCbqdpo72sSxWtLhI2FhDyLxECQzKKCb25yI3x6FfZfVpeIM24QQ"/>
<span class="font-headline font-bold text-lg">GrowthLab</span>
</div>
<div class="flex items-center gap-2">
<img alt="" class="w-6 h-6" data-alt="Diamond icon for brand logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh90tkep62XPUUrij1mwa1yWoVJ9F5mgx6kjjnSBzyUt5reyffu3NfG6QfuK0jwdUCPiDNXFESyOdl8nEX8qE2GFr-xF6iZhe0puXirwlkXP13DTxt7xSe3p0PUdZEGG2MwLfyERr0mTQ-H_qwanXRNNZJ9MPgai0IyvTY_ofTvIQHeIeYAs7_DhyRYd-61bVfGqdr-nuSS6lih9eac028oge9-JLgIxdG5kZI9Ja4uFYd5mOGUg08QaH1g1vJie3TFuMYtviLPwS2"/>
<span class="font-headline font-bold text-lg">PremiumTube</span>
</div>
</div>
</div>
</div>
</main>
<!-- Bottom Notification/Tip (Contextual FAB Suppression) -->
<div class="fixed bottom-8 right-8 hidden md:block">
<div class="glass-panel p-4 rounded-2xl border border-primary/20 shadow-xl max-w-xs space-y-2">
<div class="flex items-center gap-2 text-primary font-bold text-sm">
<span class="material-symbols-outlined text-sm">auto_awesome</span>
                Pro Insight
            </div>
<p class="text-xs text-on-surface-variant">Analyze 3 competitors at once to see common content patterns in your niche.</p>
</div>
</div>
<!-- Mobile Navigation (BottomNavBar) -->
<div class="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#1e1f26]/80 backdrop-blur-lg border-t border-[#33343b]/15 p-2 flex justify-around items-center rounded-t-xl">
<a class="flex flex-col items-center justify-center text-[#adc6ff] bg-[#adc6ff]/10 rounded-xl px-3 py-1" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="text-[10px] font-medium mt-1">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
<span class="material-symbols-outlined">search</span>
<span class="text-[10px] font-medium mt-1">Discovery</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
<span class="material-symbols-outlined">query_stats</span>
<span class="text-[10px] font-medium mt-1">Analysis</span>
</a>
<a class="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
<span class="material-symbols-outlined">auto_awesome</span>
<span class="text-[10px] font-medium mt-1">Gaps</span>
</a>
</div>
`;

export default function SearchAnalyzeLanding() {
  return parse(htmlString);
}
