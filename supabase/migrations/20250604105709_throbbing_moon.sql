/*
  # Add Super Admin User
  
  1. Changes
    - Make snakesolid@gmail.fr a super admin
    
  2. Security
    - Maintains existing RLS policies
*/

-- Make specified user a super admin
INSERT INTO public.admin_users (id, is_super_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'snakesolid@gmail.fr'),
  true
)
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;