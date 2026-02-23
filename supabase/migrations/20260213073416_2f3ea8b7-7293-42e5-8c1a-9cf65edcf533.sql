
-- Create enum for MCP deploy type
CREATE TYPE public.mcp_deploy_type AS ENUM ('remote', 'local', 'both');

-- Create enum for MCP category
CREATE TYPE public.mcp_category AS ENUM ('search', 'productivity', 'development', 'communication', 'data', 'design', 'ai', 'storage', 'automation', 'other');

-- Create MCP servers table
CREATE TABLE public.mcp_servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  icon_url TEXT,
  github_url TEXT,
  website_url TEXT,
  author TEXT,
  deploy_type mcp_deploy_type NOT NULL DEFAULT 'remote',
  category mcp_category NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  install_command TEXT,
  usage_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read published MCP servers"
ON public.mcp_servers FOR SELECT
USING (published = true);

-- Create trigger for timestamp updates
CREATE TRIGGER update_mcp_servers_updated_at
BEFORE UPDATE ON public.mcp_servers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_mcp_servers_category ON public.mcp_servers(category);
CREATE INDEX idx_mcp_servers_deploy_type ON public.mcp_servers(deploy_type);
CREATE INDEX idx_mcp_servers_tags ON public.mcp_servers USING GIN(tags);
CREATE INDEX idx_mcp_servers_featured ON public.mcp_servers(featured) WHERE featured = true;
CREATE INDEX idx_mcp_servers_slug ON public.mcp_servers(slug);
CREATE INDEX idx_mcp_servers_name_search ON public.mcp_servers USING GIN(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));
