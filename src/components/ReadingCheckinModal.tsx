'use client';

import { useState, useRef, useEffect } from 'react';
import { X, BookOpen, ChevronDown, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Book {
  id: string;
  book_id: string;
  title: string;
  author: string;
  cover_url?: string;
}

interface SearchBook {
  id?: string;
  title: string;
  author: string;
  coverUrl?: string;
  cover_url?: string;
  isbn?: string;
}

interface ReadingCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentlyReadingBooks: Book[];
  onCheckinComplete: () => void;
}

const MOOD_OPTIONS = [
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'confused', emoji: '😕', label: 'Confused' },
  { value: 'inspired', emoji: '✨', label: 'Inspired' },
  { value: 'bored', emoji: '😴', label: 'Bored' },
] as const;

export default function ReadingCheckinModal({
  isOpen,
  onClose,
  currentlyReadingBooks,
  onCheckinComplete,
}: ReadingCheckinModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [pagesRead, setPagesRead] = useState<string>('');
  const [checkinDate, setCheckinDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const bookDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBookFromSearch, setSelectedBookFromSearch] = useState<SearchBook | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Click outside to close book dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target as Node)) {
        setShowBookDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBookId('');
      setPagesRead('');
      setCheckinDate(new Date().toISOString().split('T')[0]);
      setSelectedMood('');
      setError(null);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedBookFromSearch(null);
      setShowBookDropdown(false);
    }
  }, [isOpen]);

  // Search books with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
        const data = await response.json();
        
        if (response.ok && data.books) {
          setSearchResults(data.books.map((book: any) => ({
            id: book.id || book.isbn || `temp_${book.title}_${Date.now()}`,
            title: book.title,
            author: book.author,
            cover_url: book.cover_url || book.coverUrl,
            isbn: book.isbn,
          })));
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const selectedBook = selectedBookFromSearch || currentlyReadingBooks.find(
    (b) => b.book_id === selectedBookId || b.id === selectedBookId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedBookId) {
      setError('Please select a book');
      return;
    }

    const pages = parseInt(pagesRead);
    if (!pages || pages < 1) {
      setError('Please enter a valid number of pages');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Please sign in to log your reading');
        return;
      }

      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bookId: selectedBookId,
          pagesRead: pages,
          checkinDate,
          mood: selectedMood || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log reading');
      }

      onCheckinComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Log Reading</h2>
              <p className="text-sm text-gray-500">Track your daily progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Book Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book
            </label>
            <div className="relative" ref={bookDropdownRef}>
              <button
                type="button"
                onClick={() => setShowBookDropdown(!showBookDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                {selectedBook ? (
                  <div className="flex items-center gap-3">
                    {selectedBook.cover_url ? (
                      <img
                        src={selectedBook.cover_url}
                        alt={selectedBook.title}
                        className="w-8 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{selectedBook.title}</p>
                      <p className="text-sm text-gray-500 truncate">{selectedBook.author}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a book...</span>
                )}
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showBookDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showBookDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for a book..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-900"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="overflow-y-auto max-h-64">
                    {isSearching ? (
                      <div className="px-4 py-8 text-center">
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Searching...</p>
                      </div>
                    ) : searchQuery.trim().length >= 2 && searchResults.length > 0 ? (
                      <>
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-600">Search Results</p>
                        </div>
                        {searchResults.map((book) => (
                          <button
                            key={book.id}
                            type="button"
                            onClick={async () => {
                              try {
                                // Save book to database if it doesn't exist
                                const { data: { session } } = await supabase.auth.getSession();
                                if (!session?.access_token) {
                                  setError('Please sign in to select a book');
                                  return;
                                }

                                // Generate book ID from ISBN or title/author
                                const bookId = book.isbn || `book_${book.title.replace(/\s+/g, '_')}_${book.author.replace(/\s+/g, '_')}`.toLowerCase().substring(0, 100);

                                // Save book to database
                                const saveResponse = await fetch('/api/users/books', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${session.access_token}`,
                                  },
                                  body: JSON.stringify({
                                    bookId,
                                    status: 'CURRENTLY_READING',
                                    title: book.title,
                                    author: book.author,
                                    isbn: book.isbn,
                                    coverUrl: book.cover_url,
                                  }),
                                });

                                if (!saveResponse.ok) {
                                  const errorData = await saveResponse.json();
                                  throw new Error(errorData.error || 'Failed to save book');
                                }

                                setSelectedBookId(bookId);
                                setSelectedBookFromSearch({
                                  id: bookId,
                                  title: book.title,
                                  author: book.author,
                                  cover_url: book.cover_url,
                                });
                                setShowBookDropdown(false);
                                setSearchQuery('');
                                setSearchResults([]);
                                setError(null);
                              } catch (err) {
                                setError(err instanceof Error ? err.message : 'Failed to select book');
                              }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                          >
                            {book.cover_url ? (
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className="w-8 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{book.title}</p>
                              <p className="text-sm text-gray-500 truncate">{book.author}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : searchQuery.trim().length >= 2 && !isSearching ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <p className="text-sm">No books found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </div>
                    ) : (
                      <>
                        {currentlyReadingBooks.length > 0 && (
                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-medium text-gray-600">Currently Reading</p>
                          </div>
                        )}
                        {currentlyReadingBooks.length > 0 ? (
                          currentlyReadingBooks.map((book) => (
                            <button
                              key={book.book_id || book.id}
                              type="button"
                              onClick={() => {
                                setSelectedBookId(book.book_id || book.id);
                                setSelectedBookFromSearch(null);
                                setShowBookDropdown(false);
                                setSearchQuery('');
                                setSearchResults([]);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                            >
                              {book.cover_url ? (
                                <img
                                  src={book.cover_url}
                                  alt={book.title}
                                  className="w-8 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">{book.title}</p>
                                <p className="text-sm text-gray-500 truncate">{book.author}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <p className="text-sm">No books in progress</p>
                            <p className="text-xs mt-1">Search for a book to log reading</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pages Read */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages Read
            </label>
            <input
              type="number"
              min="1"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="Enter number of pages"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-gray-900"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors text-gray-900"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you feel about what you read?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === mood.value ? '' : mood.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all ${
                    selectedMood === mood.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedBookId || !pagesRead}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isSubmitting ? 'Logging...' : 'Log Reading'}
          </button>
        </form>
      </div>
    </div>
  );
}
