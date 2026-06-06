import * as SecureStore from 'expo-secure-store';

import { logger } from '@/lib/logger';

export class SecureStorageClient {
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const raw = await SecureStore.getItemAsync(key);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error('SecureStore read failed', { key, error: String(error) });
      return null;
    }
  }

  async setJson<T>(key: string, value: T): Promise<void> {
    try {
      const raw = JSON.stringify(value);
      await SecureStore.setItemAsync(key, raw);
    } catch (error) {
      logger.error('SecureStore write failed', { key, error: String(error) });
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('SecureStore delete failed', { key, error: String(error) });
      throw error;
    }
  }
}

export const secureStorageClient = new SecureStorageClient();
