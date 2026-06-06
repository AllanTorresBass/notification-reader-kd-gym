import { z } from 'zod';

export const notificationRecordSchema = z.object({
  id: z.string().uuid(),
  packageName: z.string().min(1),
  appLabel: z.string().min(1),
  title: z.string().nullable(),
  body: z.string().nullable(),
  bigText: z.string().nullable(),
  postTime: z.number().int().positive(),
  notificationKey: z.string().min(1),
  groupKey: z.string().nullable(),
  isGroupSummary: z.boolean(),
  isRedacted: z.boolean(),
  isOngoing: z.boolean(),
  dismissedAt: z.number().nullable(),
  rawPayloadJson: z.string().nullable(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});

export const notificationStoreEnvelopeSchema = z.object({
  version: z.literal(1),
  records: z.array(notificationRecordSchema),
});

export const storageMetaSchema = z.object({
  lastWriteAt: z.number().int().nonnegative(),
  recordCount: z.number().int().nonnegative(),
});

export const notificationListFiltersSchema = z.object({
  packageName: z.string().optional(),
  search: z.string().optional(),
  ongoingOnly: z.boolean().optional(),
});

export type NotificationRecordInput = z.infer<typeof notificationRecordSchema>;
export type NotificationStoreEnvelope = z.infer<typeof notificationStoreEnvelopeSchema>;
