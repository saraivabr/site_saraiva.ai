import ExploreCard from "./ExploreCard";
import type { ExploreCardData } from "@/hooks/useExploreSearch";

interface ExploreCardGridProps {
  items: ExploreCardData[];
  isLoading: boolean;
}

const ExploreCardGrid = ({ items, isLoading }: ExploreCardGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border overflow-hidden animate-pulse"
          >
            <div className="h-36 bg-secondary" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4" />
              <div className="h-3 bg-secondary rounded w-full" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium text-foreground mb-2">Nenhum resultado encontrado</p>
        <p className="text-sm text-muted-foreground">Tente ajustar seus filtros ou buscar por outro termo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <ExploreCard key={`${item.type}-${"id" in item.data ? item.data.id : item.data.slug}`} item={item} index={i} />
      ))}
    </div>
  );
};

export default ExploreCardGrid;
