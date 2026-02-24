/**
 * Service Worker Registration Module
 *
 * Handles registration of the Service Worker and provides utilities
 * for managing the SW lifecycle, updates, and offline capabilities.
 */

/**
 * Registers the Service Worker
 *
 * @returns Promise with registration object or null if not supported
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Check if Service Worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported in this browser');
    return null;
  }

  // Check if we're in development mode
  const isDev = import.meta.env.DEV;

  try {
    console.log('[PWA] Registering Service Worker...');

    // Register the SW from public/sw.js
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      // In development, disable update checks for faster iteration
      updateViaCache: isDev ? 'none' : 'imports',
    });

    console.log('[PWA] Service Worker registered successfully', registration);

    // Set up update checking
    if (!isDev) {
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    }

    // Listen for SW controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Service Worker controller changed');
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregisters the Service Worker
 *
 * @returns Promise that resolves when unregistered
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('[PWA] Service Worker unregistered');
  } catch (error) {
    console.error('[PWA] Failed to unregister Service Worker:', error);
  }
}

/**
 * Checks if there's an update available for the Service Worker
 *
 * @param registration - The SW registration
 * @returns Promise that resolves to true if update available
 */
export async function checkForUpdate(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    await registration.update();

    // If a new SW is waiting, an update is available
    return registration.waiting !== null || registration.installing !== null;
  } catch (error) {
    console.error('[PWA] Failed to check for updates:', error);
    return false;
  }
}

/**
 * Triggers Service Worker update by skipping waiting
 *
 * @param registration - The SW registration
 */
export function updateServiceWorker(registration: ServiceWorkerRegistration): void {
  if (registration.waiting) {
    console.log('[PWA] Updating Service Worker...');

    // Tell the waiting SW to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload page when new SW takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

/**
 * Gets the current Service Worker registration
 *
 * @returns Promise with registration or null
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    console.error('[PWA] Failed to get SW registration:', error);
    return null;
  }
}

/**
 * Sends a message to all Service Worker clients
 *
 * @param message - The message to send
 */
export async function postMessageToSW(message: Record<string, unknown>): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage(message);
  } catch (error) {
    console.error('[PWA] Failed to post message to SW:', error);
  }
}

/**
 * Clears all caches
 *
 * @returns Promise that resolves when caches are cleared
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[PWA] All caches cleared');
  } catch (error) {
    console.error('[PWA] Failed to clear caches:', error);
  }
}

/**
 * Gets cache statistics
 *
 * @returns Promise with cache info
 */
export async function getCacheStats(): Promise<{
  caches: number;
  totalSize: string;
}> {
  if (!('caches' in window)) {
    return { caches: 0, totalSize: '0 B' };
  }

  try {
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

    return {
      caches: cacheNames.length,
      totalSize,
    };
  } catch (error) {
    console.error('[PWA] Failed to get cache stats:', error);
    return { caches: 0, totalSize: '0 B' };
  }
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
