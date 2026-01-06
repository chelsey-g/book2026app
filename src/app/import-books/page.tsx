'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Upload, CheckCircle2, XCircle, Loader, BookOpen, Download } from 'lucide-react';

interface ParsedBook {
  name: string;
  author: string;
  status: string;
  rating: number;
  dateStarted?: string;
  dateFinished?: string;
  type?: string;
}

interface BookWithPreview extends ParsedBook {
  id: string;
  coverUrl?: string;
  description?: string;
  selected: boolean;
  searchStatus: 'pending' | 'found' | 'not-found';
}

export default function ImportBooksPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [parsedBooks, setParsedBooks] = useState<BookWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchingCovers, setSearchingCovers] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Sign in to import books from your Notion database</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374]">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    try {
      const text = await uploadedFile.text();
      const books = parseCSV(text);
      
      const booksWithPreview: BookWithPreview[] = books.map((book, idx) => ({
        ...book,
        id: `book-${idx}`,
        selected: true,
        searchStatus: 'pending',
      }));

      setParsedBooks(booksWithPreview);
      await searchBookCovers(booksWithPreview);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please ensure it\'s exported from Notion.');
    } finally {
      setLoading(false);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const parseCSV = (text: string): ParsedBook[] => {
    const lines = text.split('\n');
    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

    const books: ParsedBook[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]).map(v => v.trim());
      const book: ParsedBook = {
        name: '',
        author: '',
        status: 'READ',
        rating: 0,
      };

      headers.forEach((header, idx) => {
        const value = values[idx];
        if (header.includes('name') || header.includes('title')) {
          book.name = value;
        } else if (header.includes('author')) {
          book.author = value;
        } else if (header.includes('status')) {
          const statusMap: Record<string, string> = {
            finished: 'READ',
            'currently reading': 'CURRENTLY_READING',
            'want to read': 'WANT_TO_READ',
            'did not finish': 'DNF',
          };
          book.status = statusMap[value.toLowerCase()] || 'READ';
        } else if (header.includes('score') || header.includes('rating')) {
          // Count star emojis (⭐) in the rating field
          const starCount = (value.match(/⭐/g) || []).length;
          book.rating = starCount > 0 ? starCount : 0;
        } else if (header.includes('date sta')) {
          book.dateStarted = value;
        } else if (header.includes('date fin')) {
          book.dateFinished = value;
        } else if (header.includes('type')) {
          book.type = value;
        }
      });

      if (book.name && book.author) {
        books.push(book);
      }
    }

    return books;
  };

  const searchBookCovers = async (books: BookWithPreview[]) => {
    setSearchingCovers(true);

    const updated = [...books];

    for (let i = 0; i < updated.length; i++) {
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(updated[i].name)} ${encodeURIComponent(updated[i].author)}&limit=1`);
        const data = await response.json();

        if (data.books && data.books.length > 0) {
          const book = data.books[0];
          updated[i].coverUrl = book.cover_url || book.coverUrl;
          updated[i].description = book.description;
          updated[i].searchStatus = 'found';
        } else {
          updated[i].searchStatus = 'not-found';
        }
      } catch (error) {
        console.error(`Error searching for ${updated[i].name}:`, error);
        updated[i].searchStatus = 'not-found';
      }

      setParsedBooks([...updated]);
    }

    setSearchingCovers(false);
  };

  const handleSelectAll = (selected: boolean) => {
    setParsedBooks(parsedBooks.map(book => ({ ...book, selected })));
  };

  const handleSelectBook = (id: string) => {
    setParsedBooks(parsedBooks.map(book => 
      book.id === id ? { ...book, selected: !book.selected } : book
    ));
  };

   const handleImport = async () => {
     const selectedBooks = parsedBooks.filter(b => b.selected);
     if (selectedBooks.length === 0) {
       alert('Please select at least one book to import');
       return;
     }

     setImporting(true);
     try {
       const { supabase } = await import('@/lib/supabase/client');
       const { data: { session } } = await supabase.auth.getSession();

       if (!session?.access_token) {
         throw new Error('Authentication required');
       }

        const booksToImport = selectedBooks.map(book => ({
          name: book.name,
          author: book.author,
          status: book.status,
          rating: book.rating,
          dateStarted: book.dateStarted,
          dateFinished: book.dateFinished,
          type: book.type,
          cover: book.coverUrl,
          year: selectedYear,
        }));

       console.log('📤 Sending books to import:', booksToImport);
       console.log('📤 Auth token:', session.access_token?.slice(0, 20) + '...');
       
       const response = await fetch('/api/books/bulk-import', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${session.access_token}`,
         },
         body: JSON.stringify(booksToImport),
       });

       const data = await response.json();
       console.log('📥 Response:', { status: response.status, data });

       if (!response.ok) {
         throw new Error(data.error || `API Error: ${response.status}`);
       }

       const errorMsg = data.errors?.length > 0 ? `\n\nFailed: ${data.errors.map((e: any) => `${e.book}: ${e.error}`).join('\n')}` : '';
       alert(`Successfully imported ${data.importedCount} books!${errorMsg}`);
       setParsedBooks([]);
       setFile(null);
     } catch (error) {
       console.error('❌ Import error:', error);
       alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
     } finally {
       setImporting(false);
     }
   };

  const selectedCount = parsedBooks.filter(b => b.selected).length;
  const foundCount = parsedBooks.filter(b => b.searchStatus === 'found').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Import Books from Notion</h1>
          <p className="text-lg text-gray-600">Upload your Notion CSV export to quickly add books to your library</p>
        </div>

        {parsedBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Notion CSV</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                 Export your reading list from Notion as CSV and upload it here. We&apos;ll match each book with cover art and let you review before importing.
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] cursor-pointer transition-colors font-medium">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Choose CSV File
                    </>
                  )}
                </span>
              </label>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-3">📋 How to export from Notion:</p>
                <ol className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
                  <li>1. Open your Notion database</li>
                  <li>2. Click the ⋯ menu (top right)</li>
                  <li>3. Select &quot;Download&quot; → &quot;Markdown &amp; CSV&quot;</li>
                  <li>4. Upload the CSV file here</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {parsedBooks.length} books found
                  </h2>
                  <p className="text-gray-600">
                    {foundCount} with cover art • {selectedCount} selected
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelectAll(true)}
                    className="px-4 py-2 text-sm font-medium text-[#018283] border border-[#018283] rounded-lg hover:bg-[#018283]/5"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleSelectAll(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Reading Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full sm:w-48 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent bg-white"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-blue-700 mt-2">
                  Select the year when you read these books. Dates without years will use this year.
                </p>
              </div>

              {searchingCovers && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-900">
                  <Loader className="w-4 h-4 animate-spin" />
                  Searching for cover art...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parsedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSelectBook(book.id)}
                  className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    book.selected
                      ? 'border-[#018283] bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-16">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.name}
                          className="w-16 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{book.name}</h3>
                          <p className="text-xs text-gray-600">{book.author}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {book.searchStatus === 'found' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : book.searchStatus === 'not-found' ? (
                            <XCircle className="w-5 h-5 text-gray-300" />
                          ) : (
                            <Loader className="w-5 h-5 animate-spin text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {book.status === 'READ' ? 'Read' : book.status === 'CURRENTLY_READING' ? 'Reading' : book.status === 'WANT_TO_READ' ? 'Want to Read' : 'DNF'}
                          </span>
                          {book.rating > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 rounded flex items-center gap-1">
                              ⭐ {book.rating}
                            </span>
                          )}
                        </div>
                        {book.dateFinished && (
                          <p className="text-xs text-gray-500">Finished: {book.dateFinished}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setParsedBooks([]);
                  setFile(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing || selectedCount === 0}
                className="flex-1 px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {importing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin inline mr-2" />
                    Importing...
                  </>
                ) : (
                  `Import ${selectedCount} Books`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
