/*
  # Fix Admin Access

  1. Changes
    - Add is_super_admin column to admin_users table if it doesn't exist
    - Update specified admin user to have super admin privileges
    - Update policies to check for super admin status
    
  2. Security
    - Only super admins can access admin features
    - Regular admins have limited access
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
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'snakesolid@gmail.fr'
);

-- Update policies to check for super admin status
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;

CREATE POLICY "Only super admins can view admin_users" 
ON admin_users FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true
  )
);

CREATE POLICY "Only super admins can manage admin_users" 
ON admin_users FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true
  )
);