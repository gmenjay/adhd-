'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { RankConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Item { id: string; text: string; level: string; rank: number|null; done: boolean; }
interface State { items: Item[]; }

interface Props { config: RankConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function RankTool({ config, strategyId, profile, onProfileChange }: Props) {
  const levels = config.levels ?? ['High','Medium','Low'];
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { items: [] });
  const [input, setInput] = useState('');

  function add() {
    if (!input.trim()) return;
    setState(s => ({ items: [...s.items, { id: Date.now().toString(), text: input.trim(), level: levels[0], rank: null, done: false }] }));
    setInput('');
  }

  function setLevel(id: string, level: string) {
    setState(s => ({ items: s.items.map(i => i.id === id ? { ...i, level } : i) }));
  }

  function toggleDone(id: string) {
    setState(s => ({ items: s.items.map(i => i.id === id ? { ...i, done: !i.done } : i) }));
  }

  function remove(id: string) {
    setState(s => ({ items: s.items.filter(i => i.id !== id) }));
  }

  const levelColors: Record<string, { bg: string; color: string }> = {
    [levels[0]]: { bg: 'var(--overwhelmed-bg)', color: 'var(--overwhelmed-text)' },
    [levels[1]]: { bg: 'var(--disorganized-bg)', color: 'var(--disorganized-text)' },
    [levels[2]]: { bg: 'var(--surface-2)', color: 'var(--text-3)' },
  };

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && add()}
          placeholder="Add a task…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
        <button onClick={add} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
      </div>

      {state.items.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>Add tasks, then rate each one.</p>
      ) : (
        levels.map(level => {
          const items = state.items.filter(i => i.level === level);
          const c = levelColors[level] ?? { bg: 'var(--surface-2)', color: 'var(--text-3)' };
          return (
            <div key={level} style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, background: c.bg, display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginBottom: '8px' }}>{level}</p>
              {items.length === 0 ? <p style={{ fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic', marginLeft: '4px' }}>Nothing here</p> : (
                items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: item.done ? 'var(--surface-2)' : 'var(--bg)', border: `1px solid ${item.done ? 'var(--unmotivated-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', marginBottom: '5px', opacity: item.done ? 0.6 : 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: c.color, minWidth: '20px' }}>#{idx+1}</span>
                    <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.3 }}>{item.text}</span>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {levels.filter(l => l !== item.level).map(l => (
                        <button key={l} onClick={() => setLevel(item.id, l)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '6px', padding: '4px 7px', fontSize: '10px', cursor: 'pointer', color: 'var(--text-3)', fontFamily: 'inherit' }}>→{l.slice(0,3)}</button>
                      ))}
                      <button onClick={() => toggleDone(item.id)} style={{ background: item.done ? 'var(--unmotivated-bg)' : 'var(--accent)', border: 'none', borderRadius: '6px', padding: '4px 7px', fontSize: '11px', cursor: 'pointer', color: item.done ? 'var(--unmotivated-text)' : '#fff' }}>{item.done ? '↩' : '✓'}</button>
                      <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 3px' }}>×</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })
      )}

      {/* Items not yet assigned to displayed group */}
      {state.items.filter(i => !levels.includes(i.level)).map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '5px' }}>
          <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)' }}>{item.text}</span>
          {levels.map(l => (
            <button key={l} onClick={() => setLevel(item.id, l)} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: '6px', padding: '5px 8px', fontSize: '11px', cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'inherit' }}>{l.slice(0,4)}</button>
          ))}
        </div>
      ))}
    </ToolShell>
  );
}
