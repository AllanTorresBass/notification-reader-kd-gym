import type { NotificationData } from 'expo-android-notification-listener-service';

import { generateRecordId } from '@/lib/utils/generate-id';

import type { NotificationRecord } from '@/types/notification/notification.types';

export function buildDedupeKey(packageName: string, notificationKey: string): string {
  return `${packageName}::${notificationKey}`;
}

export function normalizeNativeNotification(
  data: NotificationData,
  captureRawPayload: boolean
): Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt' | 'dismissedAt'> {
  const title = data.title?.trim() || data.subText?.trim() || null;
  const bigText = data.bigText?.trim() || null;
  const body = data.text?.trim() || bigText || data.summaryText?.trim() || null;
  const hasVisibleContent = Boolean(title || body || bigText);
  const isRedacted = !hasVisibleContent && Boolean(data.packageName);

  return {
    packageName: data.packageName,
    appLabel: data.appName?.trim() || data.packageName,
    title,
    body,
    bigText,
    postTime: data.postTime,
    notificationKey: data.key || String(data.id),
    groupKey: data.summaryText ? data.summaryText : null,
    isGroupSummary: Boolean(data.summaryText),
    isRedacted,
    isOngoing: false,
    rawPayloadJson: captureRawPayload ? JSON.stringify(data) : null,
  };
}

export function createNotificationRecord(
  partial: Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt' | 'dismissedAt'>,
  existing?: NotificationRecord
): NotificationRecord {
  const now = Date.now();
  return {
    id: existing?.id ?? generateRecordId(),
    ...partial,
    dismissedAt: existing?.dismissedAt ?? null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
