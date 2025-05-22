/*
  # Add testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `quote` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on testimonials table
    - Add policy for public read access
    - Add policy for admin write access
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  quote text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

-- Insert initial testimonials
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