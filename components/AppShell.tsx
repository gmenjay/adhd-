'use client';

import type { UserProfile } from '@/types';

interface Props {
  profile: UserProfile;
}

export default function AppShell({ profile }: Props) {
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

        {/* Settings only — "Home" is redundant when you're on home */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--text-3)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'inherit',
            letterSpacing: '0.06em',
          }}
        >
          Settings
        </button>
      </nav>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2.5rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <h1
          className="font-heading animate-fade-up"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1.15,
          }}
        >
          Hey,{' '}
          <span style={{ color: 'var(--accent)' }}>
            {profile.name || 'you'}
          </span>
        </h1>
      </main>
    </div>
  );
}
