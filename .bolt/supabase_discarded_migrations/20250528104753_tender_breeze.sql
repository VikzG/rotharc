/*
  # Admin System Setup
  
  1. New Tables
    - admin_users: Stores admin user IDs
    
  2. Security
    - Enable RLS
    - Only admins can view admin_users table
    - Only super admins can manage other admins
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to view admin_users table
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = auth.uid()
  ));

-- Allow super admins to manage admin_users
CREATE POLICY "Super admins can manage admin_users" ON admin_users
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