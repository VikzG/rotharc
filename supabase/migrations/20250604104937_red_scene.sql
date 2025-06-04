/*
  # Add products table and initial data
  
  1. New Tables
    - products: Store product information
      - id (text, primary key)
      - name (text)
      - category (text)
      - sub_category (text) 
      - price (numeric)
      - description (text)
      - short_description (text)
      - image_url (text)
      - rating (numeric)
      - review_count (integer)
      - features (text[])
      - compatibility (text[])
      - is_new (boolean)
      - is_featured (boolean)
      
  2. Security
    - Enable RLS
    - Add policy for public read access
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  sub_category text NOT NULL,
  price numeric NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  image_url text NOT NULL,
  rating numeric NOT NULL,
  review_count integer NOT NULL,
  features text[] NOT NULL,
  compatibility text[] NOT NULL,
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT TO public USING (true);

-- Insert initial data
INSERT INTO products (
  id, name, category, sub_category, price, description, short_description,
  image_url, rating, review_count, features, compatibility, is_new, is_featured
) VALUES
  (
    'neuro-link-pro',
    'NeuroLink Pro',
    'Neural',
    'Interface',
    4999,
    'Le NeuroLink Pro est notre interface neurale de pointe, permettant une connexion directe entre votre cerveau et les systèmes numériques. Avec une bande passante de 10 Tbps et une latence inférieure à 0,5 ms, cette amélioration vous permet de naviguer dans les données, de contrôler des appareils et d''accéder à l''information à la vitesse de la pensée. L''installation est minimalement invasive et réalisée par nos chirurgiens certifiés.',
    'Interface neurale haute performance pour une connexion directe cerveau-machine.',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.8,
    124,
    ARRAY['Connexion neurale directe', 'Bande passante de 10 Tbps', 'Latence inférieure à 0,5 ms', 'Filtres de confidentialité intégrés', 'Mise à jour sans fil', 'Garantie à vie'],
    ARRAY['Tous systèmes d''exploitation', 'Réalité augmentée', 'Réalité virtuelle'],
    true,
    true
  ),
  (
    'ocular-x2',
    'Ocular X2',
    'Sensoriel',
    'Vision',
    3499,
    'Les implants Ocular X2 remplacent ou augmentent vos yeux naturels avec une technologie de pointe offrant une vision 20 fois supérieure à la normale. Capables de voir dans le spectre infrarouge et ultraviolet, avec zoom optique 50x et enregistrement vidéo 16K. L''interface utilisateur intégrée vous permet de contrôler les paramètres visuels par simple pensée.',
    'Implants oculaires avancés avec vision améliorée et fonctionnalités étendues.',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.9,
    208,
    ARRAY['Vision 20x supérieure', 'Spectre infrarouge et ultraviolet', 'Zoom optique 50x', 'Enregistrement vidéo 16K', 'Interface de contrôle neural', 'Résistant à l''eau et aux chocs'],
    ARRAY['NeuroLink Pro', 'Systèmes de réalité augmentée'],
    false,
    true
  ),
  (
    'derma-shield',
    'DermaShield',
    'Défense',
    'Peau',
    2899,
    'DermaShield est un remplacement dermique avancé qui renforce votre peau naturelle avec une couche de nano-fibres de carbone et de polymères réactifs. Offrant une résistance accrue aux coupures, brûlures et impacts, tout en conservant la sensation tactile naturelle. La version premium inclut une régulation thermique active et une capacité d''auto-réparation pour les dommages mineurs.',
    'Remplacement dermique offrant protection et résistance tout en préservant le toucher naturel.',
    'https://images.unsplash.com/photo-1575408264798-b50b252663e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.6,
    87,
    ARRAY['Résistance aux coupures et impacts', 'Protection contre les brûlures', 'Sensation tactile préservée', 'Régulation thermique', 'Auto-réparation des dommages mineurs', 'Personnalisation esthétique disponible'],
    ARRAY['Tous types corporels', 'Compatible avec autres améliorations'],
    false,
    false
  ),
  (
    'reflex-boost',
    'Reflex Boost',
    'Performance',
    'Réflexes',
    5999,
    'Reflex Boost est notre amélioration neuromusculaire phare, augmentant vos temps de réaction jusqu''à 300%. Cette modification reconfigure les connexions entre votre système nerveux et vos muscles, permettant des mouvements plus rapides et plus précis que jamais. Idéal pour les athlètes, les forces de sécurité ou toute personne souhaitant des capacités physiques surhumaines.',
    'Amélioration neuromusculaire réduisant drastiquement votre temps de réaction.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.7,
    156,
    ARRAY['Temps de réaction réduit de 300%', 'Précision de mouvement accrue', 'Modes d''activation personnalisables', 'Système anti-fatigue intégré', 'Compatibilité avec implants musculaires', 'Garantie de performance'],
    ARRAY['NeuroLink Pro', 'Implants musculaires', 'Systèmes d''endurance'],
    true,
    true
  ),
  (
    'memory-matrix',
    'Memory Matrix',
    'Cognitif',
    'Mémoire',
    7999,
    'Memory Matrix est une amélioration cognitive révolutionnaire qui étend votre capacité mémorielle de façon exponentielle. Grâce à un réseau de nano-processeurs neuraux, vous pouvez stocker, organiser et récupérer des informations avec une précision parfaite. Idéal pour les professionnels, chercheurs ou étudiants, cet implant vous permet également de sauvegarder vos souvenirs et de les revivre avec une clarté cristalline.',
    'Extension mémorielle permettant un stockage et une récupération parfaite des informations.',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.9,
    92,
    ARRAY['Capacité mémorielle quasi-illimitée', 'Récupération instantanée des informations', 'Organisation automatique des souvenirs', 'Sauvegarde sécurisée des données', 'Partage de mémoire (avec consentement)', 'Protection contre la dégénérescence neurale'],
    ARRAY['NeuroLink Pro', 'Systèmes cognitifs avancés'],
    true,
    true
  ),
  (
    'cardio-prime',
    'Cardio Prime',
    'Organique',
    'Cardiovasculaire',
    8999,
    'Cardio Prime est un remplacement cardiaque synthétique de dernière génération, offrant des performances supérieures au cœur humain naturel. Fabriqué à partir de tissus cultivés et de composants synthétiques, ce cœur amélioré pompe le sang plus efficacement, régule automatiquement son rythme selon vos besoins et résiste aux maladies cardiovasculaires. Sa durée de vie estimée dépasse 150 ans avec un entretien minimal.',
    'Cœur synthétique avancé offrant performances supérieures et longévité exceptionnelle.',
    'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    4.6,
    64,
    ARRAY['Efficacité de pompage 200%', 'Auto-régulation selon l''activité', 'Résistance aux maladies cardiovasculaires', 'Monitoring continu de la santé', 'Durée de vie estimée: 150+ ans', 'Maintenance minimale requise'],
    ARRAY['Systèmes sanguins améliorés', 'Implants pulmonaires'],
    false,
    false
  );