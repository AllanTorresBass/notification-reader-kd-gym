import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { NotificationRecord } from '@/types/notification/notification.types';

interface NotificationCardProps {
  record: NotificationRecord;
  onPress: (record: NotificationRecord) => void;
}

export function NotificationCard({ record, onPress }: NotificationCardProps) {
  const { colors } = useThemeColors();
  const body = record.bigText || record.body;
  const time = new Date(record.postTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Notification from ${record.appLabel}`}
      onPress={() => onPress(record)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.accentMuted }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>
            {record.appLabel.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.appLabel, { color: colors.text }]} numberOfLines={1}>
            {record.appLabel}
          </Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>{time}</Text>
        </View>
      </View>
      {record.title ? (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {record.title}
        </Text>
      ) : null}
      {record.isRedacted ? (
        <Text style={[styles.redacted, { color: colors.textMuted }]}>
          Content hidden by app
        </Text>
      ) : body ? (
        <Text style={[styles.body, { color: colors.textMuted }]} numberOfLines={3}>
          {body}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700' },
  meta: { flex: 1 },
  appLabel: { fontSize: 15, fontWeight: '600' },
  time: { fontSize: 12, fontFamily: 'monospace' },
  title: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, lineHeight: 20 },
  redacted: { fontSize: 13, fontStyle: 'italic' },
});
