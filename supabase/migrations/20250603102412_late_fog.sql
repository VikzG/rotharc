/*
  # Add is_super_admin column to admin_users table

  1. Changes
    - Add `is_super_admin` column to `admin_users` table
      - Boolean type
      - Default value: false
      - Not nullable

  2. Security
    - Maintain existing RLS policies
*/

-- Add is_super_admin column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE admin_users 
    ADD COLUMN is_super_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;