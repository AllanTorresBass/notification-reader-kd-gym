import type { NotificationData } from 'expo-android-notification-listener-service';

import { notificationRepository } from '@/lib/services/notifications/NotificationRepository';
import type {
  NotificationListFilters,
  NotificationListPage,
  NotificationRecord,
} from '@/types/notification/notification.types';

export class NotificationService {
  async ingest(
    data: NotificationData,
    options: { retentionDays: number; captureRawPayload: boolean }
  ): Promise<NotificationRecord> {
    return notificationRepository.upsertFromNative(data, options);
  }

  async list(
    offset: number,
    limit: number,
    filters: NotificationListFilters
  ): Promise<NotificationListPage> {
    return notificationRepository.listSlice(offset, limit, filters);
  }

  async get(id: string): Promise<NotificationRecord | null> {
    return notificationRepository.getById(id);
  }

  async purgeRetention(retentionDays: number): Promise<number> {
    return notificationRepository.purgeOlderThan(retentionDays);
  }

  async clearHistory(): Promise<void> {
    return notificationRepository.clearAll();
  }

  async removePackageHistory(packageName: string): Promise<number> {
    return notificationRepository.deleteByPackage(packageName);
  }

  async flush(): Promise<void> {
    return notificationRepository.flushPendingWrites();
  }
}

export const notificationService = new NotificationService();
