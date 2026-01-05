-- Add rating column to user_books table for storing user's personal rating of a book
ALTER TABLE public.user_books
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Create index on rating for faster queries
CREATE INDEX IF NOT EXISTS idx_user_books_rating ON public.user_books(rating);
