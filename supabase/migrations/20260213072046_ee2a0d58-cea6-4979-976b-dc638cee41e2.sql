
-- Create enum for content categories
CREATE TYPE public.content_category AS ENUM ('prompt', 'tool', 'analysis', 'thought');

-- Create main content table
CREATE TABLE public.contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT,
  category content_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Anyone can read published content"
ON public.contents FOR SELECT
USING (published = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contents_updated_at
BEFORE UPDATE ON public.contents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for category filtering
CREATE INDEX idx_contents_category ON public.contents(category);
CREATE INDEX idx_contents_tags ON public.contents USING GIN(tags);
CREATE INDEX idx_contents_featured ON public.contents(featured) WHERE featured = true;
