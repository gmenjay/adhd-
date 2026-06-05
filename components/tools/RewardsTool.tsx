'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { RewardsConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface Contract { id: string; task: string; reward: string; done: boolean; }
interface State { contracts: Contract[]; }

interface Props { config: RewardsConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function RewardsTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { contracts: [] });
  const [task, setTask] = useState('');
  const [reward, setReward] = useState('');

  const personalRewards = profile.rewards ?? [];

  function add() {
    if (!task.trim()) return;
    setState(s => ({ contracts: [...s.contracts, { id: Date.now().toString(), task: task.trim(), reward: reward.trim(), done: false }] }));
    setTask(''); setReward('');
  }

  function complete(id: string) {
    setState(s => ({ contracts: s.contracts.map(c => c.id === id ? { ...c, done: true } : c) }));
  }

  function remove(id: string) {
    setState(s => ({ contracts: s.contracts.filter(c => c.id !== id) }));
  }

  return (
    <ToolShell hint={config.hint ?? 'After I do X, I get Y. Match reward size to effort size.'} hasState={hasState} onReset={reset}>
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '12px' }}>
        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' }}>After I…</label>
        <input type="text" value={task} onChange={e => setTask(e.target.value)} placeholder="Complete this task…"
          style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', marginBottom: '10px' }} />

        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' }}>I get to…</label>
        <input type="text" value={reward} onChange={e => setReward(e.target.value)} placeholder="My reward…"
          style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', marginBottom: '10px' }} />

        {personalRewards.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '5px' }}>Your rewards:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {personalRewards.map((r, i) => (
                <button key={i} onClick={() => setReward(r)} style={{ background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'inherit' }}>{r}</button>
              ))}
            </div>
          </div>
        )}

        <button onClick={add} style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          Make the deal
        </button>
      </div>

      {state.contracts.map(c => (
        <div key={c.id} style={{ background: c.done ? 'var(--unmotivated-bg)' : 'var(--bg)', border: `1px solid ${c.done ? 'var(--unmotivated-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '2px' }}>After I…</p>
          <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '8px', textDecoration: c.done ? 'line-through' : 'none' }}>{c.task}</p>
          <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 500 }}>I get: {c.reward || '(a reward you choose)'}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {!c.done && <button onClick={() => complete(c.id)} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Done — claim reward ✓</button>}
            {c.done && <p style={{ flex: 1, fontSize: '12px', color: 'var(--unmotivated-text)', fontWeight: 500, padding: '4px 0' }}>Reward claimed ✓</p>}
            <button onClick={() => remove(c.id)} style={{ background: 'none', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-full)', padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-3)', fontFamily: 'inherit' }}>×</button>
          </div>
        </div>
      ))}
    </ToolShell>
  );
}
