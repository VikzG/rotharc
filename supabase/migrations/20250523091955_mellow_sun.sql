/*
  # Add avatar URL to profiles table

  1. Changes
    - Add avatar_url column to profiles table with default placeholder image
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url text 
DEFAULT 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100';