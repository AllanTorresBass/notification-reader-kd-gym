import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import type { InstalledAppInfo } from '@/constants/common-android-apps';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface AppRowProps {
  app: InstalledAppInfo;
  selected: boolean;
  onToggle: () => void;
}

export function AppRow({ app, selected, onToggle }: AppRowProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${app.appLabel}, ${selected ? 'selected' : 'not selected'}`}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: selected ? colors.accent : colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.accentMuted }]}>
        <Text style={{ color: colors.accent, fontWeight: '700' }}>
          {app.appLabel.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, { color: colors.text }]}>{app.appLabel}</Text>
        <Text style={[styles.package, { color: colors.textMuted }]} numberOfLines={1}>
          {app.packageName}
        </Text>
      </View>
      {selected ? <Check color={colors.accent} size={22} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  label: { fontSize: 16, fontWeight: '600' },
  package: { fontSize: 12, fontFamily: 'monospace' },
});
