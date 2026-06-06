import type { NotificationListFilters } from '@/types/notification/notification.types';

export const queryKeys = {
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: NotificationListFilters) =>
      [...queryKeys.notifications.lists(), filters] as const,
    details: () => [...queryKeys.notifications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.notifications.details(), id] as const,
  },
  access: {
    all: ['notification-access'] as const,
  },
  installedApps: {
    all: ['installed-apps'] as const,
  },
} as const;
