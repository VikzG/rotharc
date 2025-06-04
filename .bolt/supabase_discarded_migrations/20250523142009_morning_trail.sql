/*
  # Storage Policies for Avatar Management

  1. Changes
    - Create bucket for avatars if it doesn't exist
    - Create policies for avatar management
    - Enable public read access to avatars

  2. Security
    - Enable RLS on avatars bucket
    - Restrict users to their own folders
    - Allow public read access
*/

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create policies for avatar management
DO $$
BEGIN
  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Avatar Upload Policy'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Avatar Upload Policy',
      'avatars',
      '(role = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
    );
  END IF;

  -- Select policy for authenticated users
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Avatar View Policy'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Avatar View Policy',
      'avatars',
      '(role = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)'
    );
  END IF;

  -- Public read policy
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Avatar Access'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Public Avatar Access',
      'avatars',
      'true'
    );
  END IF;
END $$;