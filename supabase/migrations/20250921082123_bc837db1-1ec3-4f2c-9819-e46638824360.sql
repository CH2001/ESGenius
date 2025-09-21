-- Drop existing tables and create new simplified structure
DROP TABLE IF EXISTS public.assessment_results CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create new companies table that combines organization and company data
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  size TEXT NOT NULL DEFAULT 'small',
  location TEXT NOT NULL,
  employees INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC NOT NULL DEFAULT 0,
  established_year INTEGER NOT NULL,
  registration_number TEXT,
  description TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Users can view their own companies" 
ON public.companies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  frameworks TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments
CREATE POLICY "Users can view assessments for their companies" 
ON public.assessments 
FOR SELECT 
USING (company_id IN (
  SELECT id FROM public.companies WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create assessments for their companies" 
ON public.assessments 
FOR INSERT 
WITH CHECK (company_id IN (
  SELECT id FROM public.companies WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update assessments for their companies" 
ON public.assessments 
FOR UPDATE 
USING (company_id IN (
  SELECT id FROM public.companies WHERE user_id = auth.uid()
));

-- Create assessment results table
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL,
  framework TEXT NOT NULL,
  lambda_request JSONB NOT NULL,
  lambda_response JSONB,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for assessment results
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment results
CREATE POLICY "Users can view assessment results for their companies" 
ON public.assessment_results 
FOR SELECT 
USING (assessment_id IN (
  SELECT assessments.id FROM assessments
  JOIN companies ON assessments.company_id = companies.id
  WHERE companies.user_id = auth.uid()
));

CREATE POLICY "Users can create assessment results for their companies" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (assessment_id IN (
  SELECT assessments.id FROM assessments
  JOIN companies ON assessments.company_id = companies.id
  WHERE companies.user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();