'use client';

import { useState } from 'react';
import type { UserProfile } from '@/types';
import type { BingoConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { cells: string[]; marked: boolean[]; }

const EMPTY: State = { cells: Array(25).fill(''), marked: Array(25).fill(false) };

interface Props { config: BingoConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function BingoTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, EMPTY);
  const [editing, setEditing] = useState<number|null>(null);
  const [val, setVal] = useState('');

  const FREE = 12; // center cell

  function openEdit(i: number) {
    if (i === FREE) return;
    setEditing(i);
    setVal(state.cells[i] ?? '');
  }

  function saveEdit() {
    if (editing === null) return;
    const cells = [...state.cells];
    cells[editing] = val;
    setState(s => ({ ...s, cells }));
    setEditing(null);
  }

  function toggleMark(i: number) {
    if (i === FREE) return;
    if (!state.cells[i]) { openEdit(i); return; }
    const marked = [...state.marked];
    marked[i] = !marked[i];
    setState(s => ({ ...s, marked }));
  }

  // Check bingo lines
  const lines = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24], // rows
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24], // cols
    [0,6,12,18,24],[4,8,12,16,20], // diagonals
  ];

  const markedFull = state.marked.map((m,i) => m || i === FREE);
  const bingos = lines.filter(line => line.every(i => markedFull[i])).length;
  const blackout = [0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24].every(i => state.marked[i]);

  const colHeader = (i: number) => config.categories[i] ?? '';

  return (
    <ToolShell hint="Tap a cell to add a task. Tap again to mark it done. Go for bingo!" hasState={hasState} onReset={reset}>
      {(bingos > 0 || blackout) && (
        <div style={{ background: 'var(--unmotivated-bg)', border: '1px solid var(--unmotivated-accent)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center', marginBottom: '12px' }}>
          <p style={{ color: 'var(--unmotivated-text)', fontWeight: 600, fontSize: '14px' }}>
            {blackout ? '🎉 BLACKOUT! You got everything!' : `🎉 BINGO! ${bingos} line${bingos !== 1 ? 's' : ''} complete!`}
          </p>
        </div>
      )}

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px', marginBottom: '3px' }}>
        {config.categories.map((cat, i) => (
          <div key={i} style={{ background: 'var(--accent)', color: '#fff', borderRadius: '6px', padding: '4px 2px', textAlign: 'center', fontSize: '9px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.2 }}>
            {cat.slice(0,6).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px' }}>
        {Array.from({length: 25}, (_, i) => {
          const isFree = i === FREE;
          const marked = markedFull[i];
          const empty = !isFree && !state.cells[i];

          return (
            <button
              key={i}
              onClick={() => toggleMark(i)}
              style={{
                aspectRatio: '1',
                background: isFree ? 'var(--accent)' : marked ? 'var(--unmotivated-bg)' : empty ? 'var(--surface-2)' : 'var(--bg)',
                border: `1px solid ${marked && !isFree ? 'var(--unmotivated-accent)' : 'var(--border)'}`,
                borderRadius: '6px',
                cursor: isFree ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '4px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{
                fontSize: '9px',
                lineHeight: 1.2,
                color: isFree ? '#fff' : marked ? 'var(--unmotivated-text)' : empty ? 'var(--text-3)' : 'var(--text)',
                textDecoration: marked && !isFree ? 'line-through' : 'none',
                textAlign: 'center',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {isFree ? '⭐ FREE' : state.cells[i] || (empty ? 'tap to add' : '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cell editor */}
      {editing !== null && (
        <div style={{ marginTop: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '8px' }}>
            {colHeader(editing % 5)} · row {Math.floor(editing / 5) + 1}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              autoFocus
              type="text"
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              placeholder="Add a task for this cell…"
              style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: '13px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
            />
            <button onClick={saveEdit} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-full)', padding: '8px 12px', fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
