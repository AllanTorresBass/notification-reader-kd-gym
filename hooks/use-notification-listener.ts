import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { NotificationData } from 'expo-android-notification-listener-service';

import { queryKeys } from '@/lib/query-keys';
import { logger } from '@/lib/logger';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';
import { syncNotificationsFromShade } from '@/lib/services/native/notification-shade-sync';
import { notificationService } from '@/lib/services/notifications/NotificationService';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useWhitelistStore } from '@/stores/whitelist-store';

async function ingestIfAllowed(
  event: NotificationData,
  allowedPackages: string[],
  retentionDays: number,
  captureRawPayload: boolean
): Promise<boolean> {
  if (allowedPackages.length === 0) {
    return false;
  }
  if (!allowedPackages.includes(event.packageName)) {
    logger.debug('Skipped notification (not whitelisted)', { packageName: event.packageName });
    return false;
  }
  await notificationService.ingest(event, { retentionDays, captureRawPayload });
  return true;
}

export function useNotificationListener() {
  const queryClient = useQueryClient();
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const retentionDays = usePreferencesStore((s) => s.retentionDays);
  const captureRawPayload = usePreferencesStore((s) => s.captureRawPayload);

  const flushQueuedNotifications = useCallback(async () => {
    if (Platform.OS !== 'android' || allowedPackages.length === 0) {
      return;
    }
    const { ingested } = await syncNotificationsFromShade({
      allowedPackages,
      retentionDays,
      captureRawPayload,
    });
    if (ingested > 0) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.lists() });
    }
  }, [allowedPackages, retentionDays, captureRawPayload, queryClient]);

  useEffect(() => {
    if (Platform.OS !== 'android' || allowedPackages.length === 0) {
      return;
    }
    notificationListenerBridge.setAllowedPackages(allowedPackages);
  }, [allowedPackages]);

  useEffect(() => {
    void flushQueuedNotifications();
  }, [flushQueuedNotifications]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = notificationListenerBridge.subscribe(async (event) => {
      const ingested = await ingestIfAllowed(
        event,
        allowedPackages,
        retentionDays,
        captureRawPayload
      );
      if (ingested) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.lists() });
      }
    });

    return () => {
      subscription?.remove();
      void notificationService.flush();
    };
  }, [allowedPackages, retentionDays, captureRawPayload, queryClient]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void flushQueuedNotifications();
        void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.lists() });
      }
    });
    return () => sub.remove();
  }, [flushQueuedNotifications, queryClient]);
}
