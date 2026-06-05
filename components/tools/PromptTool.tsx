'use client';

import type { UserProfile } from '@/types';
import type { PromptConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { text: string; }

interface Props { config: PromptConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function PromptTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { text: '' });

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5, marginBottom: '10px' }}>
        {config.label}
      </label>
      <textarea
        value={state.text}
        onChange={e => setState({ text: e.target.value })}
        placeholder={config.placeholder ?? 'Write here…'}
        rows={5}
        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.7, minHeight: '120px' }}
      />
    </ToolShell>
  );
}
