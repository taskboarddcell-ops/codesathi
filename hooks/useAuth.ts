import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook to manage authentication state
 * Handles session initialization, verification code exchange, and auth state changes
 */
export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const clearLocalAuthJunk = () => {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes('sb-') && k.includes('auth-token')) {
            localStorage.removeItem(k);
          }
        });
        localStorage.removeItem('pending_profile');
      } catch {
        // ignore storage errors
      }
    };

    const consumeVerificationCode = async (): Promise<void> => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) return;

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession({ code });
      url.searchParams.delete('code');
      url.searchParams.delete('type');
      window.history.replaceState({}, document.title, url.toString());

      if (exchangeError) {
        console.error('Email verification exchange failed', exchangeError);
        setError('Verification link is invalid or expired. Please log in again.');
      }
    };

    const boot = async () => {
      setLoading(true);
      await consumeVerificationCode();

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!alive) return;

      if (sessionError) {
        await supabase.auth.signOut();
        clearLocalAuthJunk();
        setLoading(false);
        return;
      }

      const session = data.session;
      if (session?.user) {
        setUserId(session.user.id);
      }
      
      setLoading(false);
    };

    boot();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;

      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setError(null);
  };

  return {
    userId,
    isAuthenticated: !!userId,
    loading,
    error,
    setError,
    signOut,
  };
};
