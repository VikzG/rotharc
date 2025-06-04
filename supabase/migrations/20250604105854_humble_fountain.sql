/*
  # Fix Admin Access

  1. Changes
    - Ensure admin_users table exists with correct structure
    - Set super admin privileges for snakesolid@gmail.fr
    - Add necessary RLS policies
*/

-- Make sure admin_users table exists with correct structure
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can manage admin_users" ON admin_users;

-- Create new policies
CREATE POLICY "Only admins can view admin_users" 
ON admin_users FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 
  FROM admin_users au 
  WHERE au.id = auth.uid() AND au.is_super_admin = true
));

CREATE POLICY "Only super admins can manage admin_users" 
ON admin_users 
FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 
  FROM admin_users au 
  WHERE au.id = auth.uid() AND au.is_super_admin = true
));

-- Ensure the user is a super admin
INSERT INTO admin_users (id, is_super_admin)
SELECT id, true
FROM auth.users
WHERE email = 'snakesolid@gmail.fr'
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;