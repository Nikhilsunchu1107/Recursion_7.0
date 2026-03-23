import React from 'react';
import { NavLink } from 'react-router-dom';

const bottomItems = [
  { to: '/dashboard_overview', icon: 'home', label: 'Home' },
  { to: '/competitor_discovery', icon: 'search', label: 'Discovery' },
  { to: '/pattern_insights', icon: 'query_stats', label: 'Analysis' },
  { to: '/growth_strategy', icon: 'auto_awesome', label: 'Gaps' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center p-2 md:hidden bg-[#1e1f26]/80 backdrop-blur-lg border-t border-[#33343b]/15 shadow-2xl rounded-t-xl">
      {bottomItems.map(({ to, icon, label }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all ${
              isActive ? 'text-[#adc6ff] bg-[#adc6ff]/10' : 'text-[#9ea0a3]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {icon}
              </span>
              <span className="text-[10px] font-medium mt-0.5">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
