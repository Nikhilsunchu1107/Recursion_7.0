import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeChannel } from '../lib/api';
import BottomNav from '../components/BottomNav';

export default function SearchAnalyzeLanding() {
  const navigate = useNavigate();
  const { setChannelUrl, setChannelData, setCompetitors, setPatterns, setStrategy, setError: setCtxError } = useAnalysis();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    // Reset previous analysis
    setCompetitors(null);
    setPatterns(null);
    setStrategy(null);
    setCtxError(null);

    try {
      setChannelUrl(trimmed);
      const data = await analyzeChannel(trimmed);
      setChannelData(data);
      navigate('/dashboard_overview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#111319]/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>
            Competitor Spy
          </span>
          <span className="hidden md:inline-block text-[10px] uppercase tracking-widest text-[#adc6ff] font-bold px-2 py-0.5 rounded bg-[#adc6ff]/10 border border-[#adc6ff]/20">
            Intelligence Layer
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#adc6ff]/10 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <a href="/profile"><span className="material-symbols-outlined text-[#9ea0a3] cursor-pointer hover:text-[#adc6ff] transition-colors">account_circle</span></a>
        </div>
      </nav>

      {/* Main Hero */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#d0bcff]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#e2e2eb] leading-tight" style={{ fontFamily: 'Manrope' }}>
              Unlock Competitive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#d0bcff] to-[#4d8eff]">
                Intelligence
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#c2c6d6] text-lg md:text-xl leading-relaxed">
              Analyze any YouTube channel or niche to uncover growth patterns, content gaps, and competitor secrets.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="w-full">
            <div className="bg-[#1e1f26]/60 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-[#424754]/15 focus-within:border-[#adc6ff]/30 transition-all">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-[#8c909f]">search</span>
                  <input
                    className="w-full bg-[#0c0e14] border-none focus:ring-0 focus:outline-none text-[#e2e2eb] placeholder:text-[#8c909f]/60 pl-12 pr-4 py-5 rounded-xl transition-all"
                    placeholder="Enter your YouTube channel URL or niche keyword..."
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] px-10 py-5 rounded-xl font-bold text-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-[#4d8eff]/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#00285d]/30 border-t-[#00285d] rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-xs font-bold text-[#8c909f] uppercase tracking-wider self-center">Trending:</span>
              {['#MrBeast Analysis', '#TechReviews', '#AI SaaS Gaps'].map((tag) => (
                <button key={tag} type="button" className="px-4 py-1.5 rounded-full bg-[#1e1f26] text-[#c2c6d6] text-sm border border-[#424754]/10 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Social proof */}
          <div className="pt-8 space-y-4">
            <p className="text-[#8c909f] text-sm font-medium tracking-wide uppercase">Trusted by 10,000+ Creators</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['CreatorPulse', 'NicheMetrics', 'GrowthLab', 'PremiumTube'].map((brand) => (
                <span key={brand} className="font-bold text-lg text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>{brand}</span>
              ))}
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

      <BottomNav />
    </>
  );
}
