'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Villain { id: string; name: string; caught: boolean; }
interface State { villains: Villain[]; }

interface Props { strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function WantedTool({ strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { villains: [] });
  const [input, setInput] = useState('');

  function add() {
    if (!input.trim()) return;
    setState(s => ({ villains: [...s.villains, { id: Date.now().toString(), name: input.trim(), caught: false }] }));
    setInput('');
  }

  function catch_(id: string) {
    setState(s => ({ villains: s.villains.map(v => v.id === id ? { ...v, caught: true } : v) }));
  }

  function remove(id: string) {
    setState(s => ({ villains: s.villains.filter(v => v.id !== id) }));
  }

  const remaining = state.villains.filter(v => !v.caught).length;
  const total = state.villains.length;

  return (
    <ToolShell hint="Add your most-avoided tasks as villains. Knock them out one by one." hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && add()}
          placeholder="Add a task villain…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={add} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
      </div>

      {total > 0 && (
        <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px' }}>
          {total - remaining} of {total} caught
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {state.villains.map(v => (
          <div key={v.id} style={{
            background: v.caught ? 'var(--surface-2)' : 'var(--bg)',
            border: `2px solid ${v.caught ? 'var(--unmotivated-accent)' : 'var(--border-2)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            textAlign: 'center',
            position: 'relative',
            opacity: v.caught ? 0.5 : 1,
            transition: 'all 0.2s',
          }}>
            {/* Villain "portrait" placeholder */}
            <div style={{
              width: '100%',
              aspectRatio: '1',
              background: v.caught ? 'var(--surface-2)' : 'var(--surface-2)',
              borderRadius: '8px',
              border: '1px dashed var(--border-2)',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              {v.caught ? '✓' : '😤'}
            </div>

            <p style={{ fontSize: '12px', fontWeight: 600, color: v.caught ? 'var(--text-3)' : 'var(--text)', textDecoration: v.caught ? 'line-through' : 'none', lineHeight: 1.3, marginBottom: '8px' }}>
              {v.name}
            </p>

            {!v.caught ? (
              <button onClick={() => catch_(v.id)} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '7px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Caught! ✓
              </button>
            ) : (
              <p style={{ fontSize: '11px', color: 'var(--unmotivated-text)', fontWeight: 600 }}>CAUGHT</p>
            )}

            <button onClick={() => remove(v.id)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'var(--text-3)', padding: '2px' }}>×</button>
          </div>
        ))}
      </div>

      {total > 0 && remaining === 0 && (
        <div style={{ background: 'var(--unmotivated-bg)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center', marginTop: '12px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--unmotivated-text)' }}>🎉 All villains caught!</p>
        </div>
      )}
    </ToolShell>
  );
}
