import { useMemo } from "react";
import { VirtualList, useInfiniteQuery } from "@/components/ui/virtual-list";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

/**
 * Exemplo combinado: Virtual List + Infinite Query
 * Combina alta performance de virtualization com infinite scroll
 *
 * Ideal para listas muito grandes (100k+ items) carregadas incrementalmente
 */
export function VirtualizedInfiniteListExample() {
  // Simular fetch de dados
  const mockQueryFn = async (page: number): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (page > 10) return [];

    return Array.from({ length: 50 }, (_, i) => {
      const id = (page - 1) * 50 + i;
      return {
        id,
        name: `Product ${id + 1}`,
        price: Math.round(Math.random() * 1000) / 10,
        stock: Math.floor(Math.random() * 1000),
      };
    });
  };

  const { items, isLoading, hasMore, loadMore } = useInfiniteQuery({
    queryFn: mockQueryFn,
    pageSize: 50,
  });

  // Height estimado para items
  const ITEM_HEIGHT = 60;

  // Renderizar item individualizado
  const renderItem = (item: Product) => (
    <div className="border-b px-4 py-3 hover:bg-accent transition-colors grid grid-cols-4 gap-4">
      <div>
        <p className="font-medium text-sm">{item.name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm ${item.stock > 100 ? "text-green-600" : "text-orange-600"}`}>
          {item.stock} em estoque
        </p>
      </div>
      <div className="text-right">
        <button
          onClick={() => console.log(`Adding ${item.name} to cart`)}
          className="text-xs text-primary hover:underline"
        >
          Adicionar
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Virtualized Infinite List</h2>
        <p className="text-sm text-muted-foreground">
          Combina virtualization com infinite scroll para máxima performance
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        {/* Header */}
        <div className="border-b px-4 py-3 grid grid-cols-4 gap-4 bg-muted font-semibold text-sm">
          <div>Produto</div>
          <div className="text-right">Preço</div>
          <div className="text-right">Estoque</div>
          <div className="text-right">Ação</div>
        </div>

        {/* Virtual List with infinite scroll */}
        <div style={{ height: "600px", position: "relative" }}>
          {items.length === 0 && isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} style={{ height: `${ITEM_HEIGHT}px` }} />
              ))}
            </div>
          ) : (
            <div style={{ position: "relative", height: "100%" }}>
              <VirtualList
                items={items}
                itemHeight={ITEM_HEIGHT}
                overscan={5}
                renderItem={(item, _index) => renderItem(item)}
              />

              {/* Load more trigger */}
              {hasMore && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "100px",
                    pointerEvents: "none",
                  }}
                  onMouseEnter={() => {
                    if (!isLoading) loadMore();
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t px-4 py-3 bg-muted text-sm text-muted-foreground">
          Mostrando {items.length} produtos
          {hasMore && ` • Role para carregar mais`}
          {!hasMore && ` • Todos os produtos carregados`}
        </div>
      </div>
    </div>
  );
}
