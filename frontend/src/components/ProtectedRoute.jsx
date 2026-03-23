import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/auth-context';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isConfigured, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111319] px-6 text-center text-[#c2c6d6]">
        Checking your session...
      </div>
    );
  }

  if (!isConfigured) {
    return children;
  }

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/?redirect=${encodeURIComponent(next)}`} replace />;
  }

  return children;
}
