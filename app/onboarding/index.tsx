import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();

  return (
    <AppScreen
      title="Notification Reader"
      subtitle="Capture notifications from apps you trust — stored encrypted on your device."
    >
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.heroTitle, { color: colors.text }]}>Personal. Private. Local.</Text>
        <Text style={[styles.heroBody, { color: colors.textMuted }]}>
          Enable Android notification access, pick which apps to monitor, and browse a timeline of
          captured alerts.
        </Text>
      </View>
      <PrimaryButton label="Get started" onPress={() => router.push('/onboarding/access')} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroTitle: { fontSize: 20, fontWeight: '700' },
  heroBody: { fontSize: 15, lineHeight: 22 },
});
