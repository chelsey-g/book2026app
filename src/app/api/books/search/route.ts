import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/lib/data-sources/book-sources';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const books = await searchBooks(query, limit);
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Book search error:', error);
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    );
  }
}