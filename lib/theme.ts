import type { UserProfile } from '@/types';

// ─── Palette definition ────────────────────────────────────────────────────
export interface Palette {
  id: string;
  label: string;
  // Swatch color shown in the picker
  swatch: string;
  // Core accent
  accent: string;
  accentHover: string;
  // Feeling-state triads: [background, accent, text]
  stuck:        [string, string, string];
  overwhelmed:  [string, string, string];
  unmotivated:  [string, string, string];
  disorganized: [string, string, string];
  discouraged:  [string, string, string];
}

export const PALETTES: Palette[] = [
  {
    id: 'warm',
    label: 'Warm',
    swatch: '#C4856A',
    accent: '#C4856A',
    accentHover: '#B07460',
    stuck:        ['#F2EEF8', '#8B6BBE', '#3D2870'],
    overwhelmed:  ['#FEF0EB', '#C4856A', '#6B2C14'],
    unmotivated:  ['#EDFAF0', '#5EA86A', '#1E5C2A'],
    disorganized: ['#EBF2FE', '#5580C8', '#1A3868'],
    discouraged:  ['#FEF0F5', '#C46090', '#6B1438'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: '#4A7BB5',
    accent: '#4A7BB5',
    accentHover: '#3A6BA5',
    stuck:        ['#EEF2FA', '#6B8ED4', '#1A3060'],
    overwhelmed:  ['#E8F4FA', '#4A9AC4', '#143C54'],
    unmotivated:  ['#E8F8F5', '#3AA890', '#0E4840'],
    disorganized: ['#EAF0FB', '#4A7BB5', '#1A3060'],
    discouraged:  ['#F0EEFA', '#8070C8', '#2A1870'],
  },
  {
    id: 'sage',
    label: 'Sage',
    swatch: '#6A9B6A',
    accent: '#6A9B6A',
    accentHover: '#5A8B5A',
    stuck:        ['#F0EEF8', '#8070B8', '#301870'],
    overwhelmed:  ['#FEF2EC', '#C88A5A', '#6B3018'],
    unmotivated:  ['#EBF5EA', '#6A9B6A', '#1E4E1E'],
    disorganized: ['#EAF2EE', '#5A9A80', '#184838'],
    discouraged:  ['#FBF0F5', '#B87090', '#6B1848'],
  },
  {
    id: 'dusk',
    label: 'Dusk',
    swatch: '#9B7EBC',
    accent: '#9B7EBC',
    accentHover: '#8B6EAC',
    stuck:        ['#F0EEF8', '#9B7EBC', '#3D2070'],
    overwhelmed:  ['#FEF0F2', '#C47090', '#6B1830'],
    unmotivated:  ['#F0F8EE', '#7AB87A', '#1E501E'],
    disorganized: ['#EEF0F8', '#7090C8', '#1A2868'],
    discouraged:  ['#FEF0F8', '#C070B0', '#6B1060'],
  },
];

export const DEFAULT_PALETTE_ID = 'warm';

export function getPalette(id: string): Palette {
  return PALETTES.find(p => p.id === id) ?? PALETTES[0];
}

// ─── Font size scale ────────────────────────────────────────────────────────
export const FONT_SIZES = [
  { id: 'compact', label: 'A',    size: '15px' },
  { id: 'default', label: 'A',    size: '16px' },
  { id: 'large',   label: 'A',    size: '18px' },
] as const;

export type FontSizeId = 'compact' | 'default' | 'large';

// ─── Apply theme to :root ──────────────────────────────────────────────────
export function applyTheme(paletteId: string, fontSize: FontSizeId): void {
  if (typeof document === 'undefined') return;

  const p = getPalette(paletteId);
  const root = document.documentElement;

  // Accent
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--accent-hover', p.accentHover);

  // Feeling states
  const states = ['stuck', 'overwhelmed', 'unmotivated', 'disorganized', 'discouraged'] as const;
  states.forEach(state => {
    const [bg, accent, text] = p[state];
    root.style.setProperty(`--${state}-bg`, bg);
    root.style.setProperty(`--${state}-accent`, accent);
    root.style.setProperty(`--${state}-text`, text);
  });

  // Font size
  const fs = FONT_SIZES.find(f => f.id === fontSize) ?? FONT_SIZES[1];
  root.style.setProperty('--text-base', fs.size);
  // Derive sm from base
  const baseNum = parseInt(fs.size);
  root.style.setProperty('--text-sm', `${baseNum - 2}px`);
}

// ─── Apply light / dark mode ──────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark';

export function applyMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// ─── Restore from profile on boot ─────────────────────────────────────────
export function restoreTheme(profile: UserProfile): void {
  applyMode(profile.themeMode ?? 'light');
  applyTheme(profile.themeAccent ?? DEFAULT_PALETTE_ID, profile.themeFontSize ?? 'default');
}
