'use client';

import type { UserProfile } from '@/types';
import type { FormConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { fields: Record<string, string>; }

interface Props { config: FormConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function FormTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { fields: {} });

  function update(key: string, val: string) {
    setState(s => ({ fields: { ...s.fields, [key]: val } }));
  }

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {config.fields.map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '6px', lineHeight: 1.4 }}>
              {f.label}
            </label>
            {f.multiline ? (
              <textarea
                value={state.fields[f.key] ?? ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder ?? ''}
                rows={f.rows ?? 3}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: `${(f.rows ?? 3) * 24 + 20}px`, lineHeight: 1.6 }}
              />
            ) : (
              <input
                type="text"
                value={state.fields[f.key] ?? ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder ?? ''}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
              />
            )}
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
