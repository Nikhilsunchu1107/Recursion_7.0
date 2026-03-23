import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate('/dashboard_overview');
    }
  };

  return (
    <div className="min-h-screen bg-[#111319] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#d0bcff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-[#1e1f26]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[#00285d] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
          </div>
          <h2 className="text-2xl font-bold text-[#e2e2eb]">Welcome Back</h2>
          <p className="text-[#9ea0a3] text-sm mt-1">Sign in to Competitor Spy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#9ea0a3] uppercase mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0c0e14] border border-white/5 rounded-lg px-4 py-3 text-[#e2e2eb] focus:ring-2 focus:border-transparent focus:ring-[#adc6ff]/50 transition-all outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#9ea0a3] uppercase mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-[#0c0e14] border border-white/5 rounded-lg px-4 py-3 text-[#e2e2eb] focus:ring-2 focus:border-transparent focus:ring-[#adc6ff]/50 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] text-[#00285d] font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
