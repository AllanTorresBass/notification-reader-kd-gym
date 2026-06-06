import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { spacing } from '@/constants/theme';
import { useNotificationAccessQuery } from '@/hooks/use-notification-access';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function OnboardingAccessScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const { hasAccess, openSettings, refetch } = useNotificationAccessQuery();

  return (
    <AppScreen title="Notification access" subtitle="Required to read alerts from whitelisted apps.">
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Shield color={colors.accent} size={40} />
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Open Android Settings and enable Notification access for Notification Reader. Return here
          and tap Continue.
        </Text>
      </View>
      <PrimaryButton label="Open settings" onPress={openSettings} />
      <PrimaryButton
        label="I've enabled access"
        variant="secondary"
        onPress={async () => {
          await refetch();
        }}
      />
      <PrimaryButton
        label="Continue"
        onPress={() => router.push('/onboarding/apps')}
        disabled={!hasAccess}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  body: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
