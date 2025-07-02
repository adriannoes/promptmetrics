-- Create table to store complete analysis results from n8n
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Anyone can view analysis results" 
ON public.analysis_results 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert analysis results" 
ON public.analysis_results 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_analysis_results_domain ON public.analysis_results(domain);
CREATE INDEX idx_analysis_results_created_at ON public.analysis_results(created_at DESC);