ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_books_view_count ON public.books(view_count DESC);
