'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { ListConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Item { id: string; text: string; done: boolean; }
interface State { items: Item[]; }

interface Props { config: ListConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function ListTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { items: [] });
  const [input, setInput] = useState('');

  function add() {
    const text = input.trim();
    if (!text) return;
    const item: Item = { id: Date.now().toString(), text, done: false };
    setState(s => ({ items: [...s.items, item] }));
    setInput('');
  }

  function toggle(id: string) {
    setState(s => ({ items: s.items.map(i => i.id === id ? { ...i, done: !i.done } : i) }));
  }

  function remove(id: string) {
    setState(s => ({ items: s.items.filter(i => i.id !== id) }));
  }

  const doneCount = state.items.filter(i => i.done).length;

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={config.placeholder ?? 'Add item…'}
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
        />
        <button
          onClick={add}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          {config.addLabel ?? 'Add'}
        </button>
      </div>

      {state.items.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
          {config.emptyMsg ?? 'Nothing here yet.'}
        </p>
      ) : (
        <>
          {config.checkable && doneCount > 0 && (
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px' }}>
              {doneCount} of {state.items.length} done
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {state.items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  opacity: item.done ? 0.5 : 1,
                }}
              >
                {config.checkable && (
                  <button
                    onClick={() => toggle(item.id)}
                    aria-label={item.done ? 'Uncheck' : 'Check'}
                    style={{
                      width: '22px', height: '22px', flexShrink: 0,
                      border: `2px solid ${item.done ? 'var(--accent)' : 'var(--border-2)'}`,
                      borderRadius: '6px',
                      background: item.done ? 'var(--accent)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: '#fff',
                    }}
                  >
                    {item.done && '✓'}
                  </button>
                )}
                <span style={{ flex: 1, fontSize: '14px', color: 'var(--text)', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
                  {item.text}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', lineHeight: 1, flexShrink: 0 }}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
}
