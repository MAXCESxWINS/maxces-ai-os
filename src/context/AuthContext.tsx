import React, { createContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, AuthContextType } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'maxces_guest_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(GUEST_STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Prevent duplicate profile fetches if user ID has not changed
  const lastFetchedUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (lastFetchedUserIdRef.current === userId && profile) {
      return;
    }

    try {
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchErr) {
        console.error('[MAXCES Auth] Error fetching profile:', fetchErr.message);
        setError(new Error(fetchErr.message));
      } else if (data) {
        setProfile(data as UserProfile);
        lastFetchedUserIdRef.current = userId;
      }
    } catch (err) {
      console.error('[MAXCES Auth] Unexpected error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown profile fetch error'));
    }
  }, [profile]);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Session Restoration
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // If real user is logged in, exit guest mode
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        fetchProfile(session.user.id).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('[MAXCES Auth] Error checking session:', err);
      if (isMounted) setIsLoading(false);
    });

    // 2. Realtime Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        setIsGuest(false);
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
        lastFetchedUserIdRef.current = null;
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const enableGuestMode = useCallback(() => {
    setIsGuest(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(GUEST_STORAGE_KEY, 'true');
    }
  }, []);

  const exitGuestMode = useCallback(() => {
    setIsGuest(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsGuest(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
      }
      lastFetchedUserIdRef.current = null;
    } catch (err) {
      console.error('[MAXCES Auth] Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    if (user?.id) {
      lastFetchedUserIdRef.current = null;
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      isGuest,
      isLoading,
      error,
      signOut,
      enableGuestMode,
      exitGuestMode,
      refetchProfile,
    }),
    [user, session, profile, isGuest, isLoading, error, signOut, enableGuestMode, exitGuestMode, refetchProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
