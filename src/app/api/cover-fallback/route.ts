import { NextRequest, NextResponse } from 'next/server';
import { findBookCover } from '@/lib/data-sources/book-sources';

export async function GET(request: NextRequest) {
  const isbn = request.nextUrl.searchParams.get('isbn');
  const title = request.nextUrl.searchParams.get('title');
  const author = request.nextUrl.searchParams.get('author');

  if (!isbn && !title) {
    return NextResponse.json({ error: 'ISBN or title is required' }, { status: 400 });
  }

  try {
    const coverUrl = await findBookCover(isbn || undefined, title || undefined, author || undefined);
    return NextResponse.json({ coverUrl });
  } catch (error) {
    console.error('Cover fallback error:', error);
    return NextResponse.json({ coverUrl: null });
  }
}
