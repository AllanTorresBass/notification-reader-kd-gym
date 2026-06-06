import { COMMON_ANDROID_APPS, type InstalledAppInfo } from '@/constants/common-android-apps';
import { notificationRepository } from '@/lib/services/notifications/NotificationRepository';

export class InstalledAppsService {
  async list(): Promise<InstalledAppInfo[]> {
    const fromHistory = await this.getAppsFromNotificationHistory();
    const merged = new Map<string, InstalledAppInfo>();

    for (const app of COMMON_ANDROID_APPS) {
      merged.set(app.packageName, app);
    }
    for (const app of fromHistory) {
      merged.set(app.packageName, app);
    }

    return Array.from(merged.values()).sort((a, b) =>
      a.appLabel.localeCompare(b.appLabel)
    );
  }

  async search(query: string): Promise<InstalledAppInfo[]> {
    const all = await this.list();
    const q = query.trim().toLowerCase();
    if (!q) {
      return all;
    }
    return all.filter(
      (app) =>
        app.appLabel.toLowerCase().includes(q) ||
        app.packageName.toLowerCase().includes(q)
    );
  }

  private async getAppsFromNotificationHistory(): Promise<InstalledAppInfo[]> {
    const records = await notificationRepository.getAllValidated();
    const map = new Map<string, InstalledAppInfo>();
    for (const record of records) {
      map.set(record.packageName, {
        packageName: record.packageName,
        appLabel: record.appLabel,
      });
    }
    return Array.from(map.values());
  }
}

export const installedAppsService = new InstalledAppsService();
