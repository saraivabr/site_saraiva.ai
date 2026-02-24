/**
 * PWA Module - Progressive Web App Features
 *
 * Provides Service Worker registration, offline support, and PWA capabilities.
 *
 * @module lib/pwa
 *
 * @example
 * ```tsx
 * import { registerServiceWorker, useOnlineStatus, OfflineIndicator } from '@/lib/pwa';
 *
 * // In your app initialization:
 * registerServiceWorker();
 *
 * // In your components:
 * function MyComponent() {
 *   const isOnline = useOnlineStatus();
 *   return <OfflineIndicator />;
 * }
 * ```
 */

// Service Worker registration
export {
  registerServiceWorker,
  unregisterServiceWorker,
  checkForUpdate,
  updateServiceWorker,
  getServiceWorkerRegistration,
  postMessageToSW,
  clearAllCaches,
  getCacheStats,
} from './register';

// PWA hooks
export {
  useOnlineStatus,
  useServiceWorker,
  useInstallPrompt,
  useBackgroundSync,
  useCacheStats,
} from './hooks';

// UI Components
export {
  OfflineIndicator,
  OnlineStatusBadge,
  SWUpdateIndicator,
} from './OfflineIndicator';

// Type exports
export type { CacheState } from './hooks';
