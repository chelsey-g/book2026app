-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  description TEXT,
  cover_url TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  page_count INTEGER,
  genres TEXT[] DEFAULT ARRAY[]::TEXT[],
  goodreads_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_books table (tracks user's reading status)
CREATE TABLE IF NOT EXISTS public.user_books (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'WANT_TO_READ' CHECK (status IN ('WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'DNF')),
  current_page INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create reading_lists table
CREATE TABLE IF NOT EXISTS public.reading_lists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading_list_books table
CREATE TABLE IF NOT EXISTS public.reading_list_books (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reading_list_id TEXT NOT NULL REFERENCES public.reading_lists(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(reading_list_id, book_id)
);

-- Create follows table (for friend relationships)
CREATE TABLE IF NOT EXISTS public.follows (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON public.user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON public.user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON public.reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_lists_user_id ON public.reading_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_list_books_reading_list_id ON public.reading_list_books(reading_list_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_list_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for books (public read)
CREATE POLICY "Books are publicly readable" ON public.books
  FOR SELECT USING (true);

-- RLS Policies for user_books (private to user)
CREATE POLICY "Users can view their own books" ON public.user_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books" ON public.user_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" ON public.user_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" ON public.user_books
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Reviews are publicly readable" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reading_lists
CREATE POLICY "Users can view their own reading lists" ON public.reading_lists
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own reading lists" ON public.reading_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading lists" ON public.reading_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading lists" ON public.reading_lists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reading_list_books
CREATE POLICY "Reading list books inherit list permissions" ON public.reading_list_books
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.reading_lists
      WHERE reading_lists.id = reading_list_books.reading_list_id
      AND (reading_lists.user_id = auth.uid() OR reading_lists.is_public = true)
    )
  );

-- RLS Policies for follows
CREATE POLICY "Users can view follows" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow/unfollow" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can remove their own follows" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);
