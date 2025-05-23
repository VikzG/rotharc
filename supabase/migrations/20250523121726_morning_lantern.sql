/*
  # Add Storage Policies for Avatar Uploads

  1. Changes
    - Add storage policies to allow authenticated users to upload and read their own avatars
    
  2. Security
    - Enable row level security for storage.objects
    - Add policies for authenticated users to:
      - Upload files to their own user directory
      - Read their own files
      - Update their own files
      - Delete their own files
*/

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to upload files to their own directory
CREATE POLICY "Users can upload avatars to their own folder" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow users to read their own files
CREATE POLICY "Users can view their own avatars" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy to allow public read access to all avatar files
CREATE POLICY "Give public access to avatars" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');