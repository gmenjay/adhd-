'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { ChecklistConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { checks: Record<string, boolean>; custom: string[]; }

interface Props { config: ChecklistConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function ChecklistTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { checks: {}, custom: [] });
  const [input, setInput] = useState('');

  const allItems = [...config.items, ...state.custom];
  const doneCount = allItems.filter((_,i) => state.checks[i] || state.checks[`c${i - config.items.length}`]).length;

  function toggle(key: string) {
    setState(s => ({ ...s, checks: { ...s.checks, [key]: !s.checks[key] } }));
  }

  function addCustom() {
    if (!input.trim()) return;
    setState(s => ({ ...s, custom: [...s.custom, input.trim()] }));
    setInput('');
  }

  const pct = allItems.length > 0 ? Math.round((doneCount / allItems.length) * 100) : 0;

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      {/* Progress */}
      {allItems.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{doneCount} of {allItems.length}</span>
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>{pct}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: config.userFillable ? '12px' : 0 }}>
        {config.items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(String(i))}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '12px 12px', background: state.checks[i] ? 'var(--surface-2)' : 'var(--bg)',
              border: `1px solid ${state.checks[i] ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
              textAlign: 'left', transition: 'all 0.15s', width: '100%',
            }}
          >
            <span style={{
              width: '20px', height: '20px', flexShrink: 0,
              border: `2px solid ${state.checks[i] ? 'var(--accent)' : 'var(--border-2)'}`,
              borderRadius: '5px', background: state.checks[i] ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: '#fff', marginTop: '1px',
            }}>
              {state.checks[i] && '✓'}
            </span>
            <span style={{ fontSize: '14px', color: state.checks[i] ? 'var(--text-3)' : 'var(--text)', textDecoration: state.checks[i] ? 'line-through' : 'none', lineHeight: 1.4, flex: 1 }}>
              {item}
            </span>
          </button>
        ))}

        {state.custom.map((item, i) => (
          <button
            key={`c${i}`}
            onClick={() => toggle(`c${i}`)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '12px 12px', background: state.checks[`c${i}`] ? 'var(--surface-2)' : 'var(--bg)',
              border: `1px solid ${state.checks[`c${i}`] ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
              textAlign: 'left', transition: 'all 0.15s', width: '100%',
            }}
          >
            <span style={{
              width: '20px', height: '20px', flexShrink: 0,
              border: `2px solid ${state.checks[`c${i}`] ? 'var(--accent)' : 'var(--border-2)'}`,
              borderRadius: '5px', background: state.checks[`c${i}`] ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: '#fff',
            }}>
              {state.checks[`c${i}`] && '✓'}
            </span>
            <span style={{ fontSize: '14px', color: state.checks[`c${i}`] ? 'var(--text-3)' : 'var(--text)', textDecoration: state.checks[`c${i}`] ? 'line-through' : 'none', lineHeight: 1.4, flex: 1 }}>
              {item}
            </span>
          </button>
        ))}
      </div>

      {/* Add custom */}
      {config.userFillable && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            placeholder="Add your own…"
            style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
          />
          <button onClick={addCustom} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            +
          </button>
        </div>
      )}
    </ToolShell>
  );
}
