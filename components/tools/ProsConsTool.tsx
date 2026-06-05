'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { ProsConsConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Entry { id: string; text: string; points: number; }
interface State { context: string; pros: Entry[]; cons: Entry[]; }

interface Props { config: ProsConsConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function ProsConsTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { context: '', pros: [], cons: [] });
  const [proIn, setProIn] = useState('');
  const [conIn, setConIn] = useState('');

  function addEntry(side: 'pros'|'cons', text: string) {
    if (!text.trim()) return;
    const entry: Entry = { id: Date.now().toString(), text: text.trim(), points: 1 };
    setState(s => ({ ...s, [side]: [...s[side], entry] }));
    side === 'pros' ? setProIn('') : setConIn('');
  }

  function bump(side: 'pros'|'cons', id: string, delta: number) {
    setState(s => ({ ...s, [side]: s[side].map(e => e.id === id ? { ...e, points: Math.max(1, e.points + delta) } : e) }));
  }

  function remove(side: 'pros'|'cons', id: string) {
    setState(s => ({ ...s, [side]: s[side].filter(e => e.id !== id) }));
  }

  const proTotal = state.pros.reduce((a,b) => a+b.points, 0);
  const conTotal = state.cons.reduce((a,b) => a+b.points, 0);
  const winner = proTotal > conTotal ? 'pros' : conTotal > proTotal ? 'cons' : null;

  const colStyle = (side: 'pros'|'cons'): React.CSSProperties => ({
    flex: 1,
    background: side === 'pros' ? '#F0FAF0' : '#FEF0EC',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
  });

  return (
    <ToolShell hasState={hasState} onReset={reset}>
      <input type="text" value={state.context} onChange={e => setState(s => ({...s, context: e.target.value}))}
        placeholder={config.context ?? 'What are you deciding?'}
        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', marginBottom: '12px' }} />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        {(['pros','cons'] as const).map(side => (
          <div key={side} style={colStyle(side)}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: side === 'pros' ? '#2A6318' : '#6B3020', marginBottom: '8px' }}>
              {side === 'pros' ? '✓ Pros' : '✗ Cons'}
            </p>

            {state[side].map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', lineHeight: 1.3 }}>{e.text}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  <button onClick={() => bump(side, e.id, -1)} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>−</button>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', minWidth: '20px', textAlign: 'center' }}>{e.points}</span>
                  <button onClick={() => bump(side, e.id, 1)} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>+</button>
                  <button onClick={() => remove(side, e.id)} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'var(--text-3)', padding: '1px 2px' }}>×</button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <input type="text" value={side === 'pros' ? proIn : conIn}
                onChange={e => side === 'pros' ? setProIn(e.target.value) : setConIn(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEntry(side, side === 'pros' ? proIn : conIn)}
                placeholder="Add…"
                style={{ flex: 1, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
              <button onClick={() => addEntry(side, side === 'pros' ? proIn : conIn)}
                style={{ background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)' }}>+</button>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', marginTop: '8px', textAlign: 'right' }}>Total: {side === 'pros' ? proTotal : conTotal}</p>
          </div>
        ))}
      </div>

      {(proTotal > 0 || conTotal > 0) && (
        <div style={{ background: winner === 'pros' ? '#F0FAF0' : winner === 'cons' ? '#FEF0EC' : 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', textAlign: 'center' }}>
          {winner === null ? (
            <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>It\'s a tie — {proTotal} each. Your gut knows.</p>
          ) : (
            <p style={{ fontSize: '14px', fontWeight: 600, color: winner === 'pros' ? '#2A6318' : '#6B3020' }}>
              {winner === 'pros' ? `✓ Pros win (${proTotal} vs ${conTotal}). Do it.` : `✗ Cons win (${conTotal} vs ${proTotal}). Don't.`}
            </p>
          )}
        </div>
      )}
    </ToolShell>
  );
}
