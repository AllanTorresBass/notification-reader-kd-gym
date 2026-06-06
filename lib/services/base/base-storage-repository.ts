export abstract class BaseStorageRepository {
  protected debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected scheduleDebouncedWrite(writeFn: () => Promise<void>, delayMs: number): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      void writeFn();
    }, delayMs);
  }

  protected clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
