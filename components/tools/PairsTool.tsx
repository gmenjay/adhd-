'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { PairsConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Pair { id: string; col1: string; col2: string; }
interface State { pairs: Pair[]; }

interface Props { config: PairsConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function PairsTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { pairs: [] });
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');

  function add() {
    if (!v1.trim() && !v2.trim()) return;
    setState(s => ({ pairs: [...s.pairs, { id: Date.now().toString(), col1: v1.trim(), col2: v2.trim() }] }));
    setV1(''); setV2('');
  }

  function remove(id: string) {
    setState(s => ({ pairs: s.pairs.filter(p => p.id !== id) }));
  }

  const inp = (val: string, set: (v: string) => void, ph?: string): React.CSSProperties & Record<string, unknown> => ({});

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border-2)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: '14px',
    color: 'var(--text)',
    fontFamily: 'inherit',
    outline: 'none',
    marginBottom: '8px',
  };

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      {/* Input area */}
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
          {config.col1}
        </label>
        <input
          type="text"
          value={v1}
          onChange={e => setV1(e.target.value)}
          placeholder={config.ph1 ?? ''}
          onKeyDown={e => e.key === 'Enter' && add()}
          style={inputStyle}
        />
        <label style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
          {config.col2}
        </label>
        <input
          type="text"
          value={v2}
          onChange={e => setV2(e.target.value)}
          placeholder={config.ph2 ?? ''}
          onKeyDown={e => e.key === 'Enter' && add()}
          style={{ ...inputStyle, marginBottom: '0' }}
        />
        <button
          onClick={add}
          style={{ marginTop: '10px', width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Add pair
        </button>
      </div>

      {/* Pairs list */}
      {state.pairs.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center' }}>Nothing added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {state.pairs.map(pair => (
            <div key={pair.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', position: 'relative' }}>
              {pair.col1 && <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: pair.col2 ? '4px' : 0 }}><strong style={{ color: 'var(--text-3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>{config.col1}</strong>{pair.col1}</p>}
              {pair.col2 && <p style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '6px', paddingTop: '6px', borderTop: '0.5px solid var(--border)' }}><strong style={{ color: 'var(--text-3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '2px' }}>{config.col2}</strong>{pair.col2}</p>}
              <button onClick={() => remove(pair.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px', padding: '2px' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
