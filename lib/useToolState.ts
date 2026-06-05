import { saveProfile } from '@/lib/storage';
import type { UserProfile } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useToolState<T = any>(
  strategyId: string,
  profile: UserProfile,
  onProfileChange: (p: UserProfile) => void,
  defaultState: T,
): {
  state: T;
  setState: (next: T | ((prev: T) => T)) => void;
  reset: () => void;
  hasState: boolean;
} {
  const raw = profile.toolStates?.[strategyId];
  const state: T = (raw && Object.keys(raw).length > 0 ? raw : defaultState) as T;
  const hasState = !!(raw && Object.keys(raw).length > 0);

  function persist(next: T) {
    const updated: UserProfile = {
      ...profile,
      toolStates: { ...profile.toolStates, [strategyId]: next as Record<string, unknown> },
    };
    saveProfile(updated);
    onProfileChange(updated);
  }

  function setState(next: T | ((prev: T) => T)) {
    const resolved = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
    persist(resolved);
  }

  function reset() {
    const cleared = { ...defaultState };
    persist(cleared as T);
  }

  return { state, setState, reset, hasState };
}
