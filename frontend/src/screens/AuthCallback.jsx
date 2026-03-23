import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/auth-context';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const nextPath = searchParams.get('next') || '/dashboard_overview';
    navigate(isAuthenticated ? nextPath : '/', { replace: true });
  }, [isAuthenticated, loading, navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111319] px-6 text-center text-[#c2c6d6]">
      Completing sign in...
    </div>
  );
}
