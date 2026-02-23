import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  created_at: string;
  updated_at: string;
}

export const useMcpServers = (filters?: {
  category?: McpCategory;
  deployType?: McpDeployType;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["mcp-servers", filters],
    queryFn: async () => {
      let query = supabase
        .from("mcp_servers")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("usage_count", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.deployType) {
        query = query.eq("deploy_type", filters.deployType);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as McpServer[];
    },
  });
};

export const useMcpServer = (slug: string) => {
  return useQuery({
    queryKey: ["mcp-server", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mcp_servers")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as McpServer;
    },
    enabled: !!slug,
  });
};

export const formatUsageCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(2)}m`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};
