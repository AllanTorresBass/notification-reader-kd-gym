export interface NotificationRecord {
  id: string;
  packageName: string;
  appLabel: string;
  title: string | null;
  body: string | null;
  bigText: string | null;
  postTime: number;
  notificationKey: string;
  groupKey: string | null;
  isGroupSummary: boolean;
  isRedacted: boolean;
  isOngoing: boolean;
  dismissedAt: number | null;
  rawPayloadJson: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface NotificationListFilters {
  packageName?: string;
  search?: string;
  ongoingOnly?: boolean;
}

export interface NotificationListPage {
  items: NotificationRecord[];
  nextOffset: number | null;
  total: number;
}

export interface StorageMeta {
  lastWriteAt: number;
  recordCount: number;
}
