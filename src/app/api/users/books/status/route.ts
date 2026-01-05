import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(request: NextRequest) {
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
    const { userBookId, status } = body;

    if (!userBookId || !status) {
      return NextResponse.json(
        { error: 'User book ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['WANT_TO_READ', 'CURRENTLY_READING', 'READ', 'DNF'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    
    if (status === 'CURRENTLY_READING') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'READ') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('user_books')
      .update(updateData)
      .eq('id', userBookId)
      .eq('user_id', user.id)
      .select('*, books(*)')
      .single();

    if (error) throw error;

    return NextResponse.json({ book: data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Failed to update book status:', errorMessage);
    return NextResponse.json(
      { error: `Failed to update book status: ${errorMessage}` },
      { status: 500 }
    );
  }
}
