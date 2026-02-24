import { useInfiniteQuery } from "@/components/ui/virtual-list";
import { InfiniteScroll } from "@/components/ui/virtual-list";
import { Card, CardContent } from "@/components/ui/card";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

/**
 * Exemplo de Infinite Scroll com useInfiniteQuery
 * Carrega posts dinamicamente conforme o usuário faz scroll
 */
export function InfiniteScrollExample() {
  // Simular fetch de dados
  const mockQueryFn = async (page: number): Promise<Post[]> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Retornar dados mockados (parar após página 5)
    if (page > 5) return [];

    return Array.from({ length: 10 }, (_, i) => {
      const id = (page - 1) * 10 + i;
      return {
        id,
        title: `Post ${id + 1}`,
        excerpt: `This is an excerpt for post number ${id + 1}. It contains some interesting content about various topics.`,
        author: `Author ${(id % 5) + 1}`,
        date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)
          .toLocaleDateString(),
      };
    });
  };

  const { items, isLoading, error, hasMore, loadMore } = useInfiniteQuery({
    queryFn: mockQueryFn,
    pageSize: 10,
    onError: (error) => console.error("Error loading posts:", error),
  });

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Infinite Scroll</h2>
        <p className="text-sm text-muted-foreground">
          Role para baixo para carregar mais posts automaticamente
        </p>
      </div>

      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        threshold={300}
        skeletonCount={3}
        skeletonHeight={100}
      >
        <div className="space-y-3">
          {items.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
