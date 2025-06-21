
-- Create invitation_codes table
CREATE TABLE public.invitation_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to view all invitation codes
CREATE POLICY "Admins can view all invitation codes" 
  ON public.invitation_codes 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policy that allows admins to insert invitation codes
CREATE POLICY "Admins can create invitation codes" 
  ON public.invitation_codes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policy that allows admins to delete unused invitation codes
CREATE POLICY "Admins can delete unused invitation codes" 
  ON public.invitation_codes 
  FOR DELETE 
  TO authenticated
  USING (
    used = false AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policy that allows updating invitation codes when they are used
CREATE POLICY "Allow updating invitation codes when used" 
  ON public.invitation_codes 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);
