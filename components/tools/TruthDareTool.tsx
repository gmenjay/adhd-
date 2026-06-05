'use client';

import type { UserProfile } from '@/types';
import type { TruthDareConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { chose: 'truth'|'dare'|null; answer: string; done: boolean; }

interface Props { config: TruthDareConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function TruthDareTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { chose: null, answer: '', done: false });

  const btnBase: React.CSSProperties = { flex: 1, padding: '14px', border: '2px solid var(--border-2)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: 'var(--bg)', color: 'var(--text)' };

  return (
    <ToolShell hasState={hasState} onReset={reset}>
      {!state.chose ? (
        <>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', textAlign: 'center', marginBottom: '16px' }}>Pick one.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setState(s => ({...s, chose: 'truth'}))} style={{ ...btnBase, borderColor: 'var(--stuck-accent)' }}>
              🤔 Truth
            </button>
            <button onClick={() => setState(s => ({...s, chose: 'dare'}))} style={{ ...btnBase, borderColor: 'var(--accent)' }}>
              ⚡ Dare
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-3)', textAlign: 'center', marginTop: '10px', fontStyle: 'italic' }}>
            Note: Physically writing it down means your brain is more likely to do it again.
          </p>
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{
            background: state.chose === 'truth' ? 'var(--stuck-bg)' : 'var(--overwhelmed-bg)',
            borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '14px',
            border: `1px solid ${state.chose === 'truth' ? 'var(--stuck-accent)' : 'var(--overwhelmed-accent)'}`,
          }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: state.chose === 'truth' ? 'var(--stuck-text)' : 'var(--overwhelmed-text)', marginBottom: '6px' }}>
              {state.chose === 'truth' ? '🤔 Truth' : '⚡ Dare'}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6 }}>
              {state.chose === 'truth' ? config.truth : config.dare}
            </p>
          </div>

          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>
            {state.chose === 'truth' ? 'Your answer:' : 'What I did:'}
          </label>
          <textarea
            value={state.answer}
            onChange={e => setState(s => ({...s, answer: e.target.value}))}
            placeholder="Write it down…"
            rows={3}
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
          />

          {!state.done && (
            <button
              onClick={() => setState(s => ({...s, done: true}))}
              style={{ marginTop: '10px', width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              I did it ✓
            </button>
          )}

          {state.done && (
            <p style={{ fontSize: '13px', color: 'var(--unmotivated-text)', background: 'var(--unmotivated-bg)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: '10px', textAlign: 'center' }}>
              That counts. Proud of you.
            </p>
          )}
        </div>
      )}
    </ToolShell>
  );
}
