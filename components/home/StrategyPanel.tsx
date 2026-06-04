'use client';

import { useState, useMemo } from 'react';
import type { FeelingId, UserProfile } from '@/types';
import { getSortedStrategies, applyFrogFilter, applyEasyWinFilter } from '@/lib/strategies';
import { saveProfile } from '@/lib/storage';
import StrategyCard from './StrategyCard';

const FEELING_META: Record<FeelingId, { label: string; desc: string }> = {
  stuck:        { label: 'Stuck',        desc: 'You know what needs doing. Starting it is the problem.' },
  overwhelmed:  { label: 'Overwhelmed',  desc: 'Too much. Your brain can\'t pick a lane right now.' },
  unmotivated:  { label: 'Unmotivated',  desc: 'You could do it. You just don\'t want to. That\'s okay.' },
  disorganized: { label: 'Disorganized', desc: 'Things are scattered. Let\'s find a place to start.' },
  discouraged:  { label: 'Discouraged',  desc: 'You\'ve tried. It didn\'t stick. That\'s not the end.' },
};

const FROG_MODES = [
  { id: 'frog', label: '🐸 Swallow the Frog', desc: 'Tackle it head-on' },
  { id: 'win',  label: '✨ Easy Win',          desc: 'Build momentum first' },
] as const;

type FrogMode = 'frog' | 'win';
const DEFAULT_SHOW = 3;

interface Props {
  feeling: FeelingId;
  profile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
}

export default function StrategyPanel({ feeling, profile, onProfileChange }: Props) {
  const [mode, setMode] = useState<FrogMode>('frog');
  const [showAll, setShowAll] = useState(false);

  const meta = FEELING_META[feeling];

  // ── Sorted strategies for this feeling ────────────────────────────────
  const sorted = useMemo(() => {
    const base = getSortedStrategies(
      feeling,
      profile.scope,
      profile.brainTraits,
      profile.strategyRatings,
      profile.pinnedStrategies,
      profile.hiddenStrategies
    );
    return mode === 'frog' ? applyFrogFilter(base) : applyEasyWinFilter(base);
  }, [feeling, mode, profile]);

  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_SHOW);

  // ── Profile update helpers ─────────────────────────────────────────────
  function rate(id: string, value: 'worked' | 'nope') {
    const ratings = { ...profile.strategyRatings };
    if (!ratings[id]) ratings[id] = { worked: 0, nope: 0 };
    ratings[id] = {
      worked:     value === 'worked' ? ratings[id].worked + 1 : ratings[id].worked,
      nope:       value === 'nope'   ? ratings[id].nope + 1   : ratings[id].nope,
      lastRating: value,
    };
    const updated = { ...profile, strategyRatings: ratings };
    saveProfile(updated);
    onProfileChange(updated);
  }

  function togglePin(id: string) {
    const pinned = profile.pinnedStrategies.includes(id)
      ? profile.pinnedStrategies.filter(p => p !== id)
      : [...profile.pinnedStrategies, id];
    const updated = { ...profile, pinnedStrategies: pinned };
    saveProfile(updated);
    onProfileChange(updated);
  }

  function hideStrategy(id: string) {
    const hidden = [...profile.hiddenStrategies, id];
    const updated = { ...profile, hiddenStrategies: hidden };
    saveProfile(updated);
    onProfileChange(updated);
  }

  return (
    <div className="animate-fade-up" style={{ marginBottom: '2rem' }}>

      {/* ── Feeling header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2
          className="font-heading"
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '0.2rem',
          }}
        >
          {meta.label}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>
          {meta.desc}
        </p>
      </div>

      {/* ── Frog / Easy Win toggle ───────────────────────────────────── */}
      <div
        style={{
          display: 'inline-flex',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: '1.25rem',
        }}
      >
        {FROG_MODES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setShowAll(false); }}
            aria-pressed={mode === m.id}
            title={m.desc}
            style={{
              padding: '7px 16px',
              border: 'none',
              borderRight: i === 0 ? '1px solid var(--border-2)' : 'none',
              background: mode === m.id ? 'var(--accent)' : 'transparent',
              color: mode === m.id ? '#fff' : 'var(--text-2)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Sub-category label ───────────────────────────────────────── */}
      {profile.showSubCategories && visible.length > 0 && (
        <p
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
            marginBottom: '0.6rem',
          }}
        >
          {visible[0].subCategory}
        </p>
      )}

      {/* ── Strategy cards ───────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', fontStyle: 'italic' }}>
          No strategies available — check your scope in Settings.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visible.map(s => (
            <StrategyCard
              key={s.id}
              strategy={s}
              rating={profile.strategyRatings[s.id]}
              pinned={profile.pinnedStrategies.includes(s.id)}
              onRate={rate}
              onPin={togglePin}
              onHide={hideStrategy}
            />
          ))}

          {/* Show more / less */}
          {sorted.length > DEFAULT_SHOW && (
            <button
              onClick={() => setShowAll(o => !o)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-3)',
                fontFamily: 'inherit',
                padding: '6px 0',
                textAlign: 'left',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {showAll
                ? 'Show fewer'
                : `+ ${sorted.length - DEFAULT_SHOW} more strategies`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
