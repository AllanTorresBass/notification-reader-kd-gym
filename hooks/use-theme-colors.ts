import { palette, type ThemeMode } from '@/constants/theme';
import { usePreferencesStore } from '@/stores/preferences-store';

export function useThemeColors() {
  const theme = usePreferencesStore((s) => s.theme);
  const colors = palette[theme satisfies ThemeMode];
  return { theme, colors, isDark: theme === 'dark' };
}
