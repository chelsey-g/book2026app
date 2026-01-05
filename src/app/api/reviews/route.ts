import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return NextResponse.json(
      { error: 'Book ID is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, name, username, image)
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: data });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { bookId, rating, content } = body;

    if (!bookId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Book ID and valid rating (1-5) are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        user_id: user.id,
        book_id: bookId,
        rating,
        content: content || null,
      })
      .select(`
        *,
        user:users(id, name, username, image)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ review: data });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}