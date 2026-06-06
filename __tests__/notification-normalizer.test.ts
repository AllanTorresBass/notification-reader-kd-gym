import {
  buildDedupeKey,
  createNotificationRecord,
  normalizeNativeNotification,
} from '@/lib/utils/notification-normalizer';

describe('notification-normalizer', () => {
  const baseNative = {
    packageName: 'com.whatsapp',
    id: 1,
    title: 'Alice',
    text: 'Hello',
    bigText: '',
    subText: '',
    summaryText: '',
    postTime: 1_700_000_000_000,
    key: 'notif-key-1',
    appName: 'WhatsApp',
    appIconPath: '',
  };

  it('builds stable dedupe keys', () => {
    expect(buildDedupeKey('com.whatsapp', 'key-1')).toBe('com.whatsapp::key-1');
  });

  it('normalizes visible content', () => {
    const partial = normalizeNativeNotification(baseNative, false);
    expect(partial.title).toBe('Alice');
    expect(partial.body).toBe('Hello');
    expect(partial.isRedacted).toBe(false);
  });

  it('marks redacted when no visible text', () => {
    const partial = normalizeNativeNotification(
      { ...baseNative, title: '', text: '', bigText: '' },
      false
    );
    expect(partial.isRedacted).toBe(true);
  });

  it('reuses id on upsert via createNotificationRecord', () => {
    const partial = normalizeNativeNotification(baseNative, false);
    const first = createNotificationRecord(partial);
    const second = createNotificationRecord(partial, first);
    expect(second.id).toBe(first.id);
    expect(second.updatedAt).toBeGreaterThanOrEqual(first.updatedAt);
  });
});
