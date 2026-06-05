'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { BreakdownConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Step { id: string; text: string; done: boolean; time?: string; }
interface State { task: string; steps: Step[]; }

interface Props { config: BreakdownConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function BreakdownTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { task: '', steps: [] });
  const [input, setInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  function addStep() {
    if (!input.trim()) return;
    const step: Step = { id: Date.now().toString(), text: input.trim(), done: false, time: timeInput.trim() || undefined };
    setState(s => ({ ...s, steps: [...s.steps, step] }));
    setInput(''); setTimeInput('');
  }

  function toggle(id: string) {
    setState(s => ({ ...s, steps: s.steps.map(st => st.id === id ? { ...st, done: !st.done } : st) }));
  }

  function remove(id: string) {
    setState(s => ({ ...s, steps: s.steps.filter(st => st.id !== id) }));
  }

  const done = state.steps.filter(s => s.done).length;
  const totalTime = state.steps.reduce((acc, s) => {
    const t = parseInt(s.time ?? '0');
    return acc + (isNaN(t) ? 0 : t);
  }, 0);

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      <input type="text" value={state.task} onChange={e => setState(s => ({...s, task: e.target.value}))}
        placeholder="What's the big task?"
        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', fontWeight: 500, color: 'var(--text)', fontFamily: 'inherit', outline: 'none', marginBottom: '12px' }} />

      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && addStep()}
          placeholder="One step…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
        <input type="text" value={timeInput} onChange={e => setTimeInput(e.target.value)}
          placeholder="mins"
          style={{ width: '60px', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 8px', fontSize: '13px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
        <button onClick={addStep} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 14px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
      </div>

      {state.steps.length > 0 && (
        <>
          {done > 0 && (
            <div style={{ height: '4px', background: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ height: '100%', width: `${(done/state.steps.length)*100}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {state.steps.map((step, i) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: step.done ? 'var(--surface-2)' : 'var(--bg)', border: `1px solid ${step.done ? 'var(--unmotivated-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', opacity: step.done ? 0.6 : 1, transition: 'all 0.15s' }}>
                <button onClick={() => toggle(step.id)} style={{
                  width: '22px', height: '22px', flexShrink: 0,
                  border: `2px solid ${step.done ? 'var(--accent)' : 'var(--border-2)'}`,
                  borderRadius: '50%', background: step.done ? 'var(--accent)' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff',
                }}>{step.done ? '✓' : <span style={{ color: 'var(--text-3)', fontSize: '10px', fontWeight: 600 }}>{i+1}</span>}</button>
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', textDecoration: step.done ? 'line-through' : 'none', lineHeight: 1.3 }}>{step.text}</span>
                {step.time && <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>{step.time}m</span>}
                <button onClick={() => remove(step.id)} style={{ background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 3px', flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>

          {totalTime > 0 && (
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', textAlign: 'right' }}>
              Total: ~{totalTime} min{totalTime !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </ToolShell>
  );
}
