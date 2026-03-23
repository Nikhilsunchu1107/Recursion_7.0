import React, { useEffect, useMemo, useState } from 'react';

import { AuthContext } from './auth-context';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let mounted = true;

    async function loadSession() {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) {
        return;
      }

      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      setError('');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      error,
      isConfigured: isSupabaseConfigured,
      isAuthenticated: Boolean(session?.access_token),
      async signInWithProvider(provider, redirectPath = '/dashboard_overview') {
        if (!supabase) {
          setError('Supabase auth is not configured yet.');
          return { error: new Error('Supabase auth is not configured yet.') };
        }

        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`;

        const result = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo },
        });

        if (result.error) {
          setError(result.error.message);
        }

        return result;
      },
      async signOut() {
        if (!supabase) {
          return;
        }

        const result = await supabase.auth.signOut();
        if (result.error) {
          setError(result.error.message);
          return result;
        }

        setSession(null);
        setUser(null);
        return result;
      },
      getAccessToken() {
        return session?.access_token ?? null;
      },
      clearError() {
        setError('');
      },
    }),
    [error, loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
