/*
  # Admin Users Setup

  1. New Tables
    - `admin_users` table for tracking admin permissions
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for admin access
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to view admin_users table
CREATE POLICY "Only admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

-- Allow admins to manage admin_users
CREATE POLICY "Admins can manage admin_users" ON public.admin_users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  ));

-- Make specified user an admin
INSERT INTO public.admin_users (id)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'snakesolid@gmail.fr')
)
ON CONFLICT (id) DO NOTHING;