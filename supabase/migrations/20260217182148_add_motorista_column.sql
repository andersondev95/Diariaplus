/*
  # Add motorista (driver) column to diarias table

  1. Changes
    - Add `motorista` column (optional) to store driver name
    - Column is nullable to maintain backward compatibility

  2. Notes
    - This column is optional and non-breaking
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'diarias' AND column_name = 'motorista'
  ) THEN
    ALTER TABLE diarias ADD COLUMN motorista text;
  END IF;
END $$;