
ALTER TABLE sign_in_options ADD COLUMN category text NOT NULL DEFAULT 'sign_in';

-- Backfill so all existing rows are treated as sign-in reasons
UPDATE sign_in_options SET category = 'sign_in' WHERE category IS NULL;

-- (Optional) Adjust RLS etc. if you start enforcing permissions later.
