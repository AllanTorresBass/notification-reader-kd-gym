import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen } from '@/components/shared/AppScreen';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { radius, spacing } from '@/constants/theme';
import {
  useClearHistoryMutation,
  usePurgeRetentionMutation,
} from '@/hooks/use-notifications';
import { useNotificationAccessQuery } from '@/hooks/use-notification-access';
import { useNotificationShadeSync } from '@/hooks/use-notification-shade-sync';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useWhitelistStore } from '@/stores/whitelist-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const retentionDays = usePreferencesStore((s) => s.retentionDays);
  const setRetentionDays = usePreferencesStore((s) => s.setRetentionDays);
  const captureRawPayload = usePreferencesStore((s) => s.captureRawPayload);
  const setCaptureRawPayload = usePreferencesStore((s) => s.setCaptureRawPayload);
  const { hasAccess, openSettings } = useNotificationAccessQuery();
  const { syncFromShade, canSync } = useNotificationShadeSync();
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const appLabels = useWhitelistStore((s) => s.appLabels);
  const clearHistory = useClearHistoryMutation();
  const purgeRetention = usePurgeRetentionMutation();

  const confirmClear = () => {
    Alert.alert('Clear all history?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearHistory.mutate() },
    ]);
  };

  return (
    <AppScreen title="Settings" subtitle="Privacy and storage controls">
      <SettingRow
        label="Dark theme"
        colors={colors}
        right={
          <Switch
            accessibilityLabel="Toggle dark theme"
            value={theme === 'dark'}
            onValueChange={(on) => setTheme(on ? 'dark' : 'light')}
          />
        }
      />
      <SettingRow
        label="Retention"
        colors={colors}
        right={
          <View style={styles.retentionRow}>
            <Pressable
              accessibilityLabel="Decrease retention days"
              onPress={() => setRetentionDays(Math.max(7, retentionDays - 7))}
            >
              <Text style={{ color: colors.accent, fontSize: 20 }}>−</Text>
            </Pressable>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{retentionDays}d</Text>
            <Pressable
              accessibilityLabel="Increase retention days"
              onPress={() => setRetentionDays(Math.min(365, retentionDays + 7))}
            >
              <Text style={{ color: colors.accent, fontSize: 20 }}>+</Text>
            </Pressable>
          </View>
        }
      />
      <SettingRow
        label="Store raw payload (debug)"
        colors={colors}
        right={
          <Switch
            accessibilityLabel="Toggle raw payload capture"
            value={captureRawPayload}
            onValueChange={setCaptureRawPayload}
          />
        }
      />
      <SettingRow
        label="Notification access"
        colors={colors}
        right={
          <Text style={{ color: hasAccess ? colors.success : colors.danger, fontWeight: '600' }}>
            {hasAccess ? 'Enabled' : 'Disabled'}
          </Text>
        }
      />
      <PrimaryButton label="Open notification access settings" onPress={openSettings} />
      <View
        style={[
          styles.diagnostics,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.diagTitle, { color: colors.text }]}>Capture status</Text>
        <Text style={[styles.diagLine, { color: colors.textMuted }]}>
          Whitelisted:{' '}
          {allowedPackages.length === 0
            ? 'none — open Apps tab and enable Banco de Venezuela'
            : allowedPackages
                .map((pkg) => appLabels[pkg] ?? pkg)
                .join(', ')}
        </Text>
        <Text style={[styles.diagLine, { color: colors.textMuted }]}>
          Android only keeps unread alerts in the shade. Pull down on Feed or tap Sync below to
          import them. Alerts you already cleared cannot be recovered.
        </Text>
      </View>
      {canSync ? (
        <PrimaryButton
          label="Sync from notification shade"
          variant="secondary"
          onPress={() => void syncFromShade()}
        />
      ) : null}
      <PrimaryButton
        label="Apply retention now"
        variant="secondary"
        onPress={() => purgeRetention.mutate()}
      />
      <PrimaryButton label="Clear all history" variant="danger" onPress={confirmClear} />
      {Platform.OS === 'android' ? (
        <PrimaryButton
          label="Battery optimization settings"
          variant="secondary"
          onPress={() => void Linking.openSettings()}
        />
      ) : null}
      <PrimaryButton
        label="Run setup again"
        variant="secondary"
        onPress={() => router.push('/onboarding')}
      />
    </AppScreen>
  );
}

interface SettingRowProps {
  label: string;
  colors: ReturnType<typeof useThemeColors>['colors'];
  right: React.ReactNode;
}

function SettingRow({ label, colors, right }: SettingRowProps) {
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  label: { fontSize: 15, fontWeight: '500', flex: 1 },
  retentionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  diagnostics: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  diagTitle: { fontSize: 14, fontWeight: '700' },
  diagLine: { fontSize: 13, lineHeight: 18 },
});
