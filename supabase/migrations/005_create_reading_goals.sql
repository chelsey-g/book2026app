CREATE TABLE IF NOT EXISTS public.reading_goals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  goal_count INTEGER NOT NULL CHECK (goal_count > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reading_goals_user_id ON public.reading_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_goals_year ON public.reading_goals(year);

-- Enable RLS (Row Level Security)
ALTER TABLE public.reading_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_goals
CREATE POLICY "Users can view their own reading goals" ON public.reading_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading goals" ON public.reading_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading goals" ON public.reading_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading goals" ON public.reading_goals
  FOR DELETE USING (auth.uid() = user_id);
