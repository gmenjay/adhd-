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
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="font-heading"
          style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)' }}
        >
          Anti-Planner
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['Home', 'Settings'].map(label => (
            <button
              key={label}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 12px',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--text-2)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Home placeholder ────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '3rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <h1
          className="font-heading animate-fade-up"
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '0.5rem',
          }}
        >
          Hey,{' '}
          <span style={{ color: 'var(--accent)' }}>
            {profile.name || 'you'}
          </span>
          .
        </h1>
        <p
          className="animate-fade-up"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-2)',
            maxWidth: '340px',
            margin: '0 auto',
            lineHeight: 1.7,
            animationDelay: '0.05s',
          }}
        >
          No pressure. No calendar. Pick how you&rsquo;re feeling and find a strategy that meets you there.
        </p>

        <p
          className="animate-fade-up"
          style={{
            marginTop: '3rem',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-3)',
            letterSpacing: '0.08em',
            animationDelay: '0.1s',
          }}
        >
          Feeling states and strategies coming in Phase 3.
        </p>
      </main>
    </div>
  );
}
