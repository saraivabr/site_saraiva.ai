/**
 * PWA Hooks Module
 *
 * React hooks for PWA features including:
 * - Online/offline status monitoring
 * - Service Worker lifecycle management
 * - Install prompt handling
 * - Update notifications
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to monitor online/offline status
 *
 * @returns Current online status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handler for online event
    const handleOnline = (): void => {
      console.log('[PWA] Online');
      setIsOnline(true);
    };

    // Handler for offline event
    const handleOffline = (): void => {
      console.log('[PWA] Offline');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Interface for Service Worker state
 */
interface ServiceWorkerState {
  isReady: boolean;
  needsUpdate: boolean;
  isInstalling: boolean;
  error: Error | null;
}

/**
 * Hook to manage Service Worker lifecycle
 *
 * @returns SW state and update function
 */
export function useServiceWorker(): ServiceWorkerState & { update: () => void } {
  const [state, setState] = useState<ServiceWorkerState>({
    isReady: false,
    needsUpdate: false,
    isInstalling: false,
    error: null,
  });

  const handleUpdate = useCallback((): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setState((prev) => ({ ...prev, needsUpdate: true }));
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          // Reload when new SW takes control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setState((prev) => ({
        ...prev,
        error: new Error('Service Worker not supported'),
      }));
      return;
    }

    // Check if SW is ready
    navigator.serviceWorker.ready
      .then((registration) => {
        setState((prev) => ({ ...prev, isReady: true }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            setState((prev) => ({ ...prev, isInstalling: true }));

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New SW is waiting
                setState((prev) => ({
                  ...prev,
                  needsUpdate: true,
                  isInstalling: false,
                }));
              }
            });
          }
        });

        // Check for updates periodically
        const updateInterval = setInterval(() => {
          registration.update();
        }, 60 * 1000); // Every minute

        return () => clearInterval(updateInterval);
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, error }));
      });
  }, []);

  return { ...state, update: handleUpdate };
}

/**
 * Interface for install prompt
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  canInstall: boolean;
  isPrompting: boolean;
  error: Error | null;
}

/**
 * Hook to capture and handle install prompt
 *
 * @returns Install state and prompt function
 */
export function useInstallPrompt(): InstallPromptState & {
  prompt: () => Promise<void>;
} {
  const [state, setState] = useState<InstallPromptState>({
    canInstall: false,
    isPrompting: false,
    error: null,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);

  const handlePrompt = useCallback(async (): Promise<void> => {
    if (!deferredPrompt) {
      setState((prev) => ({
        ...prev,
        error: new Error('Install prompt not available'),
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isPrompting: true }));

      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`[PWA] Install ${outcome}`);

      setDeferredPrompt(null);
      setState((prev) => ({
        ...prev,
        canInstall: false,
        isPrompting: false,
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState((prev) => ({
        ...prev,
        isPrompting: false,
        error: err,
      }));
    }
  }, [deferredPrompt]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event): void => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
      setState((prev) => ({
        ...prev,
        canInstall: true,
        error: null,
      }));
    };

    const handleAppInstalled = (): void => {
      console.log('[PWA] App installed');
      setDeferredPrompt(null);
      setState((prev) => ({
        ...prev,
        canInstall: false,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return { ...state, prompt: handlePrompt };
}

/**
 * Interface for background sync state
 */
interface BackgroundSyncState {
  isSupported: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  error: Error | null;
}

/**
 * Hook to manage background sync
 *
 * @param tag - The sync tag to use
 * @returns Sync state and trigger function
 */
export function useBackgroundSync(tag: string = 'sync-analytics'): BackgroundSyncState & {
  triggerSync: () => Promise<void>;
} {
  const [state, setState] = useState<BackgroundSyncState>({
    isSupported: false,
    isSyncing: false,
    lastSync: null,
    error: null,
  });

  const triggerSync = useCallback(async (): Promise<void> => {
    if (!navigator.serviceWorker) {
      setState((prev) => ({
        ...prev,
        error: new Error('Service Worker not supported'),
      }));
      return;
    }

    if (!('SyncManager' in window)) {
      setState((prev) => ({
        ...prev,
        error: new Error('Background Sync not supported'),
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isSyncing: true }));

      const registration = await navigator.serviceWorker.ready;
      const syncManager = (registration as ServiceWorkerRegistration & { sync: any }).sync;
      if (syncManager) {
        await syncManager.register(tag);
      } else {
        throw new Error('Background Sync API not available');
      }

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        error: null,
      }));

      console.log(`[PWA] Background sync registered for tag: ${tag}`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        error: err,
      }));
    }
  }, [tag]);

  useEffect(() => {
    // Check if Background Sync is supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      setState((prev) => ({ ...prev, isSupported: true }));
    }
  }, []);

  return { ...state, triggerSync };
}

/**
 * Interface for cache state
 */
export interface CacheState {
  cacheCount: number;
  totalSize: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to monitor cache statistics
 *
 * @param refreshInterval - Interval in ms to refresh stats (default: 0 = no auto-refresh)
 * @returns Cache state and refresh function
 */
export function useCacheStats(refreshInterval: number = 0): CacheState & {
  refresh: () => Promise<void>;
  clear: () => Promise<void>;
} {
  const [state, setState] = useState<CacheState>({
    cacheCount: 0,
    totalSize: '0 B',
    isLoading: false,
    error: null,
  });

  const refreshStats = useCallback(async (): Promise<void> => {
    if (!('caches' in window)) {
      setState((prev) => ({
        ...prev,
        error: new Error('Caches API not supported'),
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const cacheNames = await caches.keys();
      const sizes: number[] = [];

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();

        for (const req of keys) {
          const response = await cache.match(req);
          if (response) {
            const blob = await response.blob();
            sizes.push(blob.size);
          }
        }
      }

      const totalBytes = sizes.reduce((a, b) => a + b, 0);
      const totalSize = formatBytes(totalBytes);

      setState((prev) => ({
        ...prev,
        cacheCount: cacheNames.length,
        totalSize,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err,
      }));
    }
  }, []);

  const clearCaches = useCallback(async (): Promise<void> => {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('[PWA] Caches cleared');
      await refreshStats();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState((prev) => ({ ...prev, error: err }));
    }
  }, [refreshStats]);

  // Initial load and refresh interval
  useEffect(() => {
    refreshStats();

    if (refreshInterval > 0) {
      const interval = setInterval(refreshStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, refreshStats]);

  return { ...state, refresh: refreshStats, clear: clearCaches };
}

/**
 * Formats bytes to human-readable format
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
