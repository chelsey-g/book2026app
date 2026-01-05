'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Flame, Sparkles, Loader, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  coverUrl?: string;
  description?: string;
  trendingScore?: number;
  type?: string;
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [trending, setTrending] = useState<Book[]>([]);
  const [personalized, setPersonalized] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, [timeframe]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const [trendingRes, personalizedRes] = await Promise.all([
        fetch(`/api/books/popular?limit=12&timeframe=${timeframe}`),
        user ? fetch('/api/recommendations') : Promise.resolve(new Response(JSON.stringify({ recommendations: [] })))
      ]);

      const trendingData = await trendingRes.json();
      const personalizedData = await personalizedRes.json();

      setTrending(trendingData.books || []);
      setPersonalized(personalizedData.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In to See Recommendations</h1>
          <p className="text-gray-600 mb-6">Get personalized book recommendations based on your reading history</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Your Next Read</h1>
          <p className="text-lg text-gray-600">Personalized recommendations and trending books just for you</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-[#018283]" />
          </div>
        ) : (
          <>
            {personalized.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Personalized For You</h2>
                  <span className="text-sm text-gray-600">({personalized.length} recommendations)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalized.map((book, index) => (
                    <Link
                      key={index}
                      href={`/books/${book.id}`}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {book.cover_url || book.coverUrl ? (
                          <img
                            src={book.cover_url || book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#018283]">{book.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                        {book.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Books */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              </div>

              {/* Timeframe Filter */}
              <div className="mb-6 flex gap-2">
                {['all', 'month', 'week'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      timeframe === tf
                        ? 'bg-[#018283] text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tf === 'all' ? 'All Time' : tf === 'month' ? 'This Month' : 'This Week'}
                  </button>
                ))}
              </div>

              {trending.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trending.map((book, index) => (
                    <Link
                      key={index}
                      href={`/books/${book.id}`}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {book.cover_url || book.coverUrl ? (
                          <img
                            src={book.cover_url || book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <BookOpen className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#018283]">{book.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                        {book.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">No trending books available right now</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
