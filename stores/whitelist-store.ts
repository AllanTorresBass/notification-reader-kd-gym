import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import { createZustandSecureStorage } from '@/lib/storage/zustand-secure-storage';

interface WhitelistState {
  allowedPackages: string[];
  appLabels: Record<string, string>;
  hasCompletedOnboarding: boolean;
  togglePackage: (packageName: string, appLabel: string) => void;
  setAppLabel: (packageName: string, appLabel: string) => void;
  addManualPackage: (packageName: string, appLabel: string) => void;
  removePackage: (packageName: string) => void;
  setOnboardingComplete: (value: boolean) => void;
}

export const useWhitelistStore = create<WhitelistState>()(
  persist(
    (set, get) => ({
      allowedPackages: [],
      appLabels: {},
      hasCompletedOnboarding: false,
      togglePackage: (packageName, appLabel) => {
        const { allowedPackages, appLabels } = get();
        const isSelected = allowedPackages.includes(packageName);
        if (isSelected) {
          const nextPackages = allowedPackages.filter((p) => p !== packageName);
          const nextLabels = { ...appLabels };
          delete nextLabels[packageName];
          set({ allowedPackages: nextPackages, appLabels: nextLabels });
          return;
        }
        set({
          allowedPackages: [...allowedPackages, packageName],
          appLabels: { ...appLabels, [packageName]: appLabel },
        });
      },
      setAppLabel: (packageName, appLabel) => {
        set({ appLabels: { ...get().appLabels, [packageName]: appLabel } });
      },
      addManualPackage: (packageName, appLabel) => {
        const trimmed = packageName.trim();
        if (!trimmed || get().allowedPackages.includes(trimmed)) {
          return;
        }
        set({
          allowedPackages: [...get().allowedPackages, trimmed],
          appLabels: { ...get().appLabels, [trimmed]: appLabel.trim() || trimmed },
        });
      },
      removePackage: (packageName) => {
        const nextPackages = get().allowedPackages.filter((p) => p !== packageName);
        const nextLabels = { ...get().appLabels };
        delete nextLabels[packageName];
        set({ allowedPackages: nextPackages, appLabels: nextLabels });
      },
      setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
    }),
    {
      name: 'whitelist-store',
      storage: createJSONStorage(() => createZustandSecureStorage(STORAGE_KEYS.whitelist)),
    }
  )
);
