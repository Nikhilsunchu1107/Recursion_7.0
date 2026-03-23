import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './screens/LandingPage';
import CompetitorDiscovery from './screens/CompetitorDiscovery';
import DashboardOverview from './screens/DashboardOverview';
import GrowthStrategy from './screens/GrowthStrategy';
import OpportunityGaps from './screens/OpportunityGaps';
import PatternInsights from './screens/PatternInsights';
import SearchAnalyzeLanding from './screens/SearchAnalyzeLanding';
import AuthCallback from './screens/AuthCallback';

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
            <Route path="/dashboard_overview" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
            <Route path="/competitor_discovery" element={<ProtectedRoute><CompetitorDiscovery /></ProtectedRoute>} />
            <Route path="/growth_strategy" element={<ProtectedRoute><GrowthStrategy /></ProtectedRoute>} />
            <Route path="/opportunity_gaps" element={<ProtectedRoute><OpportunityGaps /></ProtectedRoute>} />
            <Route path="/pattern_insights" element={<ProtectedRoute><PatternInsights /></ProtectedRoute>} />
            <Route path="/search_analyze_landing" element={<ProtectedRoute><SearchAnalyzeLanding /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
