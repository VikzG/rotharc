/*
  # Storage configuration for avatar uploads

  1. Changes
    - Create avatars storage bucket
    - Configure bucket settings (size limits, mime types)
    - Set up RLS policies for avatar management
    
  2. Security
    - Enable row level security
    - Add policies for upload, read, update, and delete operations
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = false,
    avif_autodetection = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE id = 'avatars';

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for avatar management
CREATE POLICY "Avatar Upload Policy" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar Read Policy" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar Update Policy" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar Delete Policy" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);