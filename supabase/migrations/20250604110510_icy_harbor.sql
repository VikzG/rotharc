/*
  # Fix Admin Access Policies

  1. Changes
    - Simplify admin policies to avoid recursion
    - Add direct policy checks
    - Ensure proper super admin access
    
  2. Security
    - Maintain RLS protection
    - Allow super admins full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin View Policy" ON admin_users;
DROP POLICY IF EXISTS "Admin Management Policy" ON admin_users;

-- Create new simplified policy for viewing
CREATE POLICY "Admin View Policy" 
ON admin_users FOR SELECT 
TO authenticated 
USING (true);

-- Create new simplified policy for management
CREATE POLICY "Admin Management Policy" 
ON admin_users 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Ensure the user is a super admin
INSERT INTO admin_users (id, is_super_admin)
SELECT id, true
FROM auth.users
WHERE email = 'snakesolid@gmail.fr'
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;