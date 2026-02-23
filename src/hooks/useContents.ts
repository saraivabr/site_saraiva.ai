import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentCategory = "prompt" | "tool" | "analysis" | "thought";

export interface Content {
  id: string;
  title: string;
  description: string | null;
  body: string | null;
  category: ContentCategory;
  tags: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  pricing: string | null;
  website_url: string | null;
}

export const useContents = (
  category?: ContentCategory,
  tag?: string,
  search?: string,
  pricing?: string,
) => {
  return useQuery({
    queryKey: ["contents", category, tag, search, pricing],
    queryFn: async () => {
      let query = supabase
        .from("contents")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      if (tag) {
        query = query.contains("tags", [tag]);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (pricing) {
        query = query.eq("pricing", pricing);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Content[];
    },
  });
};

export const useContent = (id: string) => {
  return useQuery({
    queryKey: ["content", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Content;
    },
    enabled: !!id,
  });
};
