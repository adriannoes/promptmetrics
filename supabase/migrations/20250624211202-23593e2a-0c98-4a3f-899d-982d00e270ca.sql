
-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add organization_id to profiles table to link users to organizations
ALTER TABLE public.profiles 
ADD COLUMN organization_id UUID REFERENCES public.organizations(id);

-- Add Row Level Security (RLS) to organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own organization
CREATE POLICY "Users can view their organization" 
  ON public.organizations 
  FOR SELECT 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.profiles 
      WHERE id = auth.uid() AND organization_id IS NOT NULL
    )
  );

-- Insert a sample organization for testing
INSERT INTO public.organizations (name, slug, website_url) 
VALUES ('PromptMetrics', 'promptmetrics', 'https://promptmetrics.com');

-- Create an index on slug for faster lookups
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
