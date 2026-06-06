import * as Burnt from 'burnt';

import { logger } from '@/lib/logger';

export function useGlobalErrorHandler() {
  const showSuccess = (title: string, message?: string) => {
    void Burnt.toast({
      title,
      message,
      preset: 'done',
      haptic: 'success',
    });
  };

  const handleFetchError = (error: unknown, fallbackMessage = 'Failed to load data') => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    logger.error('Fetch error', { message });
    void Burnt.toast({
      title: 'Error',
      message,
      preset: 'error',
      haptic: 'error',
    });
  };

  const handleCrudError = (error: unknown, fallbackMessage = 'Action failed') => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    logger.error('CRUD error', { message });
    void Burnt.toast({
      title: 'Error',
      message,
      preset: 'error',
      haptic: 'error',
    });
  };

  return { showSuccess, handleFetchError, handleCrudError };
}
