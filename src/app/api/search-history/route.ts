import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // Check if search history is enabled for this user
    const { data: userData } = await supabase
      .from('users')
      .select('search_history_enabled')
      .eq('id', user.id)
      .single();

    if (userData && userData.search_history_enabled === false) {
      return NextResponse.json({ searches: [] });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data: searches, error } = await supabase
      .from('search_history')
      .select('id, query, searched_at')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ searches: searches || [] });
  } catch (error) {
    console.error('Search history GET error:', error);
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

    const { query } = await request.json();

    // Validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return NextResponse.json({ error: 'Query cannot be empty' }, { status: 400 });
    }

    if (trimmedQuery.length > 200) {
      return NextResponse.json({ error: 'Query is too long (max 200 characters)' }, { status: 400 });
    }

    // Check if search history is enabled for this user
    const { data: userData } = await supabase
      .from('users')
      .select('search_history_enabled')
      .eq('id', user.id)
      .single();

    if (userData && userData.search_history_enabled === false) {
      // Silent no-op when disabled - return success without saving
      return NextResponse.json({
        search: {
          id: 'skipped',
          query: trimmedQuery,
          searched_at: new Date().toISOString()
        }
      });
    }

    // Upsert: Update searched_at if query exists, insert if new
    const { data: search, error: upsertError } = await supabase
      .from('search_history')
      .upsert(
        {
          user_id: user.id,
          query: trimmedQuery,
          searched_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,query' }
      )
      .select('id, query, searched_at')
      .single();

    if (upsertError) {
      console.error('Error saving search history:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 400 });
    }

    // Auto-prune: Keep only last 50 searches per user
    const { data: allSearches } = await supabase
      .from('search_history')
      .select('id')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false });

    if (allSearches && allSearches.length > 50) {
      const idsToKeep = allSearches.slice(0, 50).map(s => s.id);
      await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)
        .not('id', 'in', `(${idsToKeep.join(',')})`);
    }

    return NextResponse.json({ search });
  } catch (error) {
    console.error('Search history POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Search history cleared'
    });
  } catch (error) {
    console.error('Search history DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
