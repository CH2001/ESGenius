-- Add established_year and employees fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN established_year integer,
ADD COLUMN employees integer;