import { useQuery } from "@tanstack/react-query";

export type McpDeployType = "remote" | "local" | "both";
export type McpCategory = "search" | "productivity" | "development" | "communication" | "data" | "design" | "ai" | "storage" | "automation" | "other";

export interface McpServer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  icon_url: string | null;
  github_url: string | null;
  website_url: string | null;
  author: string | null;
  deploy_type: McpDeployType;
  category: McpCategory;
  tags: string[];
  tools: string[];
  install_command: string | null;
  usage_count: number;
  verified: boolean;
  featured: boolean;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useMcpServers = (filters?: {
  category?: McpCategory;
  deployType?: McpDeployType;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["mcp-servers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.set("category", filters.category);
      if (filters?.deployType) params.set("deploy_type", filters.deployType);
      if (filters?.search) params.set("search", filters.search);

      const url = `/api/mcps${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch MCPs");
      return res.json() as Promise<McpServer[]>;
    },
  });
};

export const useMcpServer = (slug: string) => {
  return useQuery({
    queryKey: ["mcp-server", slug],
    queryFn: async () => {
      const res = await fetch(`/api/mcps/${slug}`);
      if (!res.ok) throw new Error("MCP not found");
      return res.json() as Promise<McpServer>;
    },
    enabled: !!slug,
  });
};

export const formatUsageCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(2)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};
