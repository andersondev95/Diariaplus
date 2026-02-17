/*
  # Create diarias (daily work entries) table

  1. New Tables
    - `diarias`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `empresa` (text) - Company name
      - `valor` (numeric) - Payment amount in BRL
      - `data` (date) - Date of the daily work
      - `situacao` (text) - Payment status (Pago, Pendente, A Receber)
      - `comprovante_url` (text, nullable) - URL to receipt/proof file
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `diarias` table
    - Add policy for authenticated users to manage their own entries
    - For demo purposes, allowing public access (can be restricted to auth later)

  3. Storage
    - Create storage bucket for receipts/proofs
    - Configure public access for uploaded files
*/

CREATE TABLE IF NOT EXISTS diarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa text NOT NULL,
  valor numeric NOT NULL,
  data date NOT NULL,
  situacao text NOT NULL CHECK (situacao IN ('Pago', 'Pendente', 'A Receber')),
  comprovante_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE diarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON diarias FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON diarias FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON diarias FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON diarias FOR DELETE
  TO public
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('comprovantes', 'comprovantes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'comprovantes');

CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'comprovantes');

CREATE POLICY "Allow public delete"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'comprovantes');