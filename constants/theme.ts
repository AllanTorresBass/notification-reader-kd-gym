export type ThemeMode = 'dark' | 'light';

export const palette = {
  dark: {
    background: '#0F1117',
    surface: '#1A1D27',
    surfaceElevated: '#242836',
    border: 'rgba(255,255,255,0.08)',
    text: '#F4F6FB',
    textMuted: '#9AA3B8',
    accent: '#6C9EFF',
    accentMuted: '#3D5A99',
    danger: '#FF6B6B',
    success: '#4ADE80',
    chip: '#2A3144',
  },
  light: {
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#EEF2FA',
    border: 'rgba(15,17,23,0.08)',
    text: '#0F1117',
    textMuted: '#5C6578',
    accent: '#3B6FE8',
    accentMuted: '#D6E4FF',
    danger: '#DC2626',
    success: '#16A34A',
    chip: '#E8EDF8',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 20,
  full: 999,
} as const;
