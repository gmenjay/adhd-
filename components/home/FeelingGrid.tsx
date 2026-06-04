'use client';

import type { FeelingId } from '@/types';

interface Feeling {
  id: FeelingId;
  label: string;
  emoji: string;
  bgVar: string;
  accentVar: string;
  textVar: string;
}

const FEELINGS: Feeling[] = [
  { id: 'stuck',        label: 'Stuck',        emoji: '🧱', bgVar: '--stuck-bg',        accentVar: '--stuck-accent',        textVar: '--stuck-text' },
  { id: 'overwhelmed',  label: 'Overwhelmed',  emoji: '🌊', bgVar: '--overwhelmed-bg',  accentVar: '--overwhelmed-accent',  textVar: '--overwhelmed-text' },
  { id: 'unmotivated',  label: 'Unmotivated',  emoji: '🪫', bgVar: '--unmotivated-bg',  accentVar: '--unmotivated-accent',  textVar: '--unmotivated-text' },
  { id: 'disorganized', label: 'Disorganized', emoji: '🌀', bgVar: '--disorganized-bg', accentVar: '--disorganized-accent', textVar: '--disorganized-text' },
  { id: 'discouraged',  label: 'Discouraged',  emoji: '💔', bgVar: '--discouraged-bg',  accentVar: '--discouraged-accent',  textVar: '--discouraged-text' },
];

interface Props {
  active: FeelingId | null;
  onChange: (id: FeelingId | null) => void;
}

export default function FeelingGrid({ active, onChange }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: '1.75rem',
      }}
    >
      {FEELINGS.map(f => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(isActive ? null : f.id)}
            aria-pressed={isActive}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 6px 12px',
              background: isActive ? `var(${f.bgVar})` : 'var(--surface)',
              border: `1.5px solid ${isActive ? `var(${f.accentVar})` : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? `0 2px 12px color-mix(in srgb, var(${f.accentVar}) 20%, transparent)` : '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{f.emoji}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: isActive ? `var(${f.textVar})` : 'var(--text-2)',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Export for use by other components
export { FEELINGS };
