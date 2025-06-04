/*
  # Fix profiles table RLS policies

  1. Changes
    - Update RLS policies for profiles table to allow new user registration
    - Allow authenticated users to create their own profile
    - Ensure users can only access their own profile data
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for insert, select, and update operations
    - Restrict access to only authenticated users
*/

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own profile during registration
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);