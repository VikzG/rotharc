/*
  # Additional Profile Security Policies
  
  1. Changes
    - Add additional profile management policies
  
  2. Security
    - Users can only manage their own profile
    - Authenticated access required
*/

-- Create additional policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Profile Management Policy'
  ) THEN
    CREATE POLICY "Profile Management Policy" ON public.profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;