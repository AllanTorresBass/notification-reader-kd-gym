import { Platform } from 'react-native';
import type { NotificationData } from 'expo-android-notification-listener-service';

import { logger } from '@/lib/logger';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';
import { notificationService } from '@/lib/services/notifications/NotificationService';

export type NotificationShadeSyncResult = {
  scanned: number;
  ingested: number;
};

export async function syncNotificationsFromShade(options: {
  allowedPackages: string[];
  retentionDays: number;
  captureRawPayload: boolean;
}): Promise<NotificationShadeSyncResult> {
  if (Platform.OS !== 'android' || options.allowedPackages.length === 0) {
    return { scanned: 0, ingested: 0 };
  }

  notificationListenerBridge.setAllowedPackages(options.allowedPackages);
  const scanned = notificationListenerBridge.syncActiveNotifications();
  const queued = notificationListenerBridge.pullQueuedNotifications();

  let ingested = 0;
  for (const event of queued) {
    const saved = await ingestIfAllowed(event, options);
    if (saved) {
      ingested += 1;
    }
  }

  if (scanned > 0 || ingested > 0) {
    logger.info('Synced notifications from shade', { scanned, ingested, queued: queued.length });
  }

  return { scanned, ingested };
}

async function ingestIfAllowed(
  event: NotificationData,
  options: {
    allowedPackages: string[];
    retentionDays: number;
    captureRawPayload: boolean;
  }
): Promise<boolean> {
  if (!options.allowedPackages.includes(event.packageName)) {
    return false;
  }
  await notificationService.ingest(event, {
    retentionDays: options.retentionDays,
    captureRawPayload: options.captureRawPayload,
  });
  return true;
}
