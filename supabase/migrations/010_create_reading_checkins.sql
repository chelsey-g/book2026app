-- Create reading_checkins table for daily reading session logging
CREATE TABLE IF NOT EXISTS public.reading_checkins (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  pages_read INTEGER NOT NULL CHECK (pages_read > 0),
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT CHECK (mood IN ('excited', 'thoughtful', 'sad', 'confused', 'inspired', 'bored')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, checkin_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_checkins_user_id ON public.reading_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_checkins_book_id ON public.reading_checkins(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_checkins_user_date ON public.reading_checkins(user_id, checkin_date);

-- Enable RLS
ALTER TABLE public.reading_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own checkins" ON public.reading_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins" ON public.reading_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" ON public.reading_checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins" ON public.reading_checkins
  FOR DELETE USING (auth.uid() = user_id);
