import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const VALID_MOODS = ['excited', 'thoughtful', 'sad', 'confused', 'inspired', 'bored'];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const bookId = searchParams.get('bookId');

    let query = supabase
      .from('reading_checkins')
      .select('*, books(id, title, author, cover_url)')
      .eq('user_id', user.id)
      .order('checkin_date', { ascending: false })
      .limit(limit);

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data: checkins, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ checkins: checkins || [] });
  } catch (error) {
    console.error('Checkins GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, pagesRead, checkinDate, mood } = await request.json();

    // Validation
    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 });
    }
    if (!pagesRead || pagesRead < 1) {
      return NextResponse.json({ error: 'pagesRead must be at least 1' }, { status: 400 });
    }
    if (mood && !VALID_MOODS.includes(mood)) {
      return NextResponse.json({ error: 'Invalid mood value' }, { status: 400 });
    }

    const dateToUse = checkinDate || new Date().toISOString().split('T')[0];

    // Check if book exists in user_books with CURRENTLY_READING status
    const { data: userBook } = await supabase
      .from('user_books')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .single();

    // Auto-add to Currently Reading if not already there
    if (!userBook) {
      // Insert new user_book with CURRENTLY_READING status
      const { error: insertError } = await supabase
        .from('user_books')
        .insert({
          user_id: user.id,
          book_id: bookId,
          status: 'CURRENTLY_READING',
          started_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error adding book to library:', insertError);
        return NextResponse.json(
          { error: 'Failed to add book to your library' },
          { status: 500 }
        );
      }
    } else if (userBook.status !== 'CURRENTLY_READING') {
      // Update status to CURRENTLY_READING
      const { error: updateError } = await supabase
        .from('user_books')
        .update({
          status: 'CURRENTLY_READING',
          started_at: new Date().toISOString(),
        })
        .eq('id', userBook.id);

      if (updateError) {
        console.error('Error updating book status:', updateError);
      }
    }

    // Create the check-in (upsert to handle one check-in per book per day)
    const { data: checkin, error: checkinError } = await supabase
      .from('reading_checkins')
      .upsert(
        {
          user_id: user.id,
          book_id: bookId,
          pages_read: pagesRead,
          checkin_date: dateToUse,
          mood: mood || null,
        },
        { onConflict: 'user_id,book_id,checkin_date' }
      )
      .select('*, books(id, title, author, cover_url)')
      .single();

    if (checkinError) {
      console.error('Error creating checkin:', checkinError);
      return NextResponse.json({ error: checkinError.message }, { status: 400 });
    }

    return NextResponse.json({ checkin });
  } catch (error) {
    console.error('Checkins POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
