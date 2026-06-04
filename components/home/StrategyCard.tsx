'use client';

import { useState } from 'react';
import type { Strategy, StrategyRating } from '@/types';

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  game:     { bg: '#FFF8EC', color: '#7A5800' },
  reflect:  { bg: '#F5F0FA', color: '#5A3A8A' },
  quick:    { bg: '#F0FAF0', color: '#3A7A38' },
  organize: { bg: '#EEF4FD', color: '#2A5090' },
  mindset:  { bg: '#FDF0F5', color: '#7A2A50' },
  tool:     { bg: '#FEF3DC', color: '#7A5A00' },
};

interface Props {
  strategy: Strategy;
  rating: StrategyRating | undefined;
  pinned: boolean;
  onRate: (id: string, rating: 'worked' | 'nope') => void;
  onPin: (id: string) => void;
  onHide: (id: string) => void;
}

export default function StrategyCard({ strategy: s, rating, pinned, onRate, onPin, onHide }: Props) {
  const [open, setOpen] = useState(false);
  const tagStyle = TAG_STYLES[s.tag] ?? TAG_STYLES.reflect;
  const worked = rating?.worked ?? 0;
  const nope = rating?.nope ?? 0;
  const total = worked + nope;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        boxShadow: open ? '0 4px 16px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Header (always visible) ──────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '13px 14px',
          cursor: 'pointer',
          gap: '10px',
          userSelect: 'none',
        }}
      >
        {/* Pin indicator */}
        <span
          style={{ fontSize: '11px', opacity: pinned ? 1 : 0.25, flexShrink: 0, cursor: 'default' }}
          onClick={e => { e.stopPropagation(); onPin(s.id); }}
          title={pinned ? 'Unpin' : 'Pin to top'}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onPin(s.id))}
          aria-label={pinned ? 'Unpin strategy' : 'Pin strategy to top'}
        >
          📌
        </span>

        <span
          style={{
            flex: 1,
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--text)',
            lineHeight: 1.3,
          }}
        >
          {s.title}
        </span>

        {/* Tag chip */}
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            background: tagStyle.bg,
            color: tagStyle.color,
            letterSpacing: '0.02em',
            flexShrink: 0,
          }}
        >
          {s.tagLabel}
        </span>

        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round"
          style={{
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="4 6 8 10 12 6" />
        </svg>
      </div>

      {/* ── Expanded body ────────────────────────────────────────────── */}
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', animation: 'fadeUp 0.15s ease both' }}>
          {/* Description */}
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-2)',
              lineHeight: 1.75,
              padding: '14px 14px 0',
              fontWeight: 300,
            }}
          >
            {s.desc}
          </p>

          {/* Vol badge + hide */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                color: 'var(--text-3)',
                background: 'var(--surface-2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Vol {s.volume}
            </span>
            <span style={{ flex: 1 }} />
            <button
              onClick={() => onHide(s.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '10px',
                color: 'var(--text-3)',
                fontFamily: 'inherit',
                padding: '2px 4px',
              }}
            >
              Hide
            </button>
          </div>

          {/* Rating row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg)',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-3)',
                fontStyle: 'italic',
                flex: 1,
              }}
            >
              Did this help?
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => onRate(s.id, 'worked')}
                style={{
                  border: `1px solid ${rating?.lastRating === 'worked' ? '#A8D4A8' : 'var(--border-2)'}`,
                  background: rating?.lastRating === 'worked' ? '#F0FAF0' : 'transparent',
                  color: rating?.lastRating === 'worked' ? '#3A7A38' : 'var(--text-3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                ✓ Worked
              </button>
              <button
                onClick={() => onRate(s.id, 'nope')}
                style={{
                  border: `1px solid ${rating?.lastRating === 'nope' ? '#F0C4B8' : 'var(--border-2)'}`,
                  background: rating?.lastRating === 'nope' ? '#FEF0EC' : 'transparent',
                  color: rating?.lastRating === 'nope' ? '#C4856A' : 'var(--text-3)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                ✗ Nope
              </button>
              {total > 0 && (
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                  {worked}/{total}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
