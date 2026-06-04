// ─── Feeling States ────────────────────────────────────────────────────────
export type FeelingId =
  | 'stuck'
  | 'overwhelmed'
  | 'unmotivated'
  | 'disorganized'
  | 'discouraged';

// ─── Strategy Tags ─────────────────────────────────────────────────────────
export type StrategyTag = 'game' | 'reflect' | 'quick' | 'organize' | 'mindset' | 'tool';

// ─── Brain Traits (onboarding step 2) ──────────────────────────────────────
export type BrainTrait =
  | 'adhd'
  | 'anxiety'
  | 'perfectionism'
  | 'overwhelm'
  | 'boredom'
  | 'avoidance'
  | 'executive'
  | 'shame';

// ─── Strategy catalog entry ────────────────────────────────────────────────
export interface Strategy {
  id: string;
  title: string;
  feeling: FeelingId;
  subCategory: string;       // e.g. "Difficulty Getting Started"
  volume: 1 | 2 | 3;
  tag: StrategyTag;
  tagLabel: string;          // display label for tag chip
  desc: string;              // one-line description from PDF
  traitBoost: BrainTrait[];  // traits this strategy helps most
}

// ─── Task queue slots ──────────────────────────────────────────────────────
export type TaskSlot = 'whats-next' | 'on-deck' | 'in-the-hole' | 'on-the-bench';

export interface Task {
  id: string;
  text: string;
  slot: TaskSlot;
  done: boolean;
  addedAt: number;           // timestamp
  activeFeeling?: FeelingId; // set when user ran a strategy against this task
  strategyUsed?: string;     // strategy id, if any
}

// ─── Strategy ratings ─────────────────────────────────────────────────────
export interface StrategyRating {
  worked: number;
  nope: number;
  lastRating?: 'worked' | 'nope';
}

// ─── Session log entry ─────────────────────────────────────────────────────
export interface SessionLogEntry {
  strategyId: string;
  feeling: FeelingId;
  timestamp: number;
  rating?: 'worked' | 'nope';
}

// ─── User profile ──────────────────────────────────────────────────────────
export interface UserProfile {
  name: string;
  brainTraits: BrainTrait[];
  rewards: string[];               // personal rewards list (built contextually)
  strategyRatings: Record<string, StrategyRating>;
  pinnedStrategies: string[];
  hiddenStrategies: string[];
  sessionLog: SessionLogEntry[];
  lastFeeling?: FeelingId;         // restored on reopen
  tasks: Task[];
  // settings
  scope: 'min' | 'mid' | 'all';   // Vol 1 / Vol 1+half-2 / All
  showSubCategories: boolean;
  themeAccent: string;
  themeFontSize: 'compact' | 'default' | 'large';
  themeMode: 'light' | 'dark';
  // meta
  createdAt: number;
  version: number;
}
