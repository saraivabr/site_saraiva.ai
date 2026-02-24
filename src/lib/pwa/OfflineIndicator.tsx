/**
 * OfflineIndicator Component
 *
 * Displays a visual indicator when the user is offline.
 * Shows connection status and provides actions like clearing cache.
 */

import React, { useState } from 'react';
import { useOnlineStatus, useCacheStats } from './hooks';
import { AlertCircle, Wifi, WifiOff, Trash2 } from 'lucide-react';

interface OfflineIndicatorProps {
  /**
   * Position of the indicator
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';

  /**
   * Show cache info
   * @default false
   */
  showCacheInfo?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Offline Indicator Component
 *
 * Displays when user is offline with options to clear cache
 */
export function OfflineIndicator({
  position = 'bottom',
  showCacheInfo = false,
  className = '',
}: OfflineIndicatorProps): React.ReactElement | null {
  const isOnline = useOnlineStatus();
  const cacheStats = useCacheStats();
  const [showDetails, setShowDetails] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Only show when offline
  if (isOnline) {
    return null;
  }

  const positionClass = position === 'top' ? 'top-4' : 'bottom-4';

  const handleClearCache = async (): Promise<void> => {
    setIsClearing(true);
    try {
      await cacheStats.clear();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div
      className={`fixed ${positionClass} left-4 right-4 max-w-sm z-50 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Offline status"
    >
      <div className="bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white px-4 py-3 rounded-lg shadow-lg border border-yellow-600 dark:border-yellow-500">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 flex-shrink-0" />

          <div className="flex-1">
            <div className="font-semibold text-sm">Você está offline</div>
            <div className="text-xs opacity-80">
              Alguns recursos podem não funcionar corretamente
            </div>

            {showCacheInfo && !isOnline && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs opacity-70 hover:opacity-100 mt-2 underline"
                aria-label="Toggle cache details"
              >
                {showDetails ? 'Ocultar' : 'Mostrar'} detalhes do cache
              </button>
            )}
          </div>

          <WifiOff className="w-5 h-5 flex-shrink-0 opacity-50" />
        </div>

        {showDetails && showCacheInfo && (
          <div className="mt-3 pt-3 border-t border-yellow-600 dark:border-yellow-500 space-y-2">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Caches:</span>
                <span className="font-semibold">{cacheStats.cacheCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tamanho:</span>
                <span className="font-semibold">{cacheStats.totalSize}</span>
              </div>
            </div>

            {cacheStats.error && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {cacheStats.error.message}
              </div>
            )}

            <button
              onClick={handleClearCache}
              disabled={isClearing || cacheStats.isLoading}
              className="w-full mt-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              aria-label="Clear cache"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? 'Limpando...' : 'Limpar Cache'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Online Status Badge Component
 *
 * Compact badge showing connection status
 */
export function OnlineStatusBadge({
  className = '',
}: {
  className?: string;
}): React.ReactElement {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium ${
        isOnline
          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100'
      } ${className}`}
      title={isOnline ? 'Connected' : 'Offline'}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}

/**
 * SW Update Indicator Component
 *
 * Shows when a new version is available
 */
interface SWUpdateIndicatorProps {
  needsUpdate: boolean;
  isUpdating?: boolean;
  onUpdate: () => void;
  className?: string;
}

export function SWUpdateIndicator({
  needsUpdate,
  isUpdating = false,
  onUpdate,
  className = '',
}: SWUpdateIndicatorProps): React.ReactElement | null {
  if (!needsUpdate) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 max-w-sm z-50 bg-blue-500 dark:bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg border border-blue-600 dark:border-blue-500 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Update available"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />

        <div className="flex-1">
          <div className="font-semibold text-sm">Atualização disponível</div>
          <div className="text-xs opacity-90">Uma nova versão está pronta para usar</div>
        </div>

        <button
          onClick={onUpdate}
          disabled={isUpdating}
          className="px-3 py-1.5 bg-white text-blue-600 dark:bg-blue-900 dark:text-white rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-opacity"
          aria-label="Update application"
        >
          {isUpdating ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  );
}
