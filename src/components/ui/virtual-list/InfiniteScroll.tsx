import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface InfiniteScrollProps {
  /** Conteúdo da lista */
  children: React.ReactNode;
  /** Função chamada quando deve carregar mais items */
  loadMore: () => Promise<void>;
  /** Se há mais items para carregar */
  hasMore: boolean;
  /** Componente loader customizado */
  loader?: React.ReactNode;
  /** Distância em pixels do fim para disparar load */
  threshold?: number;
  /** Classes CSS customizadas */
  className?: string;
  /** Número de skeleton loaders para mostrar */
  skeletonCount?: number;
  /** Altura dos skeleton loaders */
  skeletonHeight?: number;
  /** Debounce em ms para evitar múltiplas chamadas */
  debounceMs?: number;
  /** Callback chamado quando ocorre erro */
  onError?: (error: Error) => void;
}

/**
 * Componente de infinite scroll que detecta quando usuário
 * chega perto do fim da lista e carrega mais items
 *
 * Usa IntersectionObserver para melhor performance
 * e suporta retry automático em caso de erro
 */
const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      children,
      loadMore,
      hasMore,
      loader,
      threshold = 250,
      className,
      skeletonCount = 3,
      skeletonHeight = 60,
      debounceMs = 200,
      onError,
    },
    ref,
  ) => {
    const observerTarget = React.useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);
    const loadingRef = React.useRef(false);
    const debounceTimerRef = React.useRef<NodeJS.Timeout>();

    // Debounced load more
    const debouncedLoadMore = React.useCallback(() => {
      if (loadingRef.current || !hasMore) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
          await loadMore();
          setRetryCount(0);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);

          // Retry automático até 3 vezes
          if (retryCount < 3) {
            setRetryCount((prev) => prev + 1);
            // Retry após 1-2 segundos
            setTimeout(() => {
              debouncedLoadMore();
            }, 1000 + Math.random() * 1000);
          }
        } finally {
          setIsLoading(false);
          loadingRef.current = false;
        }
      }, debounceMs);
    }, [loadMore, hasMore, retryCount, debounceMs, onError]);

    // Setup IntersectionObserver
    React.useEffect(() => {
      const target = observerTarget.current;
      if (!target) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Disparar load quando elemento está visível
            if (entry.isIntersecting && hasMore && !isLoading) {
              debouncedLoadMore();
            }
          });
        },
        {
          rootMargin: `${threshold}px`,
          threshold: 0.01,
        },
      );

      observer.observe(target);

      return () => {
        observer.disconnect();
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, [hasMore, isLoading, threshold, debouncedLoadMore]);

    // Default loader com skeletons
    const defaultLoader = (
      <div className="space-y-2 px-4 py-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton
            key={i}
            style={{ height: `${skeletonHeight}px` }}
            className="w-full"
          />
        ))}
      </div>
    );

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {children}

        {/* Sentinel element para detecção de scroll */}
        {hasMore && (
          <div
            ref={observerTarget}
            className="flex justify-center py-4"
            role="status"
            aria-label={isLoading ? "Loading more items" : ""}
          >
            {error && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-destructive">
                  {error.message || "Erro ao carregar mais items"}
                </p>
                {retryCount < 3 && (
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      debouncedLoadMore();
                    }}
                    className="text-xs text-primary underline hover:no-underline"
                    type="button"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            )}
            {!error && isLoading && (loader || defaultLoader)}
          </div>
        )}

        {/* Feedback quando terminou */}
        {!hasMore && !isLoading && children && (
          <div className="flex justify-center py-4 text-sm text-muted-foreground">
            Sem mais items para carregar
          </div>
        )}
      </div>
    );
  },
);

InfiniteScroll.displayName = "InfiniteScroll";

export { InfiniteScroll };
