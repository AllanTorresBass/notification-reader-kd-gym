import type { NotificationRecord } from '@/types/notification/notification.types';

export interface TimelineSection {
  title: string;
  data: NotificationRecord[];
}

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getSectionLabel(postTime: number, now: number): string {
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - 86_400_000;
  const dayStart = startOfDay(postTime);

  if (dayStart === todayStart) {
    return 'Today';
  }
  if (dayStart === yesterdayStart) {
    return 'Yesterday';
  }
  return new Date(postTime).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function groupNotificationsByDate(records: NotificationRecord[]): TimelineSection[] {
  const now = Date.now();
  const sorted = [...records].sort((a, b) => b.postTime - a.postTime);
  const sections: TimelineSection[] = [];

  for (const record of sorted) {
    const label = getSectionLabel(record.postTime, now);
    const last = sections[sections.length - 1];
    if (last?.title === label) {
      last.data.push(record);
    } else {
      sections.push({ title: label, data: [record] });
    }
  }

  return sections;
}

export function filterNotifications(
  records: NotificationRecord[],
  filters: { packageName?: string; search?: string; ongoingOnly?: boolean }
): NotificationRecord[] {
  const searchLower = filters.search?.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.packageName && record.packageName !== filters.packageName) {
      return false;
    }
    if (filters.ongoingOnly && !record.isOngoing) {
      return false;
    }
    if (searchLower) {
      const haystack = [record.title, record.body, record.bigText, record.appLabel, record.packageName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
}
