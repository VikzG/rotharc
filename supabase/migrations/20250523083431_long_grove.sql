/*
  # Add booking details fields

  1. Changes
    - Add new columns to bookings table:
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `postal_code` (text)
      - `installation_notes` (text)

  2. Security
    - Existing RLS policies will cover the new fields
*/

-- Add new columns to bookings table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN first_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'email'
  ) THEN
    ALTER TABLE bookings ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'address'
  ) THEN
    ALTER TABLE bookings ADD COLUMN address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'city'
  ) THEN
    ALTER TABLE bookings ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'installation_notes'
  ) THEN
    ALTER TABLE bookings ADD COLUMN installation_notes text;
  END IF;
END $$;