'use client';

import { useState } from 'react';
import type { BrainTrait, UserProfile } from '@/types';
import { defaultProfile, saveProfile } from '@/lib/storage';

const BRAIN_TRAITS: { id: BrainTrait; label: string; emoji: string }[] = [
  { id: 'adhd',          label: 'ADHD / ADD',           emoji: '⚡' },
  { id: 'anxiety',       label: 'Anxiety',               emoji: '😰' },
  { id: 'perfectionism', label: 'Perfectionism',         emoji: '🎯' },
  { id: 'overwhelm',     label: 'Easily overwhelmed',    emoji: '🌊' },
  { id: 'boredom',       label: 'Gets bored fast',       emoji: '😴' },
  { id: 'avoidance',     label: 'Avoidance habits',      emoji: '🏃' },
  { id: 'executive',     label: 'Executive dysfunction', emoji: '🧩' },
  { id: 'shame',         label: 'Shame spirals',         emoji: '💔' },
];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [traits, setTraits] = useState<BrainTrait[]>([]);

  function handleNameNext() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Even a nickname works.');
      return;
    }
    setNameError('');
    setStep(2);
  }

  function toggleTrait(id: BrainTrait) {
    setTraits(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  function finish(selectedTraits: BrainTrait[]) {
    const profile = defaultProfile(name.trim() || 'you');
    profile.brainTraits = selectedTraits;
    saveProfile(profile);
    onComplete(profile);
  }

  // ─── Shared styles ────────────────────────────────────────────────────────
  const btnPrimary: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 1.25rem',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  };

  const btnGhost: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-3)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  };

  // ─── Step dots ────────────────────────────────────────────────────────────
  const dots = (
    <div
      style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '1.5rem' }}
      aria-label={`Step ${step} of 2`}
    >
      {[1, 2].map(n => (
        <div
          key={n}
          style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: n <= step ? 'var(--accent)' : 'var(--border-2)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--surface)',
        padding: '0 1.5rem 2rem',
        paddingTop: 'clamp(3rem, 18vh, 8rem)',
      }}
    >
      {/* Wordmark */}
      <p
        style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          fontWeight: 500,
          marginBottom: 'clamp(2rem, 8vh, 4rem)',
        }}
      >
        Anti-Planner
      </p>

      <div
        className="animate-fade-up"
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {dots}

        {/* ── Step 1: Name ──────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1
              className="font-heading"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '1.5rem',
                textAlign: 'center',
                lineHeight: 1.25,
              }}
            >
              What should we call you?
            </h1>

            <input
              id="ob-name"
              type="text"
              autoFocus
              autoComplete="given-name"
              placeholder="Name or nickname…"
              value={name}
              onChange={e => { setName(e.target.value); if (nameError) setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleNameNext()}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: `1.5px solid ${nameError ? 'var(--overwhelmed-accent)' : 'var(--border-2)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.9rem',
                fontSize: 'var(--text-base)',
                color: 'var(--text)',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: nameError ? '0.35rem' : '1rem',
              }}
              aria-describedby={nameError ? 'name-error' : undefined}
            />
            {nameError && (
              <p
                id="name-error"
                role="alert"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--overwhelmed-accent)',
                  marginBottom: '0.75rem',
                }}
              >
                {nameError}
              </p>
            )}

            <button onClick={handleNameNext} style={btnPrimary}>
              Let&rsquo;s begin →
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
              <button onClick={() => finish([])} style={btnGhost}>
                Skip
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Traits ────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2
              className="font-heading"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '0.35rem',
                textAlign: 'center',
              }}
            >
              How does your brain work?
            </h2>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-2)',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              Pick what fits. Shapes which strategies show up first.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '7px',
                marginBottom: '1.25rem',
              }}
            >
              {BRAIN_TRAITS.map(trait => {
                const selected = traits.includes(trait.id);
                return (
                  <button
                    key={trait.id}
                    onClick={() => toggleTrait(trait.id)}
                    aria-pressed={selected}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '9px 12px',
                      background: selected ? '#FDF3EF' : 'var(--bg)',
                      border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: selected ? 'var(--text)' : 'var(--text-2)',
                      fontFamily: 'inherit',
                      fontWeight: selected ? 500 : 400,
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '15px', lineHeight: 1 }}>{trait.emoji}</span>
                    {trait.label}
                  </button>
                );
              })}
            </div>

            <button onClick={() => finish(traits)} style={btnPrimary}>
              {traits.length === 0 ? 'Skip →' : 'Done →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
              <button onClick={() => setStep(1)} style={btnGhost}>
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom anchor — keeps the screen from feeling empty */}
      <p
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-3)',
          fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        &ldquo;Your worth is not measured in productivity.&rdquo;
      </p>
    </div>
  );
}

