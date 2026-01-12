import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

    // Calculate reading streak from check-ins (independent of completed books)
    const readingStreak = await calculateReadingStreak(supabase, user.id);

    if (!userBooks || userBooks.length === 0) {
      return NextResponse.json({
        yearlyTrends: generateEmptyMonths(),
        genreBreakdown: [],
        readingStreak,
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

    // Fetch reading checkins for the current year
    const { data: checkins, error: checkinsError } = await supabase
      .from('reading_checkins')
      .select('checkin_date, pages_read')
      .eq('user_id', user.id)
      .gte('checkin_date', `${currentYear}-01-01`)
      .lte('checkin_date', `${currentYear}-12-31`);

    if (checkinsError) {
      console.error('Error fetching checkins:', checkinsError);
    }

    const yearlyTrends = generateMonthlyTrends(yearlyBooks, checkins || []);
    const genreBreakdown = generateGenreBreakdown(userBooks);
    const topRatedBooks = getTopRatedBooks(userBooks, 5);

    // Calculate total pages from completed books
    const pagesFromBooks = userBooks.reduce(
      (sum, ub) => sum + (ub.books?.page_count || 0),
      0
    );

    // Calculate total pages from checkins
    const { data: allCheckins } = await supabase
      .from('reading_checkins')
      .select('pages_read')
      .eq('user_id', user.id);

    const pagesFromCheckins = (allCheckins || []).reduce(
      (sum, checkin) => sum + (checkin.pages_read || 0),
      0
    );

    // Total pages is the sum of both (avoiding double counting if a book was completed and also had checkins)
    // For now, we'll use the larger value or sum them - but typically checkins are for in-progress books
    // So we'll sum them to get total reading activity
    const totalPagesRead = pagesFromBooks + pagesFromCheckins;

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

function generateMonthlyTrends(
  books: UserBook[],
  checkins: Array<{ checkin_date: string; pages_read: number }> = []
): MonthlyTrend[] {
  const monthlyData: Record<number, { books: number; pages: number }> = {};

  for (let i = 0; i < 12; i++) {
    monthlyData[i] = { books: 0, pages: 0 };
  }

  // Add pages from completed books
  books.forEach((userBook) => {
    if (userBook.completed_at) {
      const month = new Date(userBook.completed_at).getMonth();
      monthlyData[month].books += 1;
      monthlyData[month].pages += userBook.books?.page_count || 0;
    }
  });

  // Add pages from reading checkins
  checkins.forEach((checkin) => {
    if (checkin.checkin_date && checkin.pages_read) {
      const month = new Date(checkin.checkin_date).getMonth();
      monthlyData[month].pages += checkin.pages_read;
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

async function calculateReadingStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  // Fetch distinct check-in dates for user, ordered descending
  const { data: checkins, error } = await supabase
    .from('reading_checkins')
    .select('checkin_date')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: false });

  if (error || !checkins || checkins.length === 0) return 0;

  // Get unique dates (in case multiple check-ins on same day)
  const uniqueDates = [...new Set(checkins.map((c) => c.checkin_date))];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Streak must include today or yesterday to be active
  const latestCheckin = uniqueDates[0];
  if (latestCheckin !== todayStr && latestCheckin !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  const currentDate = new Date(latestCheckin);

  for (const dateStr of uniqueDates) {
    const expectedDateStr = currentDate.toISOString().split('T')[0];

    if (dateStr === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
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
