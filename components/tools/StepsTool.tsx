'use client';

import type { UserProfile } from '@/types';
import type { StepsConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { checked: boolean[]; note: string; }

interface Props { config: StepsConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function StepsTool({ config, strategyId, profile, onProfileChange }: Props) {
  const def: State = { checked: Array(config.steps.length).fill(false), note: '' };
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, def);

  function toggleStep(i: number) {
    const checked = [...(state.checked.length === config.steps.length ? state.checked : def.checked)];
    checked[i] = !checked[i];
    setState(s => ({...s, checked}));
  }

  const done = (state.checked ?? []).filter(Boolean).length;

  return (
    <ToolShell hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: config.noteLabel ? '14px' : 0 }}>
        {config.steps.map((step, i) => {
          const checked = state.checked?.[i] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggleStep(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px', background: checked ? 'var(--surface-2)' : 'var(--bg)',
                border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', transition: 'all 0.15s', width: '100%',
              }}
            >
              <span style={{
                width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%',
                background: checked ? 'var(--accent)' : 'transparent',
                border: `2px solid ${checked ? 'var(--accent)' : 'var(--border-2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#fff', fontWeight: 700, marginTop: '1px',
              }}>
                {checked ? '✓' : <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>{i+1}</span>}
              </span>
              <span style={{ fontSize: '14px', color: checked ? 'var(--text-3)' : 'var(--text)', textDecoration: checked ? 'line-through' : 'none', lineHeight: 1.5, flex: 1 }}>
                {step}
              </span>
            </button>
          );
        })}
      </div>

      {done === config.steps.length && (
        <div style={{ background: 'var(--unmotivated-bg)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center', marginBottom: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--unmotivated-text)', fontWeight: 500 }}>All steps done ✓</p>
        </div>
      )}

      {config.noteLabel && (
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-2)', fontWeight: 500, marginBottom: '6px' }}>{config.noteLabel}</label>
          <textarea
            value={state.note ?? ''}
            onChange={e => setState(s => ({...s, note: e.target.value}))}
            placeholder={config.notePlaceholder ?? ''}
            rows={2}
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>
      )}
    </ToolShell>
  );
}
