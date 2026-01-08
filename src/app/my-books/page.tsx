'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { BookOpen, Star, Trash2, Edit2, Search, ChevronDown, BookMarked, Circle, CheckCircle, Clock, XCircle, Star as StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  cover_url?: string;
  description?: string;
  genres?: string[];
}

interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: string;
  current_page?: number;
  started_at?: string;
  completed_at?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  books?: Book;
}

export default function MyBooksPage() {
  const { user } = useAuth();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState('WANT_TO_READ');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-added');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [ratingHoverId, setRatingHoverId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const shelves = [
    { id: 'WANT_TO_READ', label: 'Want to Read', color: 'bg-blue-50' },
    { id: 'CURRENTLY_READING', label: 'Currently Reading', color: 'bg-green-50' },
    { id: 'READ', label: 'Read', color: 'bg-purple-50' },
    { id: 'DNF', label: 'Did Not Finish', color: 'bg-red-50' },
  ];

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortBooks();
  }, [userBooks, selectedShelf, searchTerm, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedShelf, searchTerm, sortBy]);

  const fetchUserBooks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/users/books', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch books');
      const result = await response.json();
      setUserBooks(result.books || []);
    } catch (error) {
      console.error('Error fetching user books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = userBooks.filter(book => book.status === selectedShelf);

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.books?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.books?.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date-added') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'title') {
        return (a.books?.title || '').localeCompare(b.books?.title || '');
      } else if (sortBy === 'author') {
        return (a.books?.author || '').localeCompare(b.books?.author || '');
      }
      return 0;
    });

    setFilteredBooks(filtered);
  };

  const handleDeleteBook = async (userBookId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/users/books/${userBookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete book');
      
      setUserBooks(userBooks.filter(b => b.id !== userBookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

   const handleUpdateStatus = async (userBookId: string, newStatus: string) => {
     try {
       const { data: { session } } = await supabase.auth.getSession();
       
       if (!session?.access_token) {
         throw new Error('No authentication token available');
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

       if (!response.ok) throw new Error('Failed to update book status');
       
       const result = await response.json();
       setUserBooks(userBooks.map(b => b.id === userBookId ? result.book : b));
     } catch (error) {
       console.error('Error updating book status:', error);
       alert('Failed to update book status');
     }
   };

   const handleUpdateRating = async (userBookId: string, newRating: number) => {
     try {
       const { data: { session } } = await supabase.auth.getSession();
       
       if (!session?.access_token) {
         throw new Error('No authentication token available');
       }

       const response = await fetch('/api/users/books/rating', {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${session.access_token}`,
         },
         body: JSON.stringify({
           userBookId,
           rating: newRating,
         }),
       });

       if (!response.ok) throw new Error('Failed to update rating');
       
       const result = await response.json();
       setUserBooks(userBooks.map(b => b.id === userBookId ? result.book : b));
     } catch (error) {
       console.error('Error updating rating:', error);
       alert('Failed to update rating');
     }
   };

  const shelfStats = shelves.map(shelf => ({
    ...shelf,
    count: userBooks.filter(b => b.status === shelf.id).length,
  }));

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'WANT_TO_READ':
        return <BookMarked className="w-4 h-4 text-blue-500" />;
      case 'CURRENTLY_READING':
        return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'READ':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'DNF':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'WANT_TO_READ':
        return 'Want to Read';
      case 'CURRENTLY_READING':
        return 'Reading';
      case 'READ':
        return 'Read';
      case 'DNF':
        return 'Did Not Finish';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your books</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <BookOpen className="w-12 h-12 text-[#018283]" />
          </div>
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Books</h1>
          <p className="text-gray-600">Manage and organize your reading library</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {shelfStats.map(shelf => (
            <div key={shelf.id} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-3xl font-bold text-[#018283]">{shelf.count}</div>
              <div className="text-sm text-gray-600">{shelf.label}</div>
            </div>
          ))}
        </div>

        {/* Shelf Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {shelves.map(shelf => (
            <button
              key={shelf.id}
              onClick={() => setSelectedShelf(shelf.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                selectedShelf === shelf.id
                  ? 'border-[#018283] text-[#018283]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {shelf.label}
              <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full">
                {shelfStats.find(s => s.id === shelf.id)?.count || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent text-gray-900"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent"
          >
            <option value="date-added">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Books List */}
         <div className="bg-white rounded-lg border border-gray-200">
           {filteredBooks.length > 0 ? (
             <div className="w-full">
               <table className="w-full">
                 <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date Started</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date Finished</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {paginatedBooks.map((userBook, idx) => (
                    <tr key={userBook.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                       <td className="px-6 py-4">
                         <Link
                           href={`/books/${userBook.books?.isbn || userBook.book_id}`}
                           className="text-[#018283] hover:underline font-medium flex items-center gap-3"
                         >
                           {userBook.books?.cover_url ? (
                             <img
                               src={userBook.books.cover_url}
                               alt={userBook.books.title}
                               className="w-8 h-12 object-cover rounded"
                             />
                           ) : (
                             <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                               <BookOpen className="w-4 h-4 text-gray-400" />
                             </div>
                           )}
                           <span>{userBook.books?.title}</span>
                         </Link>
                       </td>
                       <td className="px-6 py-4 text-gray-700">{userBook.books?.author}</td>
                        <td className="px-6 py-4">
                          <div 
                            className="flex items-center gap-1 cursor-pointer"
                            onMouseEnter={() => setRatingHoverId(userBook.id)}
                            onMouseLeave={() => setRatingHoverId(null)}
                          >
                            <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star
                                   key={star}
                                   onClick={() => handleUpdateRating(userBook.id, star)}
                                   className={`w-4 h-4 cursor-pointer transition-all ${
                                     ratingHoverId === userBook.id
                                       ? star <= (userBook.rating || 0)
                                         ? 'text-yellow-400 fill-current'
                                         : 'text-gray-300 hover:text-yellow-300'
                                       : star <= (userBook.rating || 0)
                                       ? 'text-yellow-400 fill-current'
                                       : 'text-gray-300'
                                   }`}
                                 />
                               ))}
                             </div>
                          </div>
                        </td>
                       <td className="px-6 py-4 text-gray-500 text-sm">
                         {userBook.started_at ? new Date(userBook.started_at).toLocaleDateString() : '-'}
                       </td>
                       <td className="px-6 py-4 text-gray-500 text-sm">
                         {userBook.completed_at ? new Date(userBook.completed_at).toLocaleDateString() : '-'}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 relative z-20">
                           <div className="relative">
                             <button
                               onClick={() => setOpenDropdownId(openDropdownId === userBook.id ? null : userBook.id)}
                               className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-[#2CAED8] transition-all duration-200"
                             >
                               <StatusIcon status={userBook.status} />
                               <span className="text-sm font-medium text-gray-900">
                                 {getStatusDisplay(userBook.status)}
                               </span>
                               <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${openDropdownId === userBook.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                               </svg>
                             </button>
                             
                             {openDropdownId === userBook.id && (
                               <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                 {[
                                   { value: 'WANT_TO_READ', label: 'Want to Read', color: 'text-blue-600', bgColor: 'bg-blue-50' },
                                   { value: 'CURRENTLY_READING', label: 'Currently Reading', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
                                   { value: 'READ', label: 'Read', color: 'text-purple-600', bgColor: 'bg-purple-50' },
                                   { value: 'DNF', label: 'Did Not Finish', color: 'text-red-600', bgColor: 'bg-red-50' }
                                 ].map((status) => (
                                   <button
                                     key={status.value}
                                     onClick={() => {
                                       handleUpdateStatus(userBook.id, status.value);
                                       setOpenDropdownId(null);
                                     }}
                                     className={`w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors ${
                                       userBook.status === status.value ? status.bgColor : ''
                                     }`}
                                   >
                                     <StatusIcon status={status.value} />
                                     <span className={`font-medium ${
                                       userBook.status === status.value ? status.color : 'text-gray-700'
                                     }`}>
                                       {status.label}
                                     </span>
                                     {userBook.status === status.value && (
                                       <CheckCircle className="w-4 h-4 text-[#018283] ml-auto" />
                                     )}
                                   </button>
                                 ))}
                               </div>
                             )}
                           </div>
                           
                           <button
                             onClick={() => handleDeleteBook(userBook.id)}
                             className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group flex-shrink-0"
                             title="Delete book"
                           >
                             <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
           ) : (
             <div className="text-center py-16">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                 <BookOpen className="w-10 h-10 text-gray-400" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-3">No books on this shelf yet</h3>
               <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                 {selectedShelf === 'WANT_TO_READ' 
                   ? "Start building your reading list by discovering books"
                   : selectedShelf === 'CURRENTLY_READING'
                   ? "Begin a book to add it to your currently reading shelf"
                   : selectedShelf === 'READ'
                   ? "Mark books as read to see them here"
                   : "Books you haven't finished will appear here"}
               </p>
                <Link
                  href="/discover"
                  className="inline-block px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors font-medium"
                >
                  Discover Books
                </Link>
             </div>
           )}
        </div>

        {/* Pagination Controls */}
        {filteredBooks.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-[#018283] text-white border-[#018283] font-semibold'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
