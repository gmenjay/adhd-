'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { KanbanConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Item { id: string; text: string; col: string; }
interface State { items: Item[]; }

interface Props { config: KanbanConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function KanbanTool({ config, strategyId, profile, onProfileChange }: Props) {
  const cols = config.columns ?? ['To-Do','Doing','On Hold','Done'];
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { items: [] });
  const [input, setInput] = useState('');

  function add() {
    if (!input.trim()) return;
    setState(s => ({ items: [...s.items, { id: Date.now().toString(), text: input.trim(), col: cols[0] }] }));
    setInput('');
  }

  function moveNext(id: string) {
    setState(s => ({ items: s.items.map(item => {
      if (item.id !== id) return item;
      const ci = cols.indexOf(item.col);
      return { ...item, col: cols[Math.min(ci+1, cols.length-1)] };
    })}));
  }

  function movePrev(id: string) {
    setState(s => ({ items: s.items.map(item => {
      if (item.id !== id) return item;
      const ci = cols.indexOf(item.col);
      return { ...item, col: cols[Math.max(ci-1, 0)] };
    })}));
  }

  function remove(id: string) {
    setState(s => ({ items: s.items.filter(i => i.id !== id) }));
  }

  return (
    <ToolShell hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && add()}
          placeholder="Add a task…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={add} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cols.map((col, ci) => {
          const items = state.items.filter(i => i.col === col);
          return (
            <div key={col}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ci === cols.length-1 ? 'var(--unmotivated-text)' : 'var(--text-3)' }}>{col}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--surface-2)', borderRadius: '100px', padding: '1px 8px' }}>{items.length}</span>
              </div>
              {items.length === 0 ? (
                <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic' }}>Empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 10px' }}>
                      <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', lineHeight: 1.3 }}>{item.text}</span>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        {ci > 0 && <button onClick={() => movePrev(item.id)} title="Move back" style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '6px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-2)' }}>←</button>}
                        {ci < cols.length-1 && <button onClick={() => moveNext(item.id)} title="Move forward" style={{ background: 'var(--accent)', border: 'none', borderRadius: '6px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', color: '#fff' }}>→</button>}
                        <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 4px' }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}
