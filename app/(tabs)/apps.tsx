import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { AppRow } from '@/components/whitelist/AppRow';
import { ManualPackageForm } from '@/components/whitelist/ManualPackageForm';
import {
  BANCO_DE_VENEZUELA_LABEL,
  BANCO_DE_VENEZUELA_PACKAGE,
} from '@/constants/whitelist-defaults';
import { radius, spacing } from '@/constants/theme';
import { useInstalledAppsQuery } from '@/hooks/use-installed-apps';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';
import { useWhitelistStore } from '@/stores/whitelist-store';

export default function AppsTabScreen() {
  const { colors } = useThemeColors();
  const [search, setSearch] = useState('');
  const { data: apps, isLoading } = useInstalledAppsQuery(search);
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const togglePackage = useWhitelistStore((s) => s.togglePackage);
  const addManualPackage = useWhitelistStore((s) => s.addManualPackage);
  const bdvEnabled = allowedPackages.includes(BANCO_DE_VENEZUELA_PACKAGE);

  const enableBdv = () => {
    if (!bdvEnabled) {
      togglePackage(BANCO_DE_VENEZUELA_PACKAGE, BANCO_DE_VENEZUELA_LABEL);
    }
    notificationListenerBridge.setAllowedPackages(
      useWhitelistStore.getState().allowedPackages
    );
  };

  const handleToggle = (packageName: string, appLabel: string) => {
    const isSelected = allowedPackages.includes(packageName);
    togglePackage(packageName, appLabel);
    const next = isSelected
      ? allowedPackages.filter((p) => p !== packageName)
      : [...allowedPackages, packageName];
    notificationListenerBridge.setAllowedPackages(next);
  };

  return (
    <AppScreen
      title="Whitelist"
      subtitle={`Monitoring ${allowedPackages.length} app${allowedPackages.length === 1 ? '' : 's'}`}
    >
      {!bdvEnabled ? (
        <View
          style={[
            styles.bdvBanner,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.accent },
          ]}
        >
          <Text style={[styles.bdvTitle, { color: colors.text }]}>
            Banco de Venezuela is not enabled
          </Text>
          <Text style={[styles.bdvBody, { color: colors.textMuted }]}>
            Turn on {BANCO_DE_VENEZUELA_PACKAGE} to capture PagomóvilBDV alerts.
          </Text>
          <PrimaryButton label="Enable Banco de Venezuela" onPress={enableBdv} />
        </View>
      ) : null}
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
              onToggle={() => handleToggle(app.packageName, app.appLabel)}
            />
          ))}
        </View>
      )}
      <ManualPackageForm
        onAdd={(packageName, appLabel) => {
          addManualPackage(packageName, appLabel);
          const next = [...allowedPackages, packageName.trim()];
          notificationListenerBridge.setAllowedPackages(next);
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bdvBanner: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  bdvTitle: { fontSize: 15, fontWeight: '700' },
  bdvBody: { fontSize: 13, lineHeight: 18 },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
  },
  list: { gap: spacing.sm },
});
