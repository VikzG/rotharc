/*
  # Database Setup
  
  1. Tables
    - profiles
    - bookings
    - testimonials
    - admin_users
  
  2. Security
    - Enable RLS
    - Add policies for each table
    
  3. Initial Data
    - Add testimonials
    - Set up super admin
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  avatar_url text DEFAULT 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  booking_date timestamptz NOT NULL,
  booking_time text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  first_name text,
  last_name text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  installation_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  quote text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Testimonials policies
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT TO public USING (true);

-- Admin policies
CREATE POLICY "Only admins can view admin_users" ON admin_users FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- Initial data
INSERT INTO testimonials (name, title, quote, image_url) VALUES
  (
    'Sophia Smith',
    'Neurochirurgien',
    'L''amélioration neurale a complètement transformé ma façon de travailler. Je peux maintenant traiter des informations complexes en quelques secondes.',
    '/ellipse-5.png'
  ),
  (
    'Marcus Vega',
    'Agent de sécurité',
    'Grâce aux améliorations de vision nocturne, ma capacité à assurer la sécurité 24/7 a été décuplée. Un investissement qui en vaut vraiment la peine.',
    '/ellipse-5-1.png'
  ),
  (
    'Elena Chen',
    'Athlète professionnelle',
    'Le DermaShield a révolutionné ma pratique sportive. Je peux maintenant m''entraîner plus intensément sans craindre les blessures.',
    '/ellipse-5-3.png'
  ),
  (
    'Dr. James Wilson',
    'Chercheur en IA',
    'L''interface neurale NeuroLink Pro m''a permis de repousser les limites de la recherche scientifique. C''est un outil indispensable.',
    '/ellipse-5.png'
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Make specified user a super admin
INSERT INTO public.admin_users (id, is_super_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'snakesolid@gmail.fr'),
  true
)
ON CONFLICT (id) DO UPDATE
SET is_super_admin = true;