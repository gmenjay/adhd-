'use client';

import { PALETTES, FONT_SIZES, applyTheme, applyMode, type FontSizeId, type ThemeMode } from '@/lib/theme';
import { saveProfile } from '@/lib/storage';
import type { UserProfile } from '@/types';

interface Props {
  profile: UserProfile;
  onProfileChange: (updated: UserProfile) => void;
}

export default function SettingsPanel({ profile, onProfileChange }: Props) {
  const currentPalette = profile.themeAccent ?? 'warm';
  const currentSize    = profile.themeFontSize ?? 'default';

  function selectPalette(id: string) {
    const updated = { ...profile, themeAccent: id };
    applyTheme(id, currentSize);
    saveProfile(updated);
    onProfileChange(updated);
  }

  function selectSize(id: FontSizeId) {
    const updated = { ...profile, themeFontSize: id };
    applyTheme(currentPalette, id);
    saveProfile(updated);
    onProfileChange(updated);
  }

  function toggleMode() {
    const next: ThemeMode = profile.themeMode === 'dark' ? 'light' : 'dark';
    const updated = { ...profile, themeMode: next };
    applyMode(next);
    saveProfile(updated);
    onProfileChange(updated);
  }

  const isDark = profile.themeMode === 'dark';

  return (
    <div
      style={{
        borderBottom: '0.5px solid var(--border)',
        padding: '1.25rem',
        background: 'var(--surface)',
        animation: 'fadeUp 0.2s ease both',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >

        {/* ── Color ──────────────────────────────────────────────────── */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            Color
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {PALETTES.map(p => (
              <button
                key={p.id}
                onClick={() => selectPalette(p.id)}
                aria-pressed={currentPalette === p.id}
                aria-label={p.label}
                title={p.label}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: p.swatch,
                  border: currentPalette === p.id
                    ? `3px solid var(--text)`
                    : '3px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: 0,
                  transition: 'transform 0.15s, border-color 0.15s',
                  transform: currentPalette === p.id ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Font size ───────────────────────────────────────────────── */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            Text size
          </p>
          <div
            style={{
              display: 'inline-flex',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            {FONT_SIZES.map((f, i) => (
              <button
                key={f.id}
                onClick={() => selectSize(f.id as FontSizeId)}
                aria-pressed={currentSize === f.id}
                style={{
                  padding: '5px 16px',
                  border: 'none',
                  borderRight: i < FONT_SIZES.length - 1 ? '1px solid var(--border-2)' : 'none',
                  background: currentSize === f.id ? 'var(--text)' : 'transparent',
                  color: currentSize === f.id ? 'var(--surface)' : 'var(--text-2)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: f.size,
                  transition: 'all 0.15s',
                  lineHeight: 1,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Light / Dark ─────────────────────────────────────────────── */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
            }}
          >
            Appearance
          </p>
          <button
            onClick={toggleMode}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 14px 5px 6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'var(--text-2)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              transition: 'border-color 0.15s',
            }}
          >
            {/* Track */}
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '36px',
                height: '20px',
                borderRadius: '10px',
                background: isDark ? 'var(--text)' : 'var(--border-2)',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              {/* Thumb */}
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isDark ? '19px' : '3px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </span>
            {isDark ? 'Dark' : 'Light'}
          </button>
        </div>

      </div>
    </div>
  );
}
