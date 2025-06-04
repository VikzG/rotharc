/*
  # Fix Admin Access Policies

  1. Changes
    - Drop and recreate admin policies with correct conditions
    - Update super admin status for specified user
    
  2. Security
    - Ensure proper RLS policies for admin access
    - Grant appropriate permissions to super admins
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can manage admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin Management Policy" ON admin_users;

-- Create new policies with correct conditions
CREATE POLICY "Admin View Policy" 
ON admin_users FOR SELECT 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id 
    FROM admin_users 
    WHERE is_super_admin = true
  )
);

CREATE POLICY "Admin Management Policy" 
ON admin_users 
FOR ALL 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id 
    FROM admin_users 
    WHERE is_super_admin = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id 
    FROM admin_users 
    WHERE is_super_admin = true
  )
);

-- Ensure the user is a super admin
DO $$
BEGIN
  -- First, make sure the user exists in auth.users
  IF EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = 'snakesolid@gmail.fr'
  ) THEN
    -- Then insert or update the admin_users record
    INSERT INTO admin_users (id, is_super_admin)
    SELECT id, true
    FROM auth.users
    WHERE email = 'snakesolid@gmail.fr'
    ON CONFLICT (id) DO UPDATE
    SET 
      is_super_admin = true,
      updated_at = now();
  END IF;
END
$$;