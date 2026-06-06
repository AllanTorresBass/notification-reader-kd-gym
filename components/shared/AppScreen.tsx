import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface AppScreenProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  headerRight?: ReactNode;
  contentStyle?: ViewStyle;
}

export function AppScreen({
  title,
  subtitle,
  children,
  scroll = true,
  headerRight,
  contentStyle,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const header = title ? (
    <View style={styles.headerRow}>
      <View style={styles.headerText}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
      {headerRight}
    </View>
  ) : null;

  const body = (
    <>
      {header}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + spacing.sm },
      ]}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingBottom: insets.bottom }}>
          {header}
          <View style={[styles.content, styles.contentFlex, contentStyle]}>{children}</View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  headerText: { flex: 1, gap: spacing.xs },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  contentFlex: { flex: 1, paddingHorizontal: spacing.md, gap: spacing.md },
});
