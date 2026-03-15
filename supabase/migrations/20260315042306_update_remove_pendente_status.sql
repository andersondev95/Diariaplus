/*
  # Update diarias table to remove 'Pendente' status

  1. Changes
    - Remove 'Pendente' from the check constraint
    - Keep only 'Pago' and 'A Receber' statuses
    - Update any existing 'Pendente' entries to 'A Receber'

  2. Status Values
    - 'Pago' - Payment completed
    - 'A Receber' - Awaiting payment
*/

DO $$
BEGIN
  UPDATE diarias SET situacao = 'A Receber' WHERE situacao = 'Pendente';
  
  ALTER TABLE diarias 
    DROP CONSTRAINT IF EXISTS diarias_situacao_check;
  
  ALTER TABLE diarias
    ADD CONSTRAINT diarias_situacao_check 
    CHECK (situacao IN ('Pago', 'A Receber'));
END $$;
