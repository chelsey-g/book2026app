-- Add search_history_enabled preference to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS search_history_enabled BOOLEAN DEFAULT true;
