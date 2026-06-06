import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { queryKeys } from '@/lib/query-keys';
import { syncNotificationsFromShade } from '@/lib/services/native/notification-shade-sync';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useWhitelistStore } from '@/stores/whitelist-store';

export function useNotificationShadeSync() {
  const queryClient = useQueryClient();
  const allowedPackages = useWhitelistStore((s) => s.allowedPackages);
  const retentionDays = usePreferencesStore((s) => s.retentionDays);
  const captureRawPayload = usePreferencesStore((s) => s.captureRawPayload);

  const syncFromShade = useCallback(async () => {
    if (Platform.OS !== 'android' || allowedPackages.length === 0) {
      return { scanned: 0, ingested: 0 };
    }
    const result = await syncNotificationsFromShade({
      allowedPackages,
      retentionDays,
      captureRawPayload,
    });
    if (result.ingested > 0) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.lists() });
    }
    return result;
  }, [allowedPackages, retentionDays, captureRawPayload, queryClient]);

  return { syncFromShade, canSync: Platform.OS === 'android' && allowedPackages.length > 0 };
}
