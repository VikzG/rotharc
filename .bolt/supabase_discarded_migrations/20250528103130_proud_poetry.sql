/*
  # Storage Bucket Policies for Avatar Management
  
  This migration adds policies to manage avatar storage access:
  
  1. Creates a new storage bucket for avatars
  2. Sets up RLS policies for:
    - Upload: Users can upload to their own folder
    - Read: Users can view their own files
    - Update: Users can update their own files  
    - Delete: Users can delete their own files
    - Public: Anyone can view avatars
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

-- Create storage policies
DO $$
BEGIN
  -- Upload policy
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Avatar Upload Policy'
  ) THEN
    INSERT INTO storage.policies (name, definition)
    VALUES (
      'Avatar Upload Policy',
      '(bucket_id = ''avatars'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
    );
  END IF;

  -- Read policy  
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies
    WHERE name = 'Avatar Read Policy'
  ) THEN
    INSERT INTO storage.policies (name, definition) 
    VALUES (
      'Avatar Read Policy',
      '(bucket_id = ''avatars'')'
    );
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies
    WHERE name = 'Avatar Update Policy'  
  ) THEN
    INSERT INTO storage.policies (name, definition)
    VALUES (
      'Avatar Update Policy',
      '(bucket_id = ''avatars'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
    );
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies
    WHERE name = 'Avatar Delete Policy'
  ) THEN
    INSERT INTO storage.policies (name, definition)
    VALUES (
      'Avatar Delete Policy', 
      '(bucket_id = ''avatars'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
    );
  END IF;

END $$;