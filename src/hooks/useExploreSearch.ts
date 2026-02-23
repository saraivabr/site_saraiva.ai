import { useMemo } from "react";
import { useContents, type Content, type ContentCategory } from "@/hooks/useContents";
import { useMcpServers, type McpServer, type McpCategory } from "@/hooks/useMcpServers";
import { templates, type Template, type TemplateCategory } from "@/data/templates";

export type ExploreTab = "tools" | "prompts" | "mcps" | "templates" | "analysis";

export type ExploreCardData =
  | { type: "content"; data: Content }
  | { type: "mcp"; data: McpServer }
  | { type: "template"; data: Template };

const tabToCategoryMap: Record<string, ContentCategory> = {
  tools: "tool",
  prompts: "prompt",
  analysis: "analysis",
};

export function useExploreSearch({
  tab,
  search,
  category,
  pricing,
}: {
  tab: ExploreTab;
  search: string;
  category: string;
  pricing: string;
}) {
  const isContentTab = tab === "tools" || tab === "prompts" || tab === "analysis";
  const isMcpTab = tab === "mcps";

  const contentCategory = isContentTab ? tabToCategoryMap[tab] : undefined;
  const contentTag = isContentTab && category !== "all" ? category : undefined;
  const contentSearch = isContentTab && search ? search : undefined;
  const contentPricing = isContentTab && tab === "tools" && pricing !== "all" ? pricing : undefined;

  const {
    data: contents,
    isLoading: contentsLoading,
  } = useContents(
    contentCategory,
    contentTag,
    contentSearch,
    contentPricing,
  );

  const mcpCategoryFilter = isMcpTab && category !== "all" ? category as McpCategory : undefined;
  const mcpSearch = isMcpTab && search ? search : undefined;

  const {
    data: mcpServers,
    isLoading: mcpsLoading,
  } = useMcpServers(
    isMcpTab ? { category: mcpCategoryFilter, search: mcpSearch } : undefined,
  );

  const results: ExploreCardData[] = useMemo(() => {
    if (isContentTab) {
      return (contents ?? []).map((c) => ({ type: "content" as const, data: c }));
    }

    if (isMcpTab) {
      return (mcpServers ?? []).map((m) => ({ type: "mcp" as const, data: m }));
    }

    if (tab === "templates") {
      let filtered = templates;

      if (category !== "all") {
        filtered = filtered.filter((t) => t.category === category as TemplateCategory);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
        );
      }

      return filtered.map((t) => ({ type: "template" as const, data: t }));
    }

    return [];
  }, [tab, contents, mcpServers, category, search, isContentTab, isMcpTab]);

  const isLoading = isContentTab ? contentsLoading : isMcpTab ? mcpsLoading : false;

  return { results, isLoading };
}
