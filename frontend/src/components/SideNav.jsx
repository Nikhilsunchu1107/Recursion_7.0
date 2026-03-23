import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const navItems = [
  { to: '/dashboard_overview', icon: 'dashboard', label: 'Dashboard' },
  { to: '/competitor_discovery', icon: 'search_check', label: 'Competitor Discovery' },
  { to: '/pattern_insights', icon: 'insights', label: 'Pattern Insights' },
  { to: '/growth_strategy', icon: 'trending_up', label: 'Growth Strategy' },
  { to: '/opportunity_gaps', icon: 'lightbulb', label: 'Opportunity Gaps' },
];

export default function SideNav() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 h-screen z-40 bg-[#191b22] hidden md:flex flex-col w-64 border-r border-white/5">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[#00285d] text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              radar
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#e2e2eb]" style={{ fontFamily: 'Manrope' }}>
              Competitor Spy
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#adc6ff]/60 font-bold">
              Intelligence Layer
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-[#adc6ff] bg-[#33343b]/60 backdrop-blur-md font-bold'
                  : 'text-[#9ea0a3] hover:text-[#e2e2eb] hover:bg-[#33343b]/40'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1e1f26] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center text-[#00285d] font-bold text-sm shrink-0 uppercase">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#e2e2eb] truncate">{displayName}</p>
                <p className="text-xs text-[#9ea0a3] truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 p-2 w-full rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-[#9ea0a3] text-xs font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-white/5 hover:bg-white/10 text-[#e2e2eb] font-bold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
