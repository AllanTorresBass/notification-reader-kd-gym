import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Clipboard from 'expo-clipboard';
import { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { radius, spacing } from '@/constants/theme';
import { useGlobalErrorHandler } from '@/hooks/use-global-error-handler';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { NotificationRecord } from '@/types/notification/notification.types';

interface NotificationDetailSheetProps {
  record: NotificationRecord | null;
  onClose: () => void;
}

export const NotificationDetailSheet = forwardRef<BottomSheet, NotificationDetailSheetProps>(
  function NotificationDetailSheet({ record, onClose }, ref) {
    const { colors } = useThemeColors();
    const { showSuccess } = useGlobalErrorHandler();
    const snapPoints = useMemo(() => ['50%', '85%'], []);

    const copyContent = useCallback(async () => {
      if (!record) return;
      const text = [
        record.appLabel,
        record.title,
        record.bigText || record.body,
        new Date(record.postTime).toISOString(),
      ]
        .filter(Boolean)
        .join('\n');
      await Clipboard.setStringAsync(text);
      showSuccess('Copied to clipboard');
    }, [record, showSuccess]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          {record ? (
            <>
              <Text style={[styles.app, { color: colors.textMuted }]}>{record.packageName}</Text>
              <Text style={[styles.title, { color: colors.text }]}>
                {record.title ?? 'No title'}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                {new Date(record.postTime).toLocaleString()}
              </Text>
              <View style={[styles.bodyBox, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.body, { color: colors.text }]}>
                  {record.isRedacted
                    ? 'Content hidden by the source app.'
                    : record.bigText || record.body || 'No body text'}
                </Text>
              </View>
              <PrimaryButton label="Copy" onPress={() => void copyContent()} />
            </>
          ) : (
            <Text style={{ color: colors.textMuted }}>Select a notification</Text>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  app: { fontSize: 12, fontFamily: 'monospace' },
  title: { fontSize: 22, fontWeight: '700' },
  timestamp: { fontSize: 13, fontFamily: 'monospace' },
  bodyBox: { borderRadius: radius.md, padding: spacing.md },
  body: { fontSize: 15, lineHeight: 22 },
});
