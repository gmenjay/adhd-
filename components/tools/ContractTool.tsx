'use client';

import type { UserProfile } from '@/types';
import type { ContractConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { fields: Record<string, string>; signed: boolean; }

interface Props { config: ContractConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function ContractTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { fields: {}, signed: false });

  function update(key: string, val: string) {
    setState(s => ({ ...s, fields: { ...s.fields, [key]: val } }));
  }

  const allFilled = config.fields.filter(f => f.placeholder !== '').every(f => state.fields[f.key]?.trim());

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      {!state.signed ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
            {config.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '5px' }}>{f.label}</label>
                <input type="text" value={state.fields[f.key] ?? ''} onChange={e => update(f.key, e.target.value)}
                  placeholder={f.placeholder ?? ''}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
              </div>
            ))}
          </div>

          <button onClick={() => setState(s => ({...s, signed: true}))}
            style={{ width: '100%', background: allFilled ? 'var(--accent)' : 'var(--surface-2)', color: allFilled ? '#fff' : 'var(--text-3)', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: allFilled ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            Sign the contract ✍️
          </button>
        </>
      ) : (
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '16px', border: '2px solid var(--accent)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>CONTRACT — SIGNED</p>
          {config.fields.map(f => state.fields[f.key] ? (
            <div key={f.key} style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '2px' }}>{f.label}</p>
              <p style={{ fontSize: '14px', color: 'var(--text)' }}>{state.fields[f.key]}</p>
            </div>
          ) : null)}
          <button onClick={() => setState(s => ({...s, signed: false}))}
            style={{ marginTop: '8px', background: 'none', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-3)', fontFamily: 'inherit' }}>
            Edit contract
          </button>
        </div>
      )}
    </ToolShell>
  );
}
