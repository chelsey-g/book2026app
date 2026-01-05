'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Star, Plus, TrendingUp, Users, Search, Filter, X, Sparkles, ChevronDown, SlidersHorizontal, Flame, Loader, Target } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

interface Book {
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  cover_url?: string;
  pageCount?: number;
  description?: string;
  genres?: string[];
  publishedDate?: number;
  trendingScore?: number;
  type?: string;
}

interface FilterOptions {
  genre: string;
  sortBy: 'relevance' | 'rating' | 'publicationDate' | 'popularity';
  yearRange: string;
}

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  const sortBy = (searchParams.get('sort') || 'relevance') as FilterOptions['sortBy'];
  const yearRange = searchParams.get('year') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [userBooks, setUserBooks] = useState<{ [key: string]: string }>({});
  const [timeframe, setTimeframe] = useState('all');
  const [searchError, setSearchError] = useState('');
  const { user } = useAuth();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Science Fiction',
    'Fantasy', 'Historical', 'Biography', 'Self-Help', 'Business', 'Cooking',
    'Travel', 'Art & Design', 'Health & Fitness', 'Parenting', 'Science', 'Technology'
  ];

  const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (query) {
      searchBooks();
    } else {
      // Load initial content when no search query
      fetchInitialContent();
    }
  }, [query, genre, sortBy, yearRange]);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
      fetchRecommendations();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTrendingBooks();
    }
  }, [user, timeframe]);

  const fetchInitialContent = async () => {
    if (user) {
      // Fetch recommendations and trending for signed-in users
      await Promise.all([fetchRecommendations(), fetchTrendingBooks()]);
    } else {
      // Fetch trending books for non-signed-in users
      await fetchTrendingBooks();
    }
  };

  const searchBooks = async () => {
    setLoading(true);
    try {
      let searchUrl = `/api/books/search?q=${encodeURIComponent(query)}`;

      if (genre) {
        searchUrl += `&genre=${encodeURIComponent(genre)}`;
      }

      if (yearRange) {
        searchUrl += `&year=${yearRange}`;
      }

      if (sortBy !== 'relevance') {
        searchUrl += `&sort=${sortBy}`;
      }

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search books');
      }

      setBooks(data.books || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/recommendations', { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Recommendations error:', error);
    }
  };

  const fetchTrendingBooks = async () => {
    try {
      const response = await fetch(`/api/books/popular?limit=12&timeframe=${timeframe}`);
      const data = await response.json();
      setTrending(data.books || []);
    } catch (error) {
      console.error('Trending books error:', error);
    }
  };

  const fetchUserBooks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const response = await fetch('/api/users/books', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) return;

      const result = await response.json();
      const bookMap: { [key: string]: string } = {};

      (result.books || []).forEach((userBook: any) => {
        bookMap[userBook.book_id] = userBook.id;
      });

      setUserBooks(bookMap);
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  const handleAddBook = async (book: Book) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/users/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookId: book.id || book.isbn || `temp_${book.title}_${Date.now()}`,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          coverUrl: book.coverUrl || book.cover_url,
          description: book.description,
          genres: book.genres,
          status: 'WANT_TO_READ',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        throw new Error(errorMsg || 'Failed to add book');
      }

      const bookId = book.id || book.isbn || `temp_${book.title}_${Date.now()}`;
      setUserBooks(prev => ({ ...prev, [bookId]: data.book.id }));
      alert(`"${book.title}" added to your reading list!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Add book error:', message);
      alert(`Failed to add book: ${message}`);
    }
  };

  const handleChangeStatus = async (book: Book, newStatus: string) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      const bookId = book.id || book.isbn || `temp_${book.title}_${Date.now()}`;
      const userBookId = userBooks[bookId];

      if (!userBookId) {
        throw new Error('Book not found in your library');
      }

      const response = await fetch('/api/users/books/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userBookId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book status');
      }

      alert(`Book marked as ${newStatus.replace(/_/g, ' ').toLowerCase()}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Change status error:', message);
      alert(`Failed to update book: ${message}`);
    }
  };

  const getFilterBadgeText = () => {
    const activeFilters = [genre, sortBy, yearRange].filter(Boolean).length;
    return activeFilters > 0 ? activeFilters : '';
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('genre');
    newParams.delete('sort');
    newParams.delete('year');
    window.location.href = `/discover?q=${query}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#018283] to-[#2CAED8] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#018283]/30 to-[#2CAED8]/30 rounded-2xl blur-lg"></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Discover Your Next Read
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search our curated collection, get personalized recommendations, and explore trending books
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#018283]/10 to-[#2CAED8]/10 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden">
              <div className="flex items-center">
                <div className="pl-6 pr-2">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                   type="text"
                   value={inputValue}
                   onChange={(e) => {
                     setInputValue(e.target.value);
                     setSearchError('');

                     if (debounceTimer.current) {
                       clearTimeout(debounceTimer.current);
                     }

                     debounceTimer.current = setTimeout(() => {
                       if (e.target.value.trim()) {
                         const newParams = new URLSearchParams(searchParams.toString());
                         newParams.set('q', e.target.value);
                         window.location.href = `/discover?${newParams.toString()}`;
                       } else {
                         setSearchError('');
                       }
                     }, 500);
                   }}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !inputValue.trim()) {
                       setSearchError('Please enter a search term');
                       e.preventDefault();
                     }
                   }}
                   placeholder="Search for books, authors, or ISBN..."
                   className="flex-1 px-4 py-5 text-lg bg-transparent focus:outline-none placeholder-gray-400 text-gray-900"
                 />
                <div className="flex items-center space-x-2 pr-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                      relative flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-200
                      ${showFilters
                        ? 'bg-gradient-to-r from-[#018283]/10 to-[#2CAED8]/10 text-[#018283] shadow-md'
                        : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50'
                      }
                    `}
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="text-sm font-medium">Filters</span>
                    {getFilterBadgeText() && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                        {getFilterBadgeText()}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        if (e.target.value !== 'relevance') {
                          newParams.set('sort', e.target.value);
                        } else {
                          newParams.delete('sort');
                        }
                        window.location.href = `/discover?${newParams.toString()}`;
                      }}
                      className="appearance-none bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 px-5 py-3 pr-10 rounded-2xl focus:outline-none transition-colors duration-200 text-sm font-medium cursor-pointer"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="popularity">Most Popular</option>
                      <option value="rating">Best Rated</option>
                      <option value="publicationDate">Newest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
             </div>
             {searchError && (
               <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
                 <span>⚠️</span>
                 <span>{searchError}</span>
               </div>
             )}
           </div>
         </div>

         {/* Filters */}
        {showFilters && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Refine Your Search</h3>
                {(genre || yearRange || sortBy !== 'relevance') && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#018283] hover:text-[#017374] font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    Genre
                  </label>
                  <div className="relative">
                    <select
                      value={genre}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        if (e.target.value) {
                          newParams.set('genre', e.target.value);
                        } else {
                          newParams.delete('genre');
                        }
                        window.location.href = `/discover?${newParams.toString()}`;
                      }}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#018283]/20 focus:border-[#018283] transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">All Genres</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Publication Year</label>
                  <div className="relative">
                    <select
                      value={yearRange}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        if (e.target.value) {
                          newParams.set('year', e.target.value);
                        } else {
                          newParams.delete('year');
                        }
                        window.location.href = `/discover?${newParams.toString()}`;
                      }}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#018283]/20 focus:border-[#018283] transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!query && user && recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-[#018283] mr-3" />
                <div className="absolute inset-0 bg-[#018283]/20 rounded-lg blur-md -z-10"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
              <div className="ml-4 px-3 py-1 bg-gradient-to-r from-[#018283]/10 to-[#2CAED8]/10 rounded-full">
                <span className="text-sm font-medium text-[#018283]">AI Curated</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.slice(0, 8).map((book, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {book.coverUrl || book.cover_url ? (
                        <img
                          src={book.coverUrl || book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <BookOpen className="h-16 w-16 text-gray-400" />
                            <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl"></div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#018283] transition-colors duration-200">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{book.author}</p>
                      {book.genres && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {book.genres.slice(0, 2).map((genre, genreIndex) => (
                            <span key={genreIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddBook(book)}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-md hover:shadow-lg group/btn"
                          disabled={!user}
                        >
                          <Plus className="h-4 w-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span className="text-sm font-medium">
                            {user ? 'Add to List' : 'Sign in'}
                          </span>
                        </button>
                        <Link
                          href={`/books/${book.id || book.isbn || `temp_${book.title}`}`}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 hover:text-[#018283] transition-all duration-200"
                        >
                          <Star className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Books */}
        {!query && trending.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Flame className="h-8 w-8 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              </div>

              <div className="flex gap-2">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trending.slice(0, 8).map((book, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {book.coverUrl || book.cover_url ? (
                        <img
                          src={book.coverUrl || book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <BookOpen className="h-16 w-16 text-gray-400" />
                            <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl"></div>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        #{index + 1}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#018283] transition-colors duration-200">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{book.author}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddBook(book)}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-md hover:shadow-lg group/btn"
                          disabled={!user}
                        >
                          <Plus className="h-4 w-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span className="text-sm font-medium">
                            {user ? 'Add to List' : 'Sign in'}
                          </span>
                        </button>
                        <Link
                          href={`/books/${book.id || book.isbn || `temp_${book.title}`}`}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 hover:text-[#018283] transition-all duration-200"
                        >
                          <Star className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {books.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {query ? `Results for "${query}"` : 'Discover Books'}
                </h2>
                <p className="text-lg text-gray-600">
                  {books.length} {books.length === 1 ? 'book' : 'books'} found
                </p>
              </div>
              {(genre || yearRange || sortBy !== 'relevance') && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  <div className="flex space-x-2">
                    {genre && (
                      <span className="px-3 py-1 bg-[#018283]/10 text-[#018283] text-sm rounded-full font-medium">
                        {genre}
                      </span>
                    )}
                    {yearRange && (
                      <span className="px-3 py-1 bg-[#018283]/10 text-[#018283] text-sm rounded-full font-medium">
                        {yearRange}
                      </span>
                    )}
                    {sortBy !== 'relevance' && (
                      <span className="px-3 py-1 bg-[#018283]/10 text-[#018283] text-sm rounded-full font-medium">
                        {sortBy}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <div key={index} className="group">
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-gray-100">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="relative">
                            <BookOpen className="h-20 w-20 text-gray-400" />
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-2xl"></div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#018283] transition-colors duration-200">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{book.author}</p>

                      {book.pageCount && (
                        <p className="text-xs text-gray-500 mb-3">
                          {book.pageCount} pages • {book.publishedDate}
                        </p>
                      )}

                      {book.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                          {book.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        {userBooks[book.isbn || `temp_${book.title}_${Date.now()}`] ? (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleChangeStatus(book, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer appearance-none"
                          >
                            <option value="">Change Status</option>
                            <option value="WANT_TO_READ">Want to Read</option>
                            <option value="CURRENTLY_READING">Reading</option>
                            <option value="READ">Read</option>
                            <option value="DNF">Did Not Finish</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => handleAddBook(book)}
                            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-md hover:shadow-lg group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!user}
                          >
                            <Plus className="h-4 w-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-medium">
                              {user ? 'Add to List' : 'Sign in to Add'}
                            </span>
                          </button>
                        )}
                        <Link
                          href={`/books/${book.isbn || `temp_${book.title}`}`}
                          className="p-2.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-[#018283] hover:text-white transition-all duration-200"
                        >
                          <Star className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#018283]/20 to-[#2CAED8]/20 rounded-3xl flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#018283] to-[#2CAED8] rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#018283]/30 to-[#2CAED8]/30 rounded-3xl blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Searching for books...</h3>
            <p className="text-gray-600">Finding the perfect matches for you</p>

            <div className="flex justify-center mt-8 space-x-2">
              <div className="w-2 h-2 bg-[#018283] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#2CAED8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#018283] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && !query && (!trending.length || !user) && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <div className="relative">
                  <BookOpen className="h-20 w-20 text-gray-400" />
                  <div className="absolute inset-0 bg-gray-300 rounded-full blur-2xl"></div>
                </div>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl blur-xl opacity-50"></div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Start your book discovery journey</h3>
            <p className="text-gray-600 mb-8">Search for books, authors, or explore our curated collection</p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                View Your Dashboard
              </Link>
              {!user && (
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 bg-white text-[#018283] border-2 border-[#018283] rounded-2xl hover:bg-[#018283]/5 transition-all duration-200 inline-flex items-center font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Sign-in prompt for non-authenticated users */}
        {!user && books.length > 0 && (
          <div className="fixed bottom-8 left-8 right-8 max-w-4xl mx-auto z-50">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#018283]/5 to-[#2CAED8]/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#018283] to-[#2CAED8] rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ready to start reading?</h3>
                  </div>
                  <p className="text-gray-600">Sign in to save books to your reading list and get personalized recommendations tailored just for you.</p>
                </div>
                <div className="flex items-center space-x-3 ml-8">
                  <Link
                    href="/auth/signin"
                    className="px-8 py-3.5 bg-gradient-to-r from-[#018283] to-[#2CAED8] text-white rounded-2xl hover:from-[#017374] hover:to-[#2BA6C8] transition-all duration-200 shadow-lg hover:shadow-xl font-medium inline-flex items-center"
                  >
                    Sign In
                    <Plus className="h-4 w-4 ml-2" />
                  </Link>
                  <button
                    onClick={() => {
                      const element = document.querySelector('.fixed.bottom-8');
                      if (element) {
                        (element as HTMLElement).style.display = 'none';
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
