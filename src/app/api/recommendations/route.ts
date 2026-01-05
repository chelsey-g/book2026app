import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { searchBooks } from '@/lib/data-sources/book-sources';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  try {
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const tempSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );
      
      const { data: { user } } = await tempSupabase.auth.getUser();
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ recommendations: [] });
    }
    
    const { data: userBooksData, error } = await supabase
      .from('user_books')
      .select('*, books(*)')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to fetch user books for recommendations');
    }

    const userBooks = userBooksData || [];
    const userReadBooks = userBooks.filter((book: any) => book.status === 'READ');
    
    if (userReadBooks.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }
    
    const allAuthors = userReadBooks.map((book: any) => book.books?.author || 'Unknown');
    const authorCounts = allAuthors.reduce((acc: any, author: string) => {
      acc[author] = (acc[author] || 0) + 1;
      return acc;
    }, {});
    
    const topAuthors = Object.entries(authorCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([author]) => author);
    
     const recommendedBooks: any[] = [];
    
    for (const author of topAuthors) {
      try {
        const books = await searchBooks(author, 3);
        recommendedBooks.push(...books);
      } catch (error) {
        console.error(`Error fetching books for author ${author}:`, error);
      }
    }
    
     const genreResults = await Promise.all(userReadBooks
        .filter((book: any) => book.books?.genres?.length > 0)
        .map(async (book: any) => {
          const primaryGenre = book.books?.genres?.[0];
          if (!primaryGenre) return [];
          
          try {
            const genreBooks = await searchBooks(primaryGenre, 3);
           return genreBooks.filter((b: any) => 
             b.author !== book.books?.author && 
             b.isbn !== book.books?.isbn &&
             !recommendedBooks.find((rb: any) => rb.isbn === b.isbn)
           ).slice(0, 2);
          } catch (error) {
            console.error(`Error fetching books for genre ${primaryGenre}:`, error);
            return [];
          }
         }));
     const genreBasedRecommendations = genreResults.flatMap(x => x).slice(0, 5);
    
     const allRecommendations = [
       ...recommendedBooks,
       ...genreBasedRecommendations
     ];
     
     const uniqueRecommendations = allRecommendations.filter((book, index, self) => 
       self.findIndex((b) => b.isbn === book.isbn) === index
     );

     const bookRecommendations = uniqueRecommendations.map((book: any) => ({
       ...book,
       type: 'personalized'
     }));

     return NextResponse.json({
       recommendations: bookRecommendations.slice(0, 12),
       count: bookRecommendations.length
     });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}