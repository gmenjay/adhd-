import type { UserProfile, Task } from '@/types';

const STORAGE_KEY = 'anti_planner_v1';
const CURRENT_VERSION = 1;

// ─── Default profile ───────────────────────────────────────────────────────
export function defaultProfile(name = ''): UserProfile {
  return {
    name,
    brainTraits: [],
    rewards: [],
    strategyRatings: {},
    pinnedStrategies: [],
    hiddenStrategies: [],
    sessionLog: [],
    lastFeeling: undefined,
    tasks: [],
    scope: 'min',
    showSubCategories: true,
    themeAccent: 'warm',
    themeFontSize: 'default',
    themeMode: 'light',
    toolStates: {},
    createdAt: Date.now(),
    version: CURRENT_VERSION,
  };
}

// ─── localStorage availability check ──────────────────────────────────────
function isStorageAvailable(): boolean {
  try {
    const test = '__ap_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// ─── Load profile ──────────────────────────────────────────────────────────
export function loadProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  if (!isStorageAvailable()) {
    console.warn('[AntiPlanner] localStorage is unavailable — data will not persist this session.');
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    return parsed;
  } catch {
    console.warn('[AntiPlanner] Failed to parse saved profile — starting fresh.');
    return null;
  }
}

// ─── Save profile ──────────────────────────────────────────────────────────
export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  if (!isStorageAvailable()) {
    console.warn('[AntiPlanner] localStorage is unavailable — changes will not be saved.');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    // QuotaExceededError or similar — trim session log and retry once
    try {
      const trimmed = {
        ...profile,
        sessionLog: profile.sessionLog.slice(-100),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      console.warn('[AntiPlanner] Could not save profile — storage may be full.');
    }
  }
}

// ─── Clear all data (Full Reset) ───────────────────────────────────────────
export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
