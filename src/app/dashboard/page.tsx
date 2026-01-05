'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Star, Target, Bookmark, Clock, Award, Search, TrendingUp, Flame } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { StatCardSkeleton, ChartSkeletonLoader } from '@/components/Skeleton';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ';
  progress?: number;
}

interface ReadingStats {
  booksReadThisYear: number;
  totalBooksRead: number;
  currentlyReading: number;
  wantToRead: number;
  averageRating: number;
}

interface ReadingGoal {
  id: string;
  goal_count: number;
  description?: string;
}

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

interface Statistics {
  yearlyTrends: MonthlyTrend[];
  genreBreakdown: GenreStats[];
  readingStreak: number;
  topRatedBooks: {
    title: string;
    rating: number;
    author: string;
  }[];
  totalBooksRead: number;
  totalPagesRead: number;
  averageRating: number;
  thisMonthBooks: number;
  thisYearBooks: number;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#018283"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
        <span className="text-xs text-gray-600">Complete</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { currentTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [recentReads, setRecentReads] = useState<Book[]>([]);
  const [readingGoal, setReadingGoal] = useState<ReadingGoal | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    booksReadThisYear: 0,
    totalBooksRead: 0,
    currentlyReading: 0,
    wantToRead: 0,
    averageRating: 0,
  });
  const [statistics, setStatistics] = useState<Statistics>({
    yearlyTrends: [],
    genreBreakdown: [],
    readingStreak: 0,
    topRatedBooks: [],
    totalBooksRead: 0,
    totalPagesRead: 0,
    averageRating: 0,
    thisMonthBooks: 0,
    thisYearBooks: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
        const { data: { session } } = await import('@/lib/supabase/client').then(m => m.supabase.auth.getSession());
        if (!session?.access_token) return;

        const headers = {
          'Authorization': `Bearer ${session.access_token}`,
        };

        const booksResponse = await fetch('/api/users/books', { headers });
        const booksData = await booksResponse.json();

        if (booksData.books) {
          const books = booksData.books;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapBook = (b: any) => ({
            id: b.book_id || b.books?.id,
            title: b.books?.title || b.title,
            author: b.books?.author || b.author,
            cover: b.books?.cover_url || b.cover_url,
            rating: b.rating,
            status: b.status,
            progress: b.progress,
          });
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentlyReadingBooks = books.filter((b: any) => b.status === 'CURRENTLY_READING').slice(0, 4).map(mapBook);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const readBooks = books.filter((b: any) => b.status === 'READ').slice(0, 6).map(mapBook);

          setCurrentlyReading(currentlyReadingBooks);
          setRecentReads(readBooks);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const thisYearBooks = books.filter((b: any) => {
            if (!b.completed_at) return false;
            const year = new Date(b.completed_at).getFullYear();
            return year === new Date().getFullYear();
          }).length;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ratings = books.filter((b: any) => b.rating).map((b: any) => b.rating);
          const avgRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;

          setStats({
            booksReadThisYear: thisYearBooks,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            totalBooksRead: books.filter((b: any) => b.status === 'READ').length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentlyReading: books.filter((b: any) => b.status === 'CURRENTLY_READING').length,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            wantToRead: books.filter((b: any) => b.status === 'WANT_TO_READ').length,
            averageRating: avgRating,
          });
        }

        const statsResponse = await fetch('/api/statistics', { headers });
        const statsData = await statsResponse.json();
        if (!statsData.error) {
          setStatistics(statsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  useEffect(() => {
    const fetchReadingGoal = async () => {
      try {
        const { data: { session } } = await import('@/lib/supabase/client').then(m => m.supabase.auth.getSession());
        if (!session?.access_token) return;

        const response = await fetch('/api/reading-goals', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();
        if (data.goal) {
          setReadingGoal(data.goal);
        } else {
          setReadingGoal({ id: '', goal_count: 12, description: '' });
        }
      } catch (error) {
        console.error('Error fetching reading goal:', error);
        setReadingGoal({ id: '', goal_count: 12, description: '' });
      }
    };

    if (user?.id && !loading) {
      fetchReadingGoal();
    }
  }, [user?.id, loading]);

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">
            <BookOpen className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const goalCount = readingGoal?.goal_count || 12;
  const progressPercentage = Math.min((stats.booksReadThisYear / goalCount) * 100, 100);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient}`}>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {
              user.user_metadata?.name?.split(' ')[0] || 
              user.user_metadata?.full_name?.split(' ')[0] || 
              user.user_metadata?.username || 
              user.email?.split('@')[0] || 
              'Reader'
            }!
          </h2>
          <p className="text-lg text-gray-600">
            Continue your reading adventure and discover your next favorite book
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Books Read This Year */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Books This Year</h3>
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Target className="h-5 w-5 text-teal-600" />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <div className="text-3xl font-bold text-gray-900">{stats.booksReadThisYear}</div>
                <div className="text-lg text-gray-400">/ {goalCount}</div>
              </div>
              <div className="mb-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {progressPercentage >= 100 ? '🎉 Goal completed!' : `${Math.round(progressPercentage)}% to goal`}
              </p>
            </div>

            {/* Total Books Read */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Total Read</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBooksRead}</div>
              <p className="text-sm text-gray-500">All time</p>
            </div>

            {/* Currently Reading */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Reading Now</h3>
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <Clock className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.currentlyReading}</div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-500">In progress</p>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">Avg Rating</h3>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.averageRating.toFixed(1)}</div>
              <p className="text-sm text-gray-500">Out of 5</p>
            </div>
          </div>
        )}

        {/* Reading Analytics Section */}
        {loading ? (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reading Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => <ChartSkeletonLoader key={i} />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {[...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
          </div>
        ) : statistics && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reading Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Trends Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">Monthly Trends</h4>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statistics.yearlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="booksRead"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ fill: '#0ea5e9', r: 4 }}
                      name="Books Read"
                    />
                    <Line
                      type="monotone"
                      dataKey="pagesRead"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Pages Read"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Genre Breakdown Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">Genre Distribution</h4>
                  <BookOpen className="h-5 w-5 text-cyan-600" />
                </div>
                {statistics.genreBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statistics.genreBreakdown as unknown as Record<string, number | string>[]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={(data: any) => `${data.genre} ${data.percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {statistics.genreBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium">No genre data yet</p>
                    <p className="text-xs mt-1">Start reading to see your preferences!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reading Streak & Top Books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Reading Streak Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">Reading Streak</h4>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex items-center">
                  <div className="text-5xl font-bold text-orange-500">{statistics.readingStreak}</div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Consecutive days of reading</p>
                    <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
                  </div>
                </div>
              </div>

              {/* Top Rated Books */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">Top Rated Books</h4>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  {statistics.topRatedBooks.length > 0 ? (
                    statistics.topRatedBooks.slice(0, 3).map((book, idx) => (
                      <div key={idx} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">{book.rating}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No rated books yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Currently Reading & Recent Reads */}
          <div className="lg:col-span-2 space-y-8">
            {/* Currently Reading Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-600" />
                  Currently Reading
                </h3>
              </div>
              <div className="p-6">
                {currentlyReading.length > 0 ? (
                  <div className="space-y-4">
                    {currentlyReading.map((book) => (
                      <BookCard 
                        key={book.id} 
                        book={book} 
                        variant="list" 
                        onClick={() => router.push(`/books/${book.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                   <div className="text-center py-12">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                       <BookOpen className="h-8 w-8 text-gray-400" />
                     </div>
                     <p className="text-gray-600 font-medium mb-4">No books in progress</p>
                     <Link
                       href="/search"
                       className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                     >
                       Start Reading
                     </Link>
                   </div>
                )}
              </div>
            </div>

            {/* Recent Reads Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Recently Read
                </h3>
              </div>
              <div className="p-6">
                {recentReads.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {recentReads.map((book) => (
                      <BookCard 
                        key={book.id} 
                        book={book} 
                        variant="grid" 
                        onClick={() => router.push(`/books/${book.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                   <div className="text-center py-12">
                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                       <Star className="h-8 w-8 text-gray-400" />
                     </div>
                     <p className="text-gray-600 font-medium">No books read yet</p>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Reading Goal Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Reading Goal</h3>
                <Target className="h-5 w-5 text-teal-600" />
              </div>
              <div className="flex flex-col items-center">
                <CircularProgress percentage={progressPercentage} size={120} />
                <div className="mt-4 text-center">
                  <div className="flex items-baseline justify-center space-x-1 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{stats.booksReadThisYear}</span>
                    <span className="text-gray-500">of {goalCount}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.max(0, goalCount - stats.booksReadThisYear)} more to reach your goal!
                  </p>
                  <Link
                    href="/profile"
                    className="inline-block mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Edit Goal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Shelves Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-teal-600" />
                Your Shelves
              </h3>
              <div className="space-y-2">
                <Link
                  href="/books/currently-reading"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Currently Reading</span>
                  <span className="font-bold text-gray-900">{stats.currentlyReading}</span>
                </Link>
                <Link
                  href="/books/want-to-read"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Want to Read</span>
                  <span className="font-bold text-gray-900">{stats.wantToRead}</span>
                </Link>
                <Link
                  href="/books/read"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Read</span>
                  <span className="font-bold text-gray-900">{stats.totalBooksRead}</span>
                </Link>
              </div>
            </div>

            {/* CTA Card */}
            <Link
              href="/search"
              className="block bg-teal-600 rounded-xl shadow-sm p-6 text-white hover:bg-teal-700 transition-colors"
            >
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">Discover Books</h4>
                <p className="text-white/80 text-sm">Find your next great read</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
