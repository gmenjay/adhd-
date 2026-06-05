'use client';

import type { UserProfile } from '@/types';
import type { CardsConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';
import { useState } from 'react';

interface DrawnCard { suit: string; emoji: string; item: string; value: number; }
interface State { drawn: DrawnCard[]; customTasks: string[]; }

interface Props { config: CardsConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function CardsTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, { drawn: [], customTasks: [] });
  const [taskInput, setTaskInput] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number|null>(null);

  // For fortune teller / dice roll mode: custom task list
  const isSingleSuit = config.suits.length === 1;

  function addTask() {
    if (!taskInput.trim()) return;
    setState(s => ({ ...s, customTasks: [...(s.customTasks ?? []), taskInput.trim()] }));
    setTaskInput('');
  }

  function removeTask(i: number) {
    setState(s => ({ ...s, customTasks: s.customTasks.filter((_, idx) => idx !== i) }));
  }

  function drawCards() {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setTimeout(() => {
      if (isSingleSuit) {
        // Fortune teller / random picker from custom tasks
        const tasks = state.customTasks ?? [];
        if (tasks.length === 0) { setSpinning(false); return; }
        const pick = Math.floor(Math.random() * tasks.length);
        setSelected(pick);
        setSpinning(false);
        return;
      }

      // Suit Up Card Game: draw 4 cards
      const cards: DrawnCard[] = [];
      for (let i = 0; i < 4; i++) {
        const suit = config.suits[i % config.suits.length];
        const items = suit.items.length > 0 ? suit.items : ['Pick something from this category'];
        const item = items[Math.floor(Math.random() * items.length)];
        const value = Math.floor(Math.random() * 10) + 1;
        cards.push({ suit: suit.label, emoji: suit.emoji, item, value });
      }
      setState(s => ({ ...s, drawn: cards }));
      setSpinning(false);
    }, 700);
  }

  function pickCard(i: number) {
    setSelected(i);
  }

  return (
    <ToolShell hint={config.hint} hasState={hasState} onReset={reset}>
      {isSingleSuit && (
        <>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px' }}>Add your tasks, then let fate decide:</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <input type="text" value={taskInput} onChange={e => setTaskInput(e.target.value)} onKeyDown={e => e.key==='Enter' && addTask()}
              placeholder="Add a task…"
              style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={addTask} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 500 }}>+</button>
          </div>
          {(state.customTasks ?? []).map((t,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: selected === i ? 'var(--accent)' : 'var(--bg)', border: `1px solid ${selected === i ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', marginBottom: '5px', transition: 'all 0.2s' }}>
              <span style={{ flex: 1, fontSize: '13px', color: selected === i ? '#fff' : 'var(--text)' }}>{t}</span>
              <button onClick={() => removeTask(i)} style={{ background: 'none', border: 'none', color: selected === i ? 'rgba(255,255,255,0.6)' : 'var(--text-3)', cursor: 'pointer', fontSize: '15px', padding: '2px 3px' }}>×</button>
            </div>
          ))}
          {(state.customTasks ?? []).length > 0 && (
            <button onClick={drawCards} disabled={spinning}
              style={{ width: '100%', marginTop: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', opacity: spinning ? 0.6 : 1 }}>
              {spinning ? '🎲 Picking…' : '🎲 Pick one for me'}
            </button>
          )}
          {selected !== null && !spinning && (
            <div style={{ background: 'var(--stuck-bg)', border: '1px solid var(--stuck-accent)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center', marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: 'var(--stuck-text)', marginBottom: '4px' }}>Start with this one:</p>
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{(state.customTasks ?? [])[selected]}</p>
            </div>
          )}
        </>
      )}

      {!isSingleSuit && (
        <>
          <button onClick={drawCards} disabled={spinning}
            style={{ width: '100%', marginBottom: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: spinning ? 0.6 : 1 }}>
            {spinning ? 'Dealing…' : state.drawn.length > 0 ? 'Deal again' : 'Deal 4 cards'}
          </button>

          {state.drawn.length > 0 && (
            <>
              <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px', textAlign: 'center' }}>Tap a card to pick it:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {state.drawn.map((card, i) => (
                  <button key={i} onClick={() => pickCard(i)}
                    style={{
                      background: selected === i ? 'var(--accent)' : 'var(--bg)',
                      border: `2px solid ${selected === i ? 'var(--accent)' : 'var(--border-2)'}`,
                      borderRadius: 'var(--radius-md)', padding: '12px', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.2s',
                    }}>
                    <p style={{ fontSize: '24px', marginBottom: '4px' }}>{card.emoji}</p>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: selected === i ? '#fff' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{card.suit}</p>
                    <p style={{ fontSize: '13px', color: selected === i ? '#fff' : 'var(--text)', lineHeight: 1.3 }}>{card.item}</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: selected === i ? 'rgba(255,255,255,0.7)' : 'var(--accent)', marginTop: '6px' }}>{card.value} min</p>
                  </button>
                ))}
              </div>

              {selected !== null && (
                <div style={{ background: 'var(--unmotivated-bg)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--unmotivated-text)', fontWeight: 500 }}>
                    {state.drawn[selected].emoji} {state.drawn[selected].item} — {state.drawn[selected].value} minutes. Go.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </ToolShell>
  );
}
