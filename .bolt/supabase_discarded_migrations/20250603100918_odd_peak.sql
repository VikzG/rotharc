/*
  # Fix Admin Permissions
  
  1. Changes
    - Drop existing admin_users table if it exists
    - Recreate admin_users table with proper permissions
    - Add super admin user
    
  2. Security
    - Enable RLS
    - Add proper policies for admin access
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create admin_users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users
CREATE POLICY "Only admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = auth.uid()
  ));

-- Only super admins can manage admin_users
CREATE POLICY "Super admins can manage admin_users" ON public.admin_users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_super_admin = true
  ));

-- Make specified user a super admin
INSERT INTO public.admin_users (id, is_super_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'snakesolid@gmail.fr'),
  true
)
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;