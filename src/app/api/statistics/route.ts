import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface MonthlyTrend {
  month: string;
  booksRead: number;
  pagesRead: number;
}

interface GenreStats {
  genre: string;
  count: number;
  percentage: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  genres: string[];
  page_count: number;
}

interface UserBook {
  id: string;
  rating: number;
  completed_at: string;
  status: string;
  books: Book;
}

interface TopRatedBook {
  title: string;
  rating: number;
  author: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentYear = new Date().getFullYear();
    const currentDate = new Date();

    const { data, error: booksError } = await supabase
      .from('user_books')
      .select(
        `
        id,
        rating,
        completed_at,
        status,
        books (
          id,
          title,
          author,
          genres,
          page_count
        )
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'READ')
      .order('completed_at', { ascending: false });

    if (booksError) throw booksError;

    // Cast the data, accounting for Supabase's response format
    const userBooks: UserBook[] = (data || []) as unknown as UserBook[];

    if (!userBooks || userBooks.length === 0) {
      return NextResponse.json({
        yearlyTrends: generateEmptyMonths(),
        genreBreakdown: [],
        readingStreak: 0,
        topRatedBooks: [],
        totalBooksRead: 0,
        totalPagesRead: 0,
        averageRating: 0,
        thisMonthBooks: 0,
        thisYearBooks: 0,
      });
    }

    const yearlyBooks = userBooks.filter(
      (ub) =>
        ub.completed_at &&
        new Date(ub.completed_at).getFullYear() === currentYear
    );

    const thisMonthBooks = userBooks.filter((ub) => {
      if (!ub.completed_at) return false;
      const completed = new Date(ub.completed_at);
      return (
        completed.getFullYear() === currentYear &&
        completed.getMonth() === currentDate.getMonth()
      );
    });

    const yearlyTrends = generateMonthlyTrends(yearlyBooks);
    const genreBreakdown = generateGenreBreakdown(userBooks);
    const readingStreak = calculateReadingStreak(userBooks);
    const topRatedBooks = getTopRatedBooks(userBooks, 5);

    const totalPagesRead = userBooks.reduce(
      (sum, ub) => sum + (ub.books?.page_count || 0),
      0
    );

    const averageRating =
      userBooks.length > 0
        ? userBooks.reduce((sum, ub) => sum + (ub.rating || 0), 0) /
          userBooks.length
        : 0;

    return NextResponse.json({
      yearlyTrends,
      genreBreakdown,
      readingStreak,
      topRatedBooks,
      totalBooksRead: userBooks.length,
      totalPagesRead,
      averageRating: Math.round(averageRating * 10) / 10,
      thisMonthBooks: thisMonthBooks.length,
      thisYearBooks: yearlyBooks.length,
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

function generateEmptyMonths(): MonthlyTrend[] {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthNames.map((month) => ({
    month,
    booksRead: 0,
    pagesRead: 0,
  }));
}

function generateMonthlyTrends(books: UserBook[]): MonthlyTrend[] {
  const monthlyData: Record<number, { books: number; pages: number }> = {};

  for (let i = 0; i < 12; i++) {
    monthlyData[i] = { books: 0, pages: 0 };
  }

  books.forEach((userBook) => {
    if (userBook.completed_at) {
      const month = new Date(userBook.completed_at).getMonth();
      monthlyData[month].books += 1;
      monthlyData[month].pages += userBook.books?.page_count || 0;
    }
  });

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthNames.map((month, index) => ({
    month,
    booksRead: monthlyData[index].books,
    pagesRead: monthlyData[index].pages,
  }));
}

function generateGenreBreakdown(books: UserBook[]): GenreStats[] {
  const genreCounts: Record<string, number> = {};

  books.forEach((userBook) => {
    if (userBook.books?.genres && Array.isArray(userBook.books.genres)) {
      userBook.books.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);

  if (total === 0) return [];

  return Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function calculateReadingStreak(books: UserBook[]): number {
  if (books.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedBooks = [...books].sort((a, b) => {
    const dateA = a.completed_at
      ? new Date(a.completed_at)
      : new Date(0);
    const dateB = b.completed_at
      ? new Date(b.completed_at)
      : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  const currentDate = new Date(today);

  for (const book of sortedBooks) {
    if (!book.completed_at) continue;

    const bookDate = new Date(book.completed_at);
    bookDate.setHours(0, 0, 0, 0);

    if (bookDate.getTime() === currentDate.getTime()) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (bookDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

function getTopRatedBooks(
  books: UserBook[],
  limit: number = 5
): TopRatedBook[] {
  return books
    .filter((ub) => ub.rating && ub.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
    .map((ub) => ({
      title: ub.books?.title || 'Unknown',
      rating: ub.rating || 0,
      author: ub.books?.author || 'Unknown',
    }));
}
