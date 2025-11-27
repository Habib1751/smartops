"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseClient';

type DemoUser = { email: string; displayName?: string } | null;

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primary: Firebase auth if available
    if (auth) {
      const unsub = onAuthStateChanged(auth as any, (u) => {
        setUser(u);
        setLoading(false);
      });
      return () => unsub();
    }

    // Fallback: demo user from localStorage
    const existing = localStorage.getItem('demoUser');
    if (existing) {
      try {
        setUser(JSON.parse(existing));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'demoUser') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { user, loading };
}

export function signInDemo() {
  const demo: DemoUser = { email: 'demo@example.com', displayName: 'Demo User' };
  localStorage.setItem('demoUser', JSON.stringify(demo));
  // trigger storage event for same-tab listeners
  window.dispatchEvent(new StorageEvent('storage', { key: 'demoUser', newValue: JSON.stringify(demo) }));
}

export function signOutDemo() {
  localStorage.removeItem('demoUser');
  window.dispatchEvent(new StorageEvent('storage', { key: 'demoUser', newValue: null }));
}

export default useAuth;
