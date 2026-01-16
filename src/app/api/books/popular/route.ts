import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchBooks } from '@/lib/data-sources/book-sources';

// Curated search queries with various genres for variety (focus on current year)
const GENRE_QUERIES = [
  'fiction 2025',
  'thriller 2025',
  'science fiction 2025',
  'fantasy 2025',
  'mystery 2025',
  'romance 2025',
  'historical fiction 2025',
  'horror 2025',
  'contemporary fiction 2025',
  'literary fiction 2025',
  'biography 2025',
  'memoir 2025',
];

// Randomly select genres for variety, adding current years
function getRandomGenreQueries(count: number): string[] {
  const shuffled = [...GENRE_QUERIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get('limit') || '20');
  const genre = searchParams.get('genre');
  const timeframe = searchParams.get('timeframe') || 'all';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    let dateFilter = '';
    const now = new Date();

    if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = `and created_at > '${weekAgo}'`;
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = `and created_at > '${monthAgo}'`;
    }

    const { data: books, error } = await supabase
      .from('books')
      .select(`
        *,
        reviews:reviews(count),
        user_books:user_books(count)
      `)
      .gt('view_count', 0)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const booksWithScores = (books || []).map((book: any) => {
      const reviewCount = book.reviews?.[0]?.count || 0;
      const userCount = book.user_books?.[0]?.count || 0;
      const viewCount = book.view_count || 0;

      const trendingScore = (viewCount * 0.3) + (reviewCount * 0.4) + (userCount * 0.3);

      return {
        ...book,
        trendingScore,
        reviewCount,
        userCount,
      };
    }).sort((a: any, b: any) => b.trendingScore - a.trendingScore);

    // If database has trending books, return them
    if (booksWithScores.length > 0) {
      return NextResponse.json({ books: booksWithScores, genres: [] });
    }

    // Fallback: Use random genre searches for popular books
    const { books: fallbackBooks, genres } = await fetchPopularBooksFallback(limit, genre);
    return NextResponse.json({ books: fallbackBooks, genres });

  } catch (error) {
    console.error('Popular books error:', error);
    try {
      const { books: fallbackBooks, genres } = await fetchPopularBooksFallback(limit, genre);
      return NextResponse.json({ books: fallbackBooks, genres });
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to fetch trending books' },
        { status: 500 }
      );
    }
  }
}

async function fetchPopularBooksFallback(limit: number, genre?: string | null) {
  const allBooks: any[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const currentYear = now.getFullYear();
  const lastYear = oneYearAgo.getFullYear();

  // If specific genre requested, prioritize it
  if (genre) {
    // Fetch more to account for filtering
    const genreBooks = await searchBooks(`${genre}`, Math.ceil(limit));
    allBooks.push(...genreBooks);
  }

  // Fetch from multiple random genre queries to get variety
  const queryCount = genre ? 2 : 3;
  const queriesToUse = getRandomGenreQueries(queryCount);
  // Fetch more books per query to account for date filtering
  const booksPerQuery = Math.ceil(limit / queriesToUse.length) + 5;

  // Extract genre names from queries (remove year)
  const selectedGenres = queriesToUse.map(q => q.replace(/\s+\d{4}$/, '').trim());

  for (const query of queriesToUse) {
    try {
      const books = await searchBooks(query, booksPerQuery);
      allBooks.push(...books);
    } catch (error) {
      console.error(`Error fetching books for query "${query}":`, error);
    }
  }

  // Filter for books published in the last 365 days (current year or last year)
  const recentBooks = allBooks.filter((book) => {
    if (!book.publishedDate) return false;

    // Handle various date formats (year only, full date, etc.)
    const yearMatch = String(book.publishedDate).match(/\d{4}/);
    if (!yearMatch) return false;

    const publishYear = parseInt(yearMatch[0]);
    // Only accept books from current year or last year (approximately last 365 days)
    return publishYear === currentYear || publishYear === lastYear;
  });

  // Remove duplicates based on ISBN (for books that have ISBNs)
  const seenISBNs = new Set<string>();
  const uniqueBooks = recentBooks.filter((book) => {
    if (!book.isbn) {
      // Keep books without ISBNs
      return true;
    }
    if (seenISBNs.has(book.isbn)) {
      // Skip duplicate ISBNs
      return false;
    }
    seenISBNs.add(book.isbn);
    return true;
  });

  return {
    books: uniqueBooks.slice(0, limit),
    genres: selectedGenres
  };
}