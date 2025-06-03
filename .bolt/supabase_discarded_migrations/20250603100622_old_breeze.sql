/*
  # Add super admin column and update admin user
  
  1. Changes
    - Add is_super_admin column to admin_users table if it doesn't exist
    - Update specified admin user to be super admin
    
  2. Security
    - Only super admins can manage other admins
*/

-- Add is_super_admin column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- Update specified user to be super admin
UPDATE admin_users 
SET is_super_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'snakesolid@gmail.fr');