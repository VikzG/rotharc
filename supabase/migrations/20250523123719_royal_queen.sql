/*
  # Update profiles table policies

  1. Changes
    - Enable RLS on profiles table (if not already enabled)
    - Add policy for users to create their own profile during registration

  2. Security
    - Ensures users can only create their own profile
    - Uses auth.uid() to verify user identity
*/

-- Enable RLS (will be ignored if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own profile during registration
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);