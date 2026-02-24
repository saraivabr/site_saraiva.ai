import * as React from "react";
import { cn } from "@/lib/utils";

export interface VirtualListProps<T> {
  /** Array de items a serem renderizados */
  items: T[];
  /** Função para renderizar cada item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Altura fixa de cada item em pixels */
  itemHeight: number;
  /** Número de items extras para renderizar acima/abaixo do viewport */
  overscan?: number;
  /** Classes CSS customizadas para o container */
  className?: string;
  /** Container scroll customizado (padrão: window) */
  scrollContainer?: HTMLElement | null;
}

interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

/**
 * Componente de lista virtualizada que renderiza apenas items visíveis
 * Usa IntersectionObserver para detectar scroll eficientemente
 * Suporta listas com milhares de items sem performance issues
 */
const VirtualList = React.forwardRef<HTMLDivElement, VirtualListProps<any>>(
  (
    {
      items,
      renderItem,
      itemHeight,
      overscan = 5,
      className,
      scrollContainer,
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = React.useState<VisibleRange>({
      startIndex: 0,
      endIndex: Math.min(overscan * 2, items.length),
    });

    const [scrollTop, setScrollTop] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);

    // Usar scrollContainer se fornecido, caso contrário usar containerRef
    const effectiveScrollContainer = scrollContainer || containerRef.current;

    // Calcular items visíveis baseado no scroll
    const calculateVisibleRange = React.useCallback((): VisibleRange => {
      if (!effectiveScrollContainer) {
        return { startIndex: 0, endIndex: Math.min(overscan * 2, items.length) };
      }

      const scrollTop = effectiveScrollContainer.scrollTop || 0;
      const containerHeight =
        effectiveScrollContainer.clientHeight || window.innerHeight;

      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
      const endIndex = Math.min(items.length, startIndex + visibleCount);

      return { startIndex, endIndex };
    }, [items.length, itemHeight, overscan, effectiveScrollContainer]);

    // Handler do scroll com debounce
    const handleScroll = React.useCallback(() => {
      if (!effectiveScrollContainer) return;

      setScrollTop(effectiveScrollContainer.scrollTop);
      const newRange = calculateVisibleRange();
      setVisibleRange(newRange);
    }, [effectiveScrollContainer, calculateVisibleRange]);

    // Setup IntersectionObserver para scroll detection
    React.useEffect(() => {
      const container = effectiveScrollContainer;
      if (!container) return;

      // Medir altura do container
      const resizeObserver = new ResizeObserver(() => {
        setContainerHeight(container.clientHeight);
      });
      resizeObserver.observe(container);

      // Usar requestAnimationFrame para smooth scroll
      let scrollTimeout: NodeJS.Timeout;
      const optimizedScroll = () => {
        handleScroll();
        scrollTimeout = setTimeout(() => {
          handleScroll();
        }, 150);
      };

      container.addEventListener("scroll", optimizedScroll, { passive: true });

      return () => {
        container.removeEventListener("scroll", optimizedScroll);
        resizeObserver.disconnect();
        clearTimeout(scrollTimeout);
      };
    }, [effectiveScrollContainer, handleScroll]);

    // Calcular offsets de posicionamento
    const offsetY = visibleRange.startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;
    const visibleItems = items.slice(
      visibleRange.startIndex,
      visibleRange.endIndex,
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-y-auto overflow-x-hidden",
          className,
        )}
        style={{
          contain: "layout style paint",
        }}
      >
        {/* Container com altura total da lista para manter scroll */}
        <div
          style={{
            height: totalHeight,
            position: "relative",
            width: "100%",
          }}
        >
          {/* Items renderizados com posicionamento absoluto */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              // CSS containment para melhor performance
              contain: "content",
            }}
          >
            {visibleItems.map((item, index) => (
              <div
                key={visibleRange.startIndex + index}
                style={{
                  height: itemHeight,
                  position: "relative",
                }}
              >
                {renderItem(item, visibleRange.startIndex + index)}
              </div>
            ))}
          </div>
        </div>

        {/* Debug info (remove em produção se desejado) */}
        <div className="sr-only">
          Showing {visibleRange.startIndex} to {visibleRange.endIndex} of{" "}
          {items.length} items
        </div>
      </div>
    );
  },
);

VirtualList.displayName = "VirtualList";

export { VirtualList };
