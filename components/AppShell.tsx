'use client';

import { useEffect, useState } from 'react';
import type { FeelingId, UserProfile } from '@/types';
import { restoreTheme } from '@/lib/theme';
import { saveProfile } from '@/lib/storage';
import SettingsPanel from '@/components/settings/SettingsPanel';
import FeelingGrid from '@/components/home/FeelingGrid';
import StrategyPanel from '@/components/home/StrategyPanel';

interface Props {
  profile: UserProfile;
}

export default function AppShell({ profile: initialProfile }: Props) {
  const [profile, setProfile]           = useState(initialProfile);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feeling, setFeeling]           = useState<FeelingId | null>(
    initialProfile.lastFeeling ?? null
  );

  // Restore theme on mount
  useEffect(() => {
    restoreTheme(profile);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist last feeling to profile for session restore
  function handleFeelingChange(id: FeelingId | null) {
    setFeeling(id);
    const updated = { ...profile, lastFeeling: id ?? undefined };
    saveProfile(updated);
    setProfile(updated);
  }

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(250,250,248,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '0.5px solid var(--border)',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="font-heading"
          style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text)' }}
        >
          Anti-Planner
        </span>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          aria-expanded={settingsOpen}
          aria-controls="settings-panel"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: settingsOpen ? 'var(--accent)' : 'var(--text-3)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'inherit',
            letterSpacing: '0.06em',
            transition: 'color 0.15s',
          }}
        >
          Settings
        </button>
      </nav>

      {/* ── Settings panel ─────────────────────────────────────────────── */}
      {settingsOpen && (
        <div id="settings-panel">
          <SettingsPanel profile={profile} onProfileChange={setProfile} />
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem 1.25rem 5rem',
        }}
      >
        {/* Greeting */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1
            className="font-heading animate-fade-up"
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 600,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: '0.3rem',
            }}
          >
            {greeting},{' '}
            <span style={{ color: 'var(--accent)' }}>{profile.name || 'you'}</span>
          </h1>
          <p
            className="animate-fade-up"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-3)',
              animationDelay: '0.04s',
            }}
          >
            How are you feeling right now?
          </p>
        </div>

        {/* Feeling grid */}
        <FeelingGrid active={feeling} onChange={handleFeelingChange} />

        {/* Strategy panel — appears when a feeling is selected */}
        {feeling && (
          <StrategyPanel
            key={feeling} // remount on feeling change to reset show-more state
            feeling={feeling}
            profile={profile}
            onProfileChange={p => { setProfile(p); }}
          />
        )}
      </main>
    </div>
  );
}
