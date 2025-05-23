/*
  # Fix Avatar Upload Functionality

  1. Changes
    - Enable RLS on storage.objects table
    - Create avatars bucket if it doesn't exist
    - Add proper storage policies for avatar management
    - Fix profile policies

  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users to manage their avatars
    - Allow public read access to avatars
*/

-- Enable RLS on storage.objects if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DO $$
BEGIN
  -- Allow authenticated users to upload avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar Upload Policy v2'
  ) THEN
    CREATE POLICY "Avatar Upload Policy v2" ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  -- Allow authenticated users to view their own avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar View Policy v2'
  ) THEN
    CREATE POLICY "Avatar View Policy v2" ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  -- Allow authenticated users to update their own avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar Update Policy v2'
  ) THEN
    CREATE POLICY "Avatar Update Policy v2" ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  -- Allow authenticated users to delete their own avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar Delete Policy v2'
  ) THEN
    CREATE POLICY "Avatar Delete Policy v2" ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  -- Allow public read access to all avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Avatar Access v2'
  ) THEN
    CREATE POLICY "Public Avatar Access v2" ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'avatars');
  END IF;
END $$;