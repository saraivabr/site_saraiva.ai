import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInfiniteQueryOptions<T> {
  /** Função que busca dados para uma página específica */
  queryFn: (page: number) => Promise<T[]>;
  /** Número de items por página (default: 20) */
  pageSize?: number;
  /** Callback quando dados são carregados */
  onSuccess?: (items: T[]) => void;
  /** Callback quando ocorre erro */
  onError?: (error: Error) => void;
}

export interface UseInfiniteQueryState<T> {
  /** Items carregados até agora */
  items: T[];
  /** Se está carregando no momento */
  isLoading: boolean;
  /** Erro ocorrido (se houver) */
  error: Error | null;
  /** Se há mais items para carregar */
  hasMore: boolean;
  /** Página atual */
  page: number;
  /** Dados em cache por página */
  cache: Map<number, T[]>;
}

export interface UseInfiniteQueryResult<T> extends UseInfiniteQueryState<T> {
  /** Função para carregar próxima página */
  loadMore: () => Promise<void>;
  /** Função para resetar estado */
  reset: () => void;
}

/**
 * Hook customizado para gerenciar paginação infinita com cache
 *
 * Features:
 * - Cache de páginas carregadas
 * - Estado de loading e erro
 * - Detecção automática de fim de lista
 * - Deduplicação de requisições
 *
 * @example
 * const { items, isLoading, hasMore, loadMore } = useInfiniteQuery({
 *   queryFn: (page) => fetch(`/api/items?page=${page}`).then(r => r.json()),
 *   pageSize: 20,
 * });
 */
export function useInfiniteQuery<T>(
  options: UseInfiniteQueryOptions<T>,
): UseInfiniteQueryResult<T> {
  const { queryFn, pageSize = 20, onSuccess, onError } = options;

  const [state, setState] = useState<UseInfiniteQueryState<T>>({
    items: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,
    cache: new Map(),
  });

  // Usar ref para evitar re-renderizar em cada função
  const loadingRef = useRef(false);
  const cacheRef = useRef<Map<number, T[]>>(new Map());
  const itemsRef = useRef<T[]>([]);

  /**
   * Carregar próxima página
   */
  const loadMore = useCallback(async () => {
    // Prevenir múltiplas requisições simultâneas
    if (loadingRef.current || !state.hasMore) {
      return;
    }

    loadingRef.current = true;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const nextPage = state.page + 1;

      // Verificar cache primeiro
      if (cacheRef.current.has(nextPage)) {
        const cachedData = cacheRef.current.get(nextPage)!;
        itemsRef.current = [...itemsRef.current, ...cachedData];

        setState((prev) => ({
          ...prev,
          items: itemsRef.current,
          page: nextPage,
          isLoading: false,
          hasMore: cachedData.length >= pageSize,
        }));

        onSuccess?.(cachedData);
        return;
      }

      // Buscar dados
      const newItems = await queryFn(nextPage);

      // Atualizar cache
      cacheRef.current.set(nextPage, newItems);

      // Adicionar itens aos existentes
      itemsRef.current = [...itemsRef.current, ...newItems];

      const hasMore = newItems.length >= pageSize;

      setState((prev) => ({
        ...prev,
        items: itemsRef.current,
        page: nextPage,
        isLoading: false,
        hasMore,
        cache: cacheRef.current,
      }));

      onSuccess?.(newItems);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({
        ...prev,
        error: err,
        isLoading: false,
      }));
      onError?.(err);
    } finally {
      loadingRef.current = false;
    }
  }, [state.page, state.hasMore, queryFn, pageSize, onSuccess, onError]);

  /**
   * Resetar estado para carregar do início
   */
  const reset = useCallback(() => {
    cacheRef.current.clear();
    itemsRef.current = [];
    loadingRef.current = false;

    setState({
      items: [],
      isLoading: false,
      error: null,
      hasMore: true,
      page: 1,
      cache: new Map(),
    });
  }, []);

  // Carregar primeira página automaticamente
  useEffect(() => {
    if (state.items.length === 0 && !loadingRef.current && state.page === 1) {
      loadMore();
    }
  }, []);

  return {
    ...state,
    loadMore,
    reset,
  };
}

/**
 * Hook para usar com componentes virtualizados
 * Retorna items atuais e handlers para infinite scroll
 */
export function useVirtualizedInfiniteQuery<T>(
  options: UseInfiniteQueryOptions<T>,
) {
  const result = useInfiniteQuery(options);

  return {
    items: result.items,
    isLoading: result.isLoading,
    error: result.error,
    hasMore: result.hasMore,
    loadMore: result.loadMore,
    reset: result.reset,
  };
}
