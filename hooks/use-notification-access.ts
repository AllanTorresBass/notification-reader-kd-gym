import { useQuery } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import { useEffect } from 'react';

import { queryKeys } from '@/lib/query-keys';
import { notificationListenerBridge } from '@/lib/services/native/NotificationListenerBridge';

export function useNotificationAccessQuery() {
  const query = useQuery({
    queryKey: queryKeys.access.all,
    queryFn: () => notificationListenerBridge.isAccessGranted(),
    enabled: Platform.OS === 'android',
    staleTime: 0,
  });

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void query.refetch();
      }
    });
    return () => sub.remove();
  }, [query]);

  return {
    hasAccess: query.data ?? false,
    isLoading: query.isLoading,
    refetch: query.refetch,
    openSettings: () => notificationListenerBridge.openAccessSettings(),
    isAndroid: Platform.OS === 'android',
  };
}
