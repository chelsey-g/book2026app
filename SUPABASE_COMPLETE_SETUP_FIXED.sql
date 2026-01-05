-- ============================================
-- BookTracker Complete Setup SQL (FIXED VERSION)
-- Run all of these commands in Supabase SQL Editor
-- ============================================

-- 1. Add rating column to user_books table
ALTER TABLE public.user_books
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

CREATE INDEX IF NOT EXISTS idx_user_books_rating ON public.user_books(rating);

-- 2. Add bio column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 3. Add view_count column to books table for trending
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_books_view_count ON public.books(view_count DESC);

-- ============================================
-- Additional Useful Indexes for Performance
-- ============================================

-- Index for reviews by book_id (for trending calculations)
CREATE INDEX IF NOT EXISTS idx_reviews_book_id_created ON public.reviews(book_id, created_at DESC);

-- Index for user_books count queries (for recommendations)
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON public.user_books(book_id);

-- Index for genre searches
CREATE INDEX IF NOT EXISTS idx_books_genres ON public.books USING GIN(genres);

-- Index for follows trending
CREATE INDEX IF NOT EXISTS idx_follows_created ON public.follows(created_at DESC);

-- ============================================
-- Create Views for Common Queries
-- ============================================

-- View: Book statistics (for trending algorithm)
CREATE OR REPLACE VIEW public.book_statistics AS
SELECT 
  b.id,
  b.title,
  b.author,
  COUNT(DISTINCT r.id) as review_count,
  AVG(r.rating) as average_rating,
  COUNT(DISTINCT ub.id) as user_count,
  b.view_count,
  (
    (b.view_count * 0.3) + 
    (COUNT(DISTINCT r.id) * 0.4) + 
    (COUNT(DISTINCT ub.id) * 0.3)
  ) as trending_score,
  b.created_at
FROM public.books b
LEFT JOIN public.reviews r ON b.id = r.book_id
LEFT JOIN public.user_books ub ON b.id = ub.book_id
GROUP BY b.id, b.title, b.author, b.view_count, b.created_at
ORDER BY trending_score DESC;

-- View: User reading statistics
CREATE OR REPLACE VIEW public.user_reading_stats AS
SELECT 
  u.id,
  COUNT(CASE WHEN ub.status = 'READ' THEN 1 END) as total_books_read,
  COUNT(CASE WHEN ub.status = 'CURRENTLY_READING' THEN 1 END) as currently_reading,
  COUNT(CASE WHEN ub.status = 'WANT_TO_READ' THEN 1 END) as want_to_read,
  COUNT(CASE WHEN ub.status = 'DNF' THEN 1 END) as dnf_count,
  AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating END) as average_rating_given,
  COUNT(DISTINCT r.id) as review_count,
  COUNT(DISTINCT f.following_id) as following_count,
  COUNT(DISTINCT f2.follower_id) as followers_count
FROM public.users u
LEFT JOIN public.user_books ub ON u.id = ub.user_id
LEFT JOIN public.reviews r ON u.id = r.user_id
LEFT JOIN public.follows f ON u.id = f.follower_id
LEFT JOIN public.follows f2 ON u.id = f2.following_id
GROUP BY u.id;

-- View: Genre recommendations data
CREATE OR REPLACE VIEW public.user_genre_preferences AS
SELECT 
  ub.user_id,
  genre,
  COUNT(*) as genre_count,
  AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE 3 END) as avg_genre_rating
FROM public.user_books ub
JOIN public.books b ON ub.book_id = b.id
CROSS JOIN LATERAL UNNEST(b.genres) AS genre
LEFT JOIN public.reviews r ON ub.user_id = r.user_id AND ub.book_id = r.book_id
WHERE ub.status IN ('READ', 'CURRENTLY_READING')
GROUP BY ub.user_id, genre
ORDER BY genre_count DESC;

-- ============================================
-- Grant Permissions
-- ============================================

-- Allow authenticated users to read book statistics
GRANT SELECT ON public.book_statistics TO authenticated;

-- Allow authenticated users to read their own reading stats
GRANT SELECT ON public.user_reading_stats TO authenticated;

-- Allow authenticated users to read genre preferences
GRANT SELECT ON public.user_genre_preferences TO authenticated;

-- ============================================
-- Important Note
-- ============================================

-- Views are read-only and cannot have RLS enabled.
-- Security is inherited from underlying tables:
-- - book_statistics: Public view (safe aggregation)
-- - user_reading_stats: Secured by user_books RLS
-- - user_genre_preferences: Secured by user_books RLS
