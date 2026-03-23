import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import LandingPage from './screens/LandingPage';
import CompetitorDiscovery from './screens/CompetitorDiscovery';
import DashboardOverview from './screens/DashboardOverview';
import GrowthStrategy from './screens/GrowthStrategy';
import PatternInsights from './screens/PatternInsights';
import SearchAnalyzeLanding from './screens/SearchAnalyzeLanding';
import AuthCallback from './screens/AuthCallback';
import { AuthProvider } from './context/AuthContext';

function RouteChangeSetup() {
  const location = useLocation();
  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteChangeSetup />
        <div className="min-h-screen bg-[#111319] text-[#e2e2eb]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard_overview" element={<DashboardOverview />} />
            <Route path="/competitor_discovery" element={<CompetitorDiscovery />} />
            <Route path="/growth_strategy" element={<GrowthStrategy />} />
            <Route path="/pattern_insights" element={<PatternInsights />} />
            <Route path="/search_analyze_landing" element={<SearchAnalyzeLanding />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
