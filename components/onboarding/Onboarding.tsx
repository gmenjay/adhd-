'use client';

import { useState } from 'react';
import type { BrainTrait, UserProfile } from '@/types';
import { defaultProfile, saveProfile } from '@/lib/storage';

const BRAIN_TRAITS: { id: BrainTrait; label: string; emoji: string }[] = [
  { id: 'adhd',         label: 'ADHD / ADD',           emoji: '⚡' },
  { id: 'anxiety',      label: 'Anxiety',               emoji: '😰' },
  { id: 'perfectionism',label: 'Perfectionism',         emoji: '🎯' },
  { id: 'overwhelm',    label: 'Easily overwhelmed',    emoji: '🌊' },
  { id: 'boredom',      label: 'Gets bored fast',       emoji: '😴' },
  { id: 'avoidance',    label: 'Avoidance habits',      emoji: '🏃' },
  { id: 'executive',    label: 'Executive dysfunction', emoji: '🧩' },
  { id: 'shame',        label: 'Shame spirals',         emoji: '💔' },
];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [traits, setTraits] = useState<BrainTrait[]>([]);

  // ─── Micro-copy variants for heading ─────────────────────────────────────
  const greetings = [
    "Let's build something that actually works for you.",
    "No productivity guilt here. Promise.",
    "This one's built for your brain, not against it.",
  ];
  const greeting = greetings[0]; // deterministic on first render

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function handleNameNext() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('We need something to call you — even a nickname works.');
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

  function skip() {
    finish([]);
  }

  // ─── Step dots ────────────────────────────────────────────────────────────
  const dots = (
    <div className="flex gap-1.5 justify-center mb-8" aria-label={`Step ${step} of 2`}>
      {[1, 2].map(n => (
        <div
          key={n}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{ background: n <= step ? 'var(--accent)' : 'var(--border-2)' }}
        />
      ))}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-svh flex items-center justify-center px-5 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-md animate-fade-up"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem 2rem',
          boxShadow: '0 4px 32px rgba(30,25,20,0.07)',
        }}
      >
        {dots}

        {step === 1 && (
          <div className="animate-fade-in">
            <p
              className="text-center mb-1"
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                fontWeight: 500,
              }}
            >
              Anti-Planner
            </p>
            <h1
              className="text-center font-heading mb-3"
              style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--text)' }}
            >
              {greeting}
            </h1>
            <p
              className="text-center mb-8"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.7 }}
            >
              No dates. No calendar. No tracking. Just strategies that meet you
              where you are, right now.
            </p>

            <div className="mb-2">
              <label
                htmlFor="ob-name"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  color: 'var(--text-3)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                What should we call you?
              </label>
              <input
                id="ob-name"
                type="text"
                autoComplete="given-name"
                placeholder="Your name or nickname…"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (nameError) setNameError('');
                }}
                onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                style={{
                  width: '100%',
                  background: 'var(--bg)',
                  border: `1px solid ${nameError ? 'var(--overwhelmed-accent)' : 'var(--border-2)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.9rem',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text)',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  fontFamily: 'inherit',
                }}
                aria-describedby={nameError ? 'name-error' : undefined}
              />
              {nameError && (
                <p
                  id="name-error"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--overwhelmed-accent)',
                    marginTop: '0.4rem',
                  }}
                  role="alert"
                >
                  {nameError}
                </p>
              )}
            </div>

            <button
              onClick={handleNameNext}
              style={{
                width: '100%',
                marginTop: '1rem',
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
              }}
            >
              Let&rsquo;s begin →
            </button>

            <div className="text-center mt-4">
              <button
                onClick={skip}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Skip setup — take me straight in
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2
              className="text-center font-heading mb-2"
              style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text)' }}
            >
              How does your brain work,{' '}
              <span style={{ color: 'var(--accent)' }}>{name.trim()}?</span>
            </h2>
            <p
              className="text-center mb-6"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.7 }}
            >
              Check everything that fits. This shapes which strategies show up first for you.
              Nothing is required.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '1.5rem',
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
                      gap: '8px',
                      padding: '10px 14px',
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
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{trait.emoji}</span>
                    {trait.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => finish(traits)}
              style={{
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
              }}
            >
              {traits.length === 0 ? 'Skip this step →' : 'Build my planner →'}
            </button>

            <div className="text-center mt-3">
              <button
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
