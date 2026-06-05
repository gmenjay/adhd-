'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { CoinConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Task { id: string; text: string; result: 'heads'|'tails'|null; }
interface State { tasks: Task[]; }

interface Props { config: CoinConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function CoinTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { tasks: [] });
  const [input, setInput] = useState('');
  const [flipping, setFlipping] = useState<string | null>(null);

  function add() {
    if (!input.trim()) return;
    setState(s => ({ tasks: [...s.tasks, { id: Date.now().toString(), text: input.trim(), result: null }] }));
    setInput('');
  }

  function flip(id: string) {
    setFlipping(id);
    setTimeout(() => {
      const result: 'heads'|'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
      setState(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, result } : t) }));
      setFlipping(null);
    }, 600);
  }

  function remove(id: string) {
    setState(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
  }

  return (
    <ToolShell hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a task…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
        />
        <button onClick={add} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          Add
        </button>
      </div>

      {state.tasks.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
          Add your tasks, then flip for each one.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {state.tasks.map(task => (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
              background: task.result === 'heads' ? 'var(--unmotivated-bg)' : task.result === 'tails' ? 'var(--surface-2)' : 'var(--bg)',
            }}>
              <span style={{ flex: 1, fontSize: '14px', color: 'var(--text)', textDecoration: task.result === 'tails' ? 'line-through' : 'none', lineHeight: 1.4 }}>{task.text}</span>

              {task.result ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '18px' }}>{task.result === 'heads' ? '🪙' : '🌑'}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: task.result === 'heads' ? 'var(--unmotivated-text)' : 'var(--text-3)' }}>
                    {task.result === 'heads' ? config.heads ?? 'Do it!' : config.tails ?? 'Skip it.'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => flip(task.id)}
                  disabled={flipping === task.id}
                  style={{
                    background: 'var(--accent)', color: '#fff', border: 'none',
                    borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: '13px',
                    fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    animation: flipping === task.id ? 'spin 0.6s linear' : 'none',
                  }}
                >
                  {flipping === task.id ? '🪙' : 'Flip'}
                </button>
              )}

              <button onClick={() => remove(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px', padding: '2px', flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotateY(0)} 100%{transform:rotateY(720deg)} }`}</style>
    </ToolShell>
  );
}
