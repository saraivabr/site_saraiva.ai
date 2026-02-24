import { useState, useMemo } from "react";
import { VirtualList } from "@/components/ui/virtual-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
}

/**
 * Exemplo simples de Virtual List
 * Renderiza 10,000 items com apenas os visíveis sendo renderizados
 */
export function SimpleVirtualListExample() {
  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      category: ["Tech", "Design", "Business", "Health"][i % 4],
    }));
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Virtual List - Simple</h2>
        <p className="text-sm text-muted-foreground">
          Renderizando 10,000 items com virtualization. Apenas items visíveis
          são renderizados.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
        <VirtualList
          items={items}
          itemHeight={80}
          overscan={5}
          renderItem={(item) => (
            <div className="border-b px-4 py-3 hover:bg-accent transition-colors flex gap-4 items-center">
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Badge variant="outline">{item.category}</Badge>
            </div>
          )}
        />
      </div>
    </div>
  );
}
