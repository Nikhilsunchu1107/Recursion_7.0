import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');

  const handleAnalyze = (e) => {
    e.preventDefault();
    navigate('/dashboard_overview');
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#00285d] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>Competitor Spy</span>
          <span className="hidden md:inline-block text-[10px] uppercase tracking-widest text-[#adc6ff] font-bold px-2 py-0.5 rounded bg-[#adc6ff]/10 border border-[#adc6ff]/20">Intelligence Layer</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">About</a>
          <a className="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">Pricing</a>
          <a className="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium" href="#">Solutions</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#9ea0a3] hover:text-[#e2e2eb] transition-all text-sm font-medium hidden sm:block">Login</button>
          <button
            onClick={handleAnalyze}
            className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#adc6ff]/10"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        {/* Background Glows */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#d0bcff]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4d8eff]/5 rounded-full blur-[200px] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#e2e2eb] leading-tight" style={{ fontFamily: 'Manrope' }}>
              Unlock Competitive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#d0bcff] to-[#4d8eff]">Intelligence</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#c2c6d6] text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'Inter' }}>
              Analyze any YouTube channel or niche to uncover growth patterns, content gaps, and competitor secrets.
            </p>
          </div>

          {/* Search / Analyze Input */}
          <form onSubmit={handleAnalyze} className="w-full">
            <div className="bg-[#1e1f26]/60 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-[#424754]/15 group focus-within:border-[#adc6ff]/30 transition-all">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#8c909f]">search</span>
                  <input
                    className="w-full bg-[#0c0e14] border-none focus:ring-0 focus:outline-none text-[#e2e2eb] placeholder:text-[#8c909f]/60 pl-12 pr-4 py-5 rounded-xl transition-all"
                    style={{ fontFamily: 'Inter' }}
                    placeholder="Enter your YouTube channel URL or niche keyword..."
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-10 py-5 rounded-xl font-bold text-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-[#4d8eff]/20"
                >
                  Analyze
                  <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Trending Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-xs font-bold text-[#8c909f] uppercase tracking-wider self-center">Trending:</span>
              <button type="button" className="px-4 py-1.5 rounded-full bg-[#1e1f26] text-[#c2c6d6] text-sm border border-[#424754]/10 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] transition-all">#MrBeast Analysis</button>
              <button type="button" className="px-4 py-1.5 rounded-full bg-[#1e1f26] text-[#c2c6d6] text-sm border border-[#424754]/10 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] transition-all">#TechReviews</button>
              <button type="button" className="px-4 py-1.5 rounded-full bg-[#1e1f26] text-[#c2c6d6] text-sm border border-[#424754]/10 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] transition-all">#AI SaaS Gaps</button>
            </div>
          </form>

          {/* Login / Sign-up Options */}
          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-4 max-w-sm mx-auto">
              <div className="flex-1 h-px bg-[#424754]/30"></div>
              <span className="text-xs font-bold text-[#8c909f] uppercase tracking-wider">Or sign in to save results</span>
              <div className="flex-1 h-px bg-[#424754]/30"></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              {/* Google Login */}
              <button className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1e1f26] hover:bg-[#282a30] border border-[#424754]/20 rounded-xl transition-all group w-full sm:w-auto">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium text-[#e2e2eb]">Google</span>
              </button>

              {/* GitHub Login */}
              <button className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1e1f26] hover:bg-[#282a30] border border-[#424754]/20 rounded-xl transition-all group w-full sm:w-auto">
                <svg className="w-5 h-5 text-[#e2e2eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium text-[#e2e2eb]">GitHub</span>
              </button>

              {/* Email Login */}
              <button className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1e1f26] hover:bg-[#282a30] border border-[#424754]/20 rounded-xl transition-all group w-full sm:w-auto">
                <span className="material-symbols-outlined text-[#e2e2eb] text-xl">mail</span>
                <span className="text-sm font-medium text-[#e2e2eb]">Email</span>
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 space-y-4">
            <p className="text-[#8c909f] text-sm font-medium tracking-wide uppercase">Trusted by 10,000+ Creators</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>CreatorPulse</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>NicheMetrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>GrowthLab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>PremiumTube</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pro Insight Floating Card */}
      <div className="fixed bottom-8 right-8 hidden md:block">
        <div className="bg-[#1e1f26]/60 backdrop-blur-xl p-4 rounded-2xl border border-[#adc6ff]/20 shadow-xl max-w-xs space-y-2">
          <div className="flex items-center gap-2 text-[#adc6ff] font-bold text-sm">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Pro Insight
          </div>
          <p className="text-xs text-[#c2c6d6]">Analyze 3 competitors at once to see common content patterns in your niche.</p>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#1e1f26]/80 backdrop-blur-lg border-t border-[#33343b]/15 p-2 flex justify-around items-center rounded-t-xl">
        <a className="flex flex-col items-center justify-center text-[#adc6ff] bg-[#adc6ff]/10 rounded-xl px-3 py-1" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-[10px] font-medium mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium mt-1">Discovery</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
          <span className="material-symbols-outlined">query_stats</span>
          <span className="text-[10px] font-medium mt-1">Analysis</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#9ea0a3]" href="#">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="text-[10px] font-medium mt-1">Gaps</span>
        </a>
      </div>
    </>
  );
}
