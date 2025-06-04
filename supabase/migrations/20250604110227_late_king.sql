-- Drop existing policies
DROP POLICY IF EXISTS "Admin View Policy" ON admin_users;
DROP POLICY IF EXISTS "Admin Management Policy" ON admin_users;

-- Create new simplified policies
CREATE POLICY "Admin View Policy" 
ON admin_users FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid() 
    AND is_super_admin = true
  )
);

CREATE POLICY "Admin Management Policy" 
ON admin_users 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid() 
    AND is_super_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid() 
    AND is_super_admin = true
  )
);

-- Ensure the user is a super admin
INSERT INTO admin_users (id, is_super_admin)
SELECT id, true
FROM auth.users
WHERE email = 'snakesolid@gmail.fr'
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;