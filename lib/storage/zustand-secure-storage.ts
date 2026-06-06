import type { StateStorage } from 'zustand/middleware';

import { secureStorageClient } from '@/lib/storage/secure-storage-client';

interface PrefsBlob {
  state: Record<string, unknown>;
}

export function createZustandSecureStorage(storageKey: string): StateStorage {
  return {
    getItem: async (_name: string): Promise<string | null> => {
      const blob = await secureStorageClient.getJson<PrefsBlob>(storageKey);
      if (!blob?.state) {
        return null;
      }
      return JSON.stringify(blob.state);
    },
    setItem: async (_name: string, value: string): Promise<void> => {
      const state = JSON.parse(value) as Record<string, unknown>;
      await secureStorageClient.setJson<PrefsBlob>(storageKey, { state });
    },
    removeItem: async (_name: string): Promise<void> => {
      await secureStorageClient.delete(storageKey);
    },
  };
}
