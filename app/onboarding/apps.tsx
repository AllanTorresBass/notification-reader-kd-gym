import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { AppRow } from '@/components/whitelist/AppRow';
import { ManualPackageForm } from '@/components/whitelist/ManualPackageForm';
import { spacing } from '@/constants/theme';
import { useInstalledAppsQuery } from '@/hooks/use-installed-apps';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';
import { useWhitelistStore } from '@/stores/whitelist-store';

export default function OnboardingAppsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [search, setSearch] = useState('');
  const { data: apps, isLoading } = useInstalledAppsQuery(search);
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const togglePackage = useWhitelistStore((s) => s.togglePackage);
  const addManualPackage = useWhitelistStore((s) => s.addManualPackage);

  const handleContinue = () => {
    notificationListenerBridge.setAllowedPackages(allowedPackages);
    router.push('/onboarding/battery');
  };

  return (
    <AppScreen
      title="Choose apps"
      subtitle={`${allowedPackages.length} selected — only these apps will be captured.`}
      scroll
    >
      <TextInput
        accessibilityLabel="Search apps"
        placeholder="Search apps..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.search,
          { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      />
      {isLoading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <View style={styles.list}>
          {apps?.map((app) => (
            <AppRow
              key={app.packageName}
              app={app}
              selected={allowedPackages.includes(app.packageName)}
              onToggle={() => togglePackage(app.packageName, app.appLabel)}
            />
          ))}
        </View>
      )}
      <ManualPackageForm onAdd={addManualPackage} />
      <PrimaryButton
        label="Continue"
        onPress={handleContinue}
        disabled={allowedPackages.length === 0}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  list: { gap: spacing.sm },
});
