import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAppGates } from '@/hooks/use-app-gates';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function IndexScreen() {
  const { colors } = useThemeColors();
  const { isAndroid, accessLoading, needsOnboarding, isReady } = useAppGates();

  if (!isAndroid) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Android only</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Notification Reader requires an Android device with notification listener access.
        </Text>
      </View>
    );
  }

  if (accessLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (isReady) {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
