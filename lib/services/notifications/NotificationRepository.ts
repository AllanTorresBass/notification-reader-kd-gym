import {
  DEFAULT_RETENTION_DAYS,
  MAX_NOTIFICATION_RECORDS,
  NOTIFICATION_PAGE_SIZE,
  STORAGE_KEYS,
  STORAGE_VERSION,
  STORAGE_WRITE_DEBOUNCE_MS,
} from '@/constants/storage-keys';
import { BaseStorageRepository } from '@/lib/services/base/base-storage-repository';
import { secureStorageClient } from '@/lib/storage/secure-storage-client';
import { logger } from '@/lib/logger';
import {
  buildDedupeKey,
  createNotificationRecord,
  normalizeNativeNotification,
} from '@/lib/utils/notification-normalizer';
import type { NotificationData } from 'expo-android-notification-listener-service';
import {
  notificationRecordSchema,
  notificationStoreEnvelopeSchema,
  storageMetaSchema,
} from '@/types/notification/notification.schemas';
import type {
  NotificationListFilters,
  NotificationListPage,
  NotificationRecord,
  StorageMeta,
} from '@/types/notification/notification.types';
import { filterNotifications } from '@/lib/utils/group-notifications';

export class NotificationRepository extends BaseStorageRepository {
  private cache: NotificationRecord[] | null = null;
  private dedupeIndex = new Map<string, NotificationRecord>();
  private isHydrated = false;

  private async hydrate(): Promise<NotificationRecord[]> {
    if (this.cache && this.isHydrated) {
      return this.cache;
    }

    const envelope = await secureStorageClient.getJson<unknown>(STORAGE_KEYS.notifications);
    if (!envelope) {
      this.cache = [];
      this.rebuildIndex();
      this.isHydrated = true;
      return this.cache;
    }

    const parsed = notificationStoreEnvelopeSchema.safeParse(envelope);
    if (!parsed.success) {
      logger.warn('Invalid notification envelope, resetting store');
      this.cache = [];
      this.rebuildIndex();
      this.isHydrated = true;
      return this.cache;
    }

    this.cache = parsed.data.records;
    this.rebuildIndex();
    this.isHydrated = true;
    return this.cache;
  }

  private rebuildIndex(): void {
    this.dedupeIndex.clear();
    for (const record of this.cache ?? []) {
      this.dedupeIndex.set(buildDedupeKey(record.packageName, record.notificationKey), record);
    }
  }

  private applyRetention(records: NotificationRecord[], retentionDays: number): NotificationRecord[] {
    const cutoff = Date.now() - retentionDays * 86_400_000;
    const sorted = [...records]
      .filter((r) => r.postTime >= cutoff)
      .sort((a, b) => b.postTime - a.postTime);
    return sorted.slice(0, MAX_NOTIFICATION_RECORDS);
  }

  private async persistNow(records: NotificationRecord[]): Promise<void> {
    const envelope = { version: STORAGE_VERSION as 1, records };
    await secureStorageClient.setJson(STORAGE_KEYS.notifications, envelope);
    const meta: StorageMeta = {
      lastWriteAt: Date.now(),
      recordCount: records.length,
    };
    await secureStorageClient.setJson(STORAGE_KEYS.meta, storageMetaSchema.parse(meta));
    this.cache = records;
    this.rebuildIndex();
  }

  private schedulePersist(records: NotificationRecord[]): void {
    this.scheduleDebouncedWrite(async () => {
      await this.persistNow(records);
    }, STORAGE_WRITE_DEBOUNCE_MS);
  }

  async upsertFromNative(
    data: NotificationData,
    options: { retentionDays: number; captureRawPayload: boolean }
  ): Promise<NotificationRecord> {
    const records = await this.hydrate();
    const partial = normalizeNativeNotification(data, options.captureRawPayload);
    const dedupeKey = buildDedupeKey(partial.packageName, partial.notificationKey);
    const existing = this.dedupeIndex.get(dedupeKey);
    const record = createNotificationRecord(partial, existing);

    const withoutExisting = existing
      ? records.filter((r) => r.id !== existing.id)
      : records;
    const merged = this.applyRetention([record, ...withoutExisting], options.retentionDays);

    this.cache = merged;
    this.rebuildIndex();
    this.schedulePersist(merged);
    return record;
  }

  async listSlice(
    offset: number,
    limit: number = NOTIFICATION_PAGE_SIZE,
    filters: NotificationListFilters = {}
  ): Promise<NotificationListPage> {
    const records = await this.hydrate();
    const filtered = filterNotifications(records, filters).sort((a, b) => b.postTime - a.postTime);
    const items = filtered.slice(offset, offset + limit);
    const nextOffset = offset + limit < filtered.length ? offset + limit : null;
    return { items, nextOffset, total: filtered.length };
  }

  async getById(id: string): Promise<NotificationRecord | null> {
    const records = await this.hydrate();
    return records.find((r) => r.id === id) ?? null;
  }

  async purgeOlderThan(retentionDays: number): Promise<number> {
    const records = await this.hydrate();
    const before = records.length;
    const pruned = this.applyRetention(records, retentionDays);
    await this.persistNow(pruned);
    return before - pruned.length;
  }

  async deleteByPackage(packageName: string): Promise<number> {
    const records = await this.hydrate();
    const remaining = records.filter((r) => r.packageName !== packageName);
    const removed = records.length - remaining.length;
    await this.persistNow(remaining);
    return removed;
  }

  async clearAll(): Promise<void> {
    this.clearDebounce();
    this.cache = [];
    this.dedupeIndex.clear();
    await secureStorageClient.delete(STORAGE_KEYS.notifications);
    await secureStorageClient.delete(STORAGE_KEYS.meta);
  }

  async flushPendingWrites(): Promise<void> {
    if (!this.cache) {
      return;
    }
    this.clearDebounce();
    await this.persistNow(this.cache);
  }

  async getAllValidated(): Promise<NotificationRecord[]> {
    const records = await this.hydrate();
    return records.map((r) => notificationRecordSchema.parse(r));
  }
}

export const notificationRepository = new NotificationRepository();
