'use client';

import { type ReactNode } from 'react';

interface Props {
  hint?: string;
  hasState: boolean;
  onReset: () => void;
  children: ReactNode;
}

export default function ToolShell({ hint, hasState, onReset, children }: Props) {
  return (
    <div style={{ paddingTop: '4px' }}>
      {hint && (
        <p style={{
          fontSize: '12px',
          color: 'var(--text-3)',
          fontStyle: 'italic',
          marginBottom: '12px',
          lineHeight: 1.5,
        }}>
          {hint}
        </p>
      )}

      {children}

      {hasState && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={onReset}
            style={{
              background: 'none',
              border: '1px solid var(--border-2)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              fontSize: '12px',
              color: 'var(--text-3)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            Let&rsquo;s do it again
          </button>
        </div>
      )}
    </div>
  );
}
