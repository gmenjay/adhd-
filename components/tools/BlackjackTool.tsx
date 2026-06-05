'use client';

import type { UserProfile } from '@/types';
import type { BlackjackConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { tasks: string[]; hand: number[]; score: number; phase: 'setup'|'playing'|'done'; }

const DECK = [1,2,3,4,5,6,7,8,9,10,10,10,10]; // card values
function cardLabel(v: number) { if(v===1)return 'A'; if(v===10)return ['J','Q','K','10'][Math.floor(Math.random()*4)]; return String(v); }
function draw() { return DECK[Math.floor(Math.random()*DECK.length)]; }
function cardValue(hand: number[]) {
  let s = hand.reduce((a,b)=>a+b,0);
  if(hand.includes(1) && s+10<=21) s+=10;
  return s;
}

interface Props { config: BlackjackConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function BlackjackTool({ config, strategyId, profile, onProfileChange }: Props) {
  const count = config.taskCount ?? 3;
  const def: State = { tasks: Array(count).fill(''), hand: [], score: 0, phase: 'setup' };
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, def);

  function updateTask(i: number, val: string) {
    const tasks = [...state.tasks]; tasks[i] = val;
    setState(s => ({...s, tasks}));
  }

  function startGame() {
    const h = [draw(), draw()];
    setState(s => ({...s, hand: h, score: cardValue(h), phase: 'playing'}));
  }

  function hit() {
    const h = [...state.hand, draw()];
    const s = cardValue(h);
    if (s >= 21) {
      setState(prev => ({...prev, hand: h, score: s, phase: 'done'}));
    } else {
      setState(prev => ({...prev, hand: h, score: s}));
    }
  }

  function stand() {
    setState(s => ({...s, phase: 'done'}));
  }

  const score = state.score;
  let verdict = '';
  let tasksRequired = count;
  if (state.phase === 'done') {
    if (score === 21) { verdict = 'Blackjack! 🎉 You don\'t have to do anything today.'; tasksRequired = 0; }
    else if (score > 21) { verdict = `Bust (${score}). All ${count} tasks today. Sorry.`; tasksRequired = count; }
    else if (score >= 17) { verdict = `${score} — 1 task. Pick your easiest.`; tasksRequired = 1; }
    else if (score >= 13) { verdict = `${score} — 2 tasks. You got this.`; tasksRequired = 2; }
    else { verdict = `${score} — all ${count} tasks. Unlucky.`; tasksRequired = count; }
  }

  return (
    <ToolShell hint="Flip cards and add up the score. Hit 21 exactly and you're off the hook. Bust and you do everything." hasState={hasState} onReset={reset}>
      {state.phase === 'setup' && (
        <>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px' }}>Add {count} small tasks you've been putting off:</p>
          {state.tasks.map((t,i) => (
            <input key={i} type="text" value={t} onChange={e => updateTask(i, e.target.value)}
              placeholder={`Task ${i+1}`}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none', marginBottom: '8px' }} />
          ))}
          <button onClick={startGame} disabled={state.tasks.every(t=>!t.trim())}
            style={{ width: '100%', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}>
            Deal cards 🃏
          </button>
        </>
      )}

      {(state.phase === 'playing' || state.phase === 'done') && (
        <>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
            {state.hand.map((v,i) => (
              <div key={i} style={{ width: '48px', height: '68px', background: 'white', border: '2px solid var(--border-2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: [1,3,4].includes(v) ? '#e03' : '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {cardLabel(v)}
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, color: score > 21 ? 'var(--overwhelmed-accent)' : score === 21 ? 'var(--unmotivated-accent)' : 'var(--text)', marginBottom: '12px' }}>
            {score}
          </p>

          {state.phase === 'playing' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={hit} style={{ flex: 1, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Hit me 🃏</button>
              <button onClick={stand} style={{ flex: 1, background: 'none', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-2)' }}>Stand</button>
            </div>
          )}

          {state.phase === 'done' && verdict && (
            <div style={{ background: score === 21 ? 'var(--unmotivated-bg)' : score > 21 ? 'var(--overwhelmed-bg)' : 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px', marginTop: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: tasksRequired > 0 ? '8px' : 0 }}>{verdict}</p>
              {tasksRequired > 0 && state.tasks.slice(0, tasksRequired).filter(t=>t.trim()).map((t,i) => (
                <p key={i} style={{ fontSize: '13px', color: 'var(--text-2)', padding: '4px 0', borderTop: i > 0 ? '0.5px solid var(--border)' : 'none' }}>→ {t}</p>
              ))}
            </div>
          )}
        </>
      )}
    </ToolShell>
  );
}
