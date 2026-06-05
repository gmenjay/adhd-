'use client';

import { useEffect, useRef, useState } from 'react';
import type { UserProfile } from '@/types';
import type { TimerConfig } from '@/lib/toolConfig';
import { useToolState } from '@/lib/useToolState';
import ToolShell from './ToolShell';

interface State { guess?: string; note?: string; sessions?: number; phase?: 'work'|'break'; }

interface Props { config: TimerConfig; strategyId: string; profile: UserProfile; onProfileChange:(p:UserProfile)=>void; }

export default function TimerTool({ config, strategyId, profile, onProfileChange }: Props) {
  const { state, setState, reset, hasState } = useToolState<State>(strategyId, profile, onProfileChange, {});

  const totalSecs = (config.mode === 'pomodoro' ? config.workMins! : config.minutes) * 60;
  const [remaining, setRemaining] = useState(totalSecs);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<'work'|'break'>(state.phase ?? 'work');
  const [sessions, setSessions] = useState(state.sessions ?? 0);
  const [guess, setGuess] = useState(state.guess ?? '');
  const [revealed, setRevealed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isStopwatch = config.mode === 'stopwatch';
  const isPomodoro  = config.mode === 'pomodoro';
  const isEstimate  = config.mode === 'estimate';

  function fmt(s: number) {
    const m = Math.floor(Math.abs(s) / 60);
    const sec = Math.abs(s) % 60;
    return `${m}:${String(sec).padStart(2,'0')}`;
  }

  function start() {
    if (done) return;
    setRunning(true);
  }

  function pause() { setRunning(false); }

  function resetTimer() {
    setRunning(false);
    setDone(false);
    setElapsed(0);
    setRemaining(totalSecs);
    setPhase('work');
    setSessions(0);
    setRevealed(false);
    reset();
  }

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }

    intervalRef.current = setInterval(() => {
      if (isStopwatch) {
        setElapsed(e => e + 1);
      } else {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (isPomodoro) {
              if (phase === 'work') {
                const next = sessions + 1;
                setSessions(next);
                setState(s => ({ ...s, sessions: next }));
                setPhase('break');
                setRemaining(config.breakMins! * 60);
              } else {
                setPhase('work');
                setRemaining(config.workMins! * 60);
              }
            } else {
              setDone(true);
              setState(s => ({ ...s, done: true }));
            }
            return 0;
          }
          return r - 1;
        });
      }
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, isStopwatch, isPomodoro, phase]);

  const progress = isStopwatch ? 1 : (remaining / totalSecs);
  const displayTime = isStopwatch ? fmt(elapsed) : fmt(remaining);

  const s: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  const btnStyle = (primary?: boolean): React.CSSProperties => ({
    padding: '10px 0',
    width: '100%',
    border: primary ? 'none' : '1px solid var(--border-2)',
    borderRadius: 'var(--radius-full)',
    background: primary ? 'var(--accent)' : 'transparent',
    color: primary ? '#fff' : 'var(--text-2)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  });

  return (
    <ToolShell hint={config.label} hasState={hasState} onReset={resetTimer}>
      {isEstimate && !revealed && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>
            How long do you think this will take?
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={guess}
              onChange={e => { setGuess(e.target.value); setState(s => ({...s, guess: e.target.value})); }}
              placeholder="e.g. 20 minutes"
              style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: '14px', color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={() => setRevealed(true)}
              disabled={!guess}
              style={{ ...btnStyle(true), width: 'auto', padding: '8px 16px' }}
            >
              Start timing
            </button>
          </div>
        </div>
      )}

      {(!isEstimate || revealed) && (
        <div style={s}>
          {isPomodoro && (
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '4px' }}>
              {phase === 'work' ? '🍅 Work session' : '☕ Break time'} &nbsp;·&nbsp; {sessions} session{sessions !== 1 ? 's' : ''} done
            </p>
          )}

          <div style={{
            fontSize: '56px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            color: done ? 'var(--accent)' : 'var(--text)',
            letterSpacing: '-2px',
            lineHeight: 1,
            padding: '8px 0',
          }}>
            {done ? '✓ Done' : displayTime}
          </div>

          {/* Progress bar */}
          {!isStopwatch && !done && (
            <div style={{ width: '100%', height: '4px', background: 'var(--surface-2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${(1 - progress) * 100}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 1s linear' }} />
            </div>
          )}

          {!done && (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button onClick={running ? pause : start} style={btnStyle(true)}>
                {running ? 'Pause' : remaining === totalSecs ? 'Start' : 'Resume'}
              </button>
              <button onClick={resetTimer} style={{ ...btnStyle(), width: '80px' }}>Reset</button>
            </div>
          )}
        </div>
      )}

      {isEstimate && revealed && done && guess && (
        <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '12px', textAlign: 'center' }}>
          You guessed <strong>{guess}</strong>. Actual: <strong>{fmt(elapsed > 0 ? elapsed : totalSecs - remaining)}</strong>.
        </p>
      )}
    </ToolShell>
  );
}
