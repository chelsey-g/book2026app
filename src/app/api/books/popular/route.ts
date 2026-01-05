import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchBooks } from '@/lib/data-sources/book-sources';

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

    return NextResponse.json({ books: booksWithScores });
  } catch (error) {
    console.error('Popular books error:', error);
    try {
      let query = 'popular';
      if (genre) {
        query += ` ${genre}`;
      }
      
      const fallbackBooks = await searchBooks(query, limit);
      return NextResponse.json({ books: fallbackBooks });
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to fetch trending books' },
        { status: 500 }
      );
    }
  }
}