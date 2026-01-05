import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const supabase = createClient(
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
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('user_books')
      .select('*, books(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ books: data });
  } catch (error) {
    console.error('Failed to fetch user books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const supabase = createClient(
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

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookId, status, currentPage, title, author, isbn, coverUrl, description, genres } = body;

    if (!bookId || !status) {
      return NextResponse.json(
        { error: 'Book ID and status are required' },
        { status: 400 }
      );
    }

    const bookWithData = {
      id: bookId,
      title: title || 'Unknown',
      author: author || 'Unknown',
      isbn: isbn || null,
      cover_url: coverUrl || null,
      description: description || null,
      genres: genres || [],
    };

    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookId)
      .single();

    if (!existingBook) {
      const { data: bookData, error: bookInsertError } = await supabase
        .from('books')
        .insert([bookWithData])
        .select()
        .single();

      if (bookInsertError) {
        console.error('Error inserting book:', bookInsertError);
        throw new Error(`Failed to create book: ${bookInsertError.message}`);
      }
    }

    const { data, error } = await supabase
      .from('user_books')
      .upsert(
        {
          user_id: user.id,
          book_id: bookId,
          status,
          current_page: currentPage || null,
          started_at: status === 'CURRENTLY_READING' ? new Date().toISOString() : null,
          completed_at: status === 'READ' ? new Date().toISOString() : null,
        },
        { onConflict: 'user_id,book_id' }
      )
      .select('*, books(*)')
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    return NextResponse.json({ book: data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Failed to add book:', errorMessage);
    return NextResponse.json(
      { error: `Failed to add book: ${errorMessage}` },
      { status: 500 }
    );
  }
}