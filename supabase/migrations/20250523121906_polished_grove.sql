/*
  # Storage policies for avatar uploads

  1. Changes
    - Create storage bucket for avatars
    - Add policies for authenticated users to manage their avatars
    - Add public read access policy for avatars

  2. Security
    - Enable RLS on storage bucket
    - Restrict users to their own folders
    - Allow public read access
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
BEGIN;
  -- Policy to allow authenticated users to upload to their own folder
  CREATE POLICY "Users can upload avatars to their own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy to allow authenticated users to update their own files
  CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy to allow authenticated users to delete their own files
  CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

  -- Policy to allow public read access to all avatars
  CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');
COMMIT;