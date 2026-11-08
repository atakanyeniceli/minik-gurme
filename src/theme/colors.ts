import { ThemeMode } from '../types';

export interface ThemePalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  amberBg: string;
  amberBorder: string;
  amberText: string;
  amberPrimary: string;
  emeraldBg: string;
  emeraldBorder: string;
  emeraldText: string;
  emeraldPrimary: string;
  roseBg: string;
  roseBorder: string;
  roseText: string;
  rosePrimary: string;
}

export const LIGHT_COLORS: ThemePalette = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F5F4',
  border: '#E7E5E4',
  borderSubtle: '#F5F5F4',
  text: '#1C1917',
  textSecondary: '#57534E',
  textMuted: '#78716C',
  amberBg: '#FFFBEB',
  amberBorder: '#FDE68A',
  amberText: '#92400E',
  amberPrimary: '#D97706',
  emeraldBg: '#ECFDF5',
  emeraldBorder: '#A7F3D0',
  emeraldText: '#065F46',
  emeraldPrimary: '#059669',
  roseBg: '#FFF1F2',
  roseBorder: '#FECDD3',
  roseText: '#9F1239',
  rosePrimary: '#E11D48',
};

export const DARK_COLORS: ThemePalette = {
  background: '#171513',
  surface: '#1C1917',
  surfaceAlt: '#292524',
  border: '#292524',
  borderSubtle: '#262320',
  text: '#F5F5F4',
  textSecondary: '#A8A29E',
  textMuted: '#78716C',
  amberBg: '#2E1F0F',
  amberBorder: '#78350F',
  amberText: '#FCD34D',
  amberPrimary: '#D97706',
  emeraldBg: '#062C22',
  emeraldBorder: '#065F46',
  emeraldText: '#6EE7B7',
  emeraldPrimary: '#10B981',
  roseBg: '#311018',
  roseBorder: '#881337',
  roseText: '#FDA4AF',
  rosePrimary: '#F43F5E',
};

export function getThemeColors(theme: ThemeMode): ThemePalette {
  return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
