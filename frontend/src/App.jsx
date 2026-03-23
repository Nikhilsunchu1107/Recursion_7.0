import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './screens/LandingPage';
import CompetitorDiscovery from './screens/CompetitorDiscovery';
import DashboardOverview from './screens/DashboardOverview';
import GrowthStrategy from './screens/GrowthStrategy';
import OpportunityGaps from './screens/OpportunityGaps';
import PatternInsights from './screens/PatternInsights';
import SearchAnalyzeLanding from './screens/SearchAnalyzeLanding';
import Login from './screens/Login';
import Profile from './screens/Profile';

function RouteChangeSetup() {
  const location = useLocation();
  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteChangeSetup />
        <div className="min-h-screen bg-[#111319] text-[#e2e2eb]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard_overview" element={<DashboardOverview />} />
            <Route path="/competitor_discovery" element={<CompetitorDiscovery />} />
            <Route path="/growth_strategy" element={<GrowthStrategy />} />
            <Route path="/opportunity_gaps" element={<OpportunityGaps />} />
            <Route path="/pattern_insights" element={<PatternInsights />} />
            <Route path="/search_analyze_landing" element={<SearchAnalyzeLanding />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
