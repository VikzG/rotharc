/*
  # Update profiles table RLS policies

  1. Changes
    - Enable RLS on profiles table if not already enabled
    - Add policy for users to create their own profile during registration
    - Add policy for users to update their own profile
  
  Note: Skipping duplicate policies that already exist
*/

-- Enable RLS (will be ignored if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own profile during registration
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);