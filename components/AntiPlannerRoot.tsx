'use client';

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/types';
import { loadProfile } from '@/lib/storage';
import { restoreTheme } from '@/lib/theme';
import Onboarding from '@/components/onboarding/Onboarding';
import AppShell from '@/components/AppShell';

type AppState = 'loading' | 'onboarding' | 'app';

export default function AntiPlannerRoot() {
  const [state, setState] = useState<AppState>('loading');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // ── On mount: check for existing profile ─────────────────────────────────
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      restoreTheme(saved); // apply saved palette + font size before first render
      setProfile(saved);
      setState('app');
    } else {
      setState('onboarding');
    }
  }, []);

  // ── Onboarding complete ───────────────────────────────────────────────────
  function handleOnboardingComplete(newProfile: UserProfile) {
    setProfile(newProfile);
    setState('app');
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (state === 'loading') {
    // Blank screen — avoids flash. Resolves in one tick.
    return (
      <div
        style={{ minHeight: '100svh', background: 'var(--bg)' }}
        aria-hidden="true"
      />
    );
  }

  if (state === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (state === 'app' && profile) {
    return <AppShell profile={profile} />;
  }

  return null;
}
