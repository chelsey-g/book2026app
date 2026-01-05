import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchBooks } from '@/lib/data-sources/book-sources';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = id;
    
    const { data: dbBook, error: dbError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (dbBook && !dbError) {
      return NextResponse.json({
        book: {
          id: dbBook.id,
          title: dbBook.title,
          author: dbBook.author,
          description: dbBook.description,
          coverUrl: dbBook.cover_url,
          isbn: dbBook.isbn,
          pageCount: dbBook.page_count,
          publishedDate: dbBook.published_date ? new Date(dbBook.published_date).getFullYear() : null,
          genres: dbBook.genres || [],
        }
      });
    }

    const { data: dbBookByIsbn } = await supabase
      .from('books')
      .select('*')
      .eq('isbn', bookId)
      .single();

    if (dbBookByIsbn) {
      return NextResponse.json({
        book: {
          id: dbBookByIsbn.id,
          title: dbBookByIsbn.title,
          author: dbBookByIsbn.author,
          description: dbBookByIsbn.description,
          coverUrl: dbBookByIsbn.cover_url,
          isbn: dbBookByIsbn.isbn,
          pageCount: dbBookByIsbn.page_count,
          publishedDate: dbBookByIsbn.published_date ? new Date(dbBookByIsbn.published_date).getFullYear() : null,
          genres: dbBookByIsbn.genres || [],
        }
      });
    }
    
    const books = await searchBooks(bookId);
    
    const book = books.find(
      (b: any) => b.isbn === bookId || 
           b.id === bookId || 
           b.title.toLowerCase().includes(bookId.toLowerCase())
    );

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Book lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    );
  }
}