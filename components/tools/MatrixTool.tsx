'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { MatrixConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Item { id: string; text: string; quad: string|null; }
interface State { items: Item[]; }

interface Props { config: MatrixConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

const QUAD_COLORS: Record<string, { bg: string; text: string }> = {
  'Do Now':    { bg: 'var(--overwhelmed-bg)',  text: 'var(--overwhelmed-text)' },
  'Schedule':  { bg: 'var(--disorganized-bg)', text: 'var(--disorganized-text)' },
  'Delegate':  { bg: 'var(--stuck-bg)',        text: 'var(--stuck-text)' },
  'Drop':      { bg: 'var(--surface-2)',       text: 'var(--text-3)' },
};

export default function MatrixTool({ config, strategyId, profile, onProfileChange }: Props) {
  const quads = [config.q1??'Do Now', config.q2??'Schedule', config.q3??'Delegate', config.q4??'Drop'];
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { items: [] });
  const [input, setInput] = useState('');

  function add() {
    if (!input.trim()) return;
    setState(s => ({ items: [...s.items, { id: Date.now().toString(), text: input.trim(), quad: null }] }));
    setInput('');
  }

  function assign(id: string, quad: string) {
    setState(s => ({ items: s.items.map(i => i.id === id ? { ...i, quad } : i) }));
  }

  function remove(id: string) {
    setState(s => ({ items: s.items.filter(i => i.id !== id) }));
  }

  const unsorted = state.items.filter(i => !i.quad);

  return (
    <ToolShell hint="Brain-dump tasks, then tap where each one belongs." hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && add()}
          placeholder="Add a task…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={add} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
      </div>

      {/* Unsorted tasks */}
      {unsorted.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Sort these:</p>
          {unsorted.map(item => (
            <div key={item.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: '8px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '8px' }}>{item.text}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                {quads.map(q => {
                  const c = QUAD_COLORS[q] ?? { bg: 'var(--surface-2)', text: 'var(--text-2)' };
                  return (
                    <button key={q} onClick={() => assign(item.id, q)} style={{ background: c.bg, border: 'none', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 500, color: c.text, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Matrix quadrants */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {quads.map(q => {
          const items = state.items.filter(i => i.quad === q);
          const c = QUAD_COLORS[q] ?? { bg: 'var(--surface-2)', text: 'var(--text-2)' };
          return (
            <div key={q} style={{ background: c.bg, borderRadius: 'var(--radius-md)', padding: '10px', minHeight: '80px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.text, marginBottom: '8px' }}>{q}</p>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ flex: 1, fontSize: '12px', color: 'var(--text)', lineHeight: 1.3 }}>{item.text}</span>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'var(--text-3)', padding: '1px 2px', flexShrink: 0 }}>×</button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}
