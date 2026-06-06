import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Battery } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';
import { useWhitelistStore } from '@/stores/whitelist-store';

export default function OnboardingBatteryScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const setOnboardingComplete = useWhitelistStore((s) => s.setOnboardingComplete);

  const finish = () => {
    notificationListenerBridge.setAllowedPackages(allowedPackages);
    setOnboardingComplete(true);
    router.replace('/(tabs)/feed');
  };

  const openBatterySettings = () => {
    if (Platform.OS === 'android') {
      void Linking.openSettings();
    }
  };

  return (
    <AppScreen
      title="Keep listening"
      subtitle="Some devices stop background listeners to save battery."
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Battery color={colors.accent} size={40} />
        <Text style={[styles.body, { color: colors.textMuted }]}>
          In battery settings, disable optimization for this app if notifications stop appearing
          while the app is closed.
        </Text>
      </View>
      <PrimaryButton label="Open device settings" variant="secondary" onPress={openBatterySettings} />
      <PrimaryButton label="Finish setup" onPress={finish} />
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
