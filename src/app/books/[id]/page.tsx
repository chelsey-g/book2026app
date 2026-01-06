'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Star, Plus, CheckCircle } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: number;
}

interface Review {
  id: string;
  rating: number;
  content?: string;
  user: {
    name?: string;
    username?: string;
    image?: string;
  };
  createdAt: string;
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [bookId, setBookId] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, content: '' });
  const [userBookStatus, setUserBookStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    params.then(({ id }) => {
      setBookId(id);
    });
  }, [params]);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
      fetchBookReviews();
    }
  }, [bookId]);

   useEffect(() => {
     filterAndSortReviews();
   }, [reviews, ratingFilter, sortBy]);

   const filterAndSortReviews = () => {
     let filtered = reviews;

     if (ratingFilter > 0) {
       filtered = filtered.filter(r => r.rating >= ratingFilter);
     }

     let sorted = [...filtered];
     if (sortBy === 'highest') {
       sorted.sort((a, b) => b.rating - a.rating);
     } else if (sortBy === 'lowest') {
       sorted.sort((a, b) => a.rating - b.rating);
     } else {
       sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
     }

     setFilteredReviews(sorted);
   };

   const getAverageRating = (): number => {
     if (reviews.length === 0) return 0;
     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
     return parseFloat((sum / reviews.length).toFixed(1));
   };

   const fetchBookDetails = async () => {
     try {
       const response = await fetch(`/api/books/${bookId}`);
       const data = await response.json();
       
       if (!response.ok) {
         throw new Error(data.error || 'Failed to fetch book details');
       }

       setBook(data.book);

       // Check if user has this book in their list
       if (user) {
         const userBooksResponse = await fetch('/api/users/books');
         const userBooksData = await userBooksResponse.json();
         
          const existingBook = userBooksData.books.find((b: any) => b.books?.isbn === bookId || b.book_id === bookId);
         if (existingBook) {
           setUserBookStatus(existingBook.status);
         }
       }
     } catch (error) {
       console.error('Error fetching book details:', error);
     }
   };

   const fetchBookReviews = async () => {
     try {
       const response = await fetch(`/api/reviews?bookId=${bookId}`);
       const data = await response.json();
       
       if (response.ok && data.reviews) {
         setReviews(data.reviews);
       }
     } catch (error) {
       console.error('Error fetching reviews:', error);
     } finally {
       setLoading(false);
     }
   };

   const handleAddToList = async (status: string) => {
     if (!user) {
       alert('Please sign in to add books to your list');
       return;
     }

     if (!book) {
       alert('Book information not loaded');
       return;
     }

     try {
       const response = await fetch('/api/users/books', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
        },
         body: JSON.stringify({
           bookId: book.isbn || book.id,
           title: book.title,
           author: book.author,
           description: book.description,
           coverUrl: book.coverUrl,
           isbn: book.isbn,
           pageCount: book.pageCount,
           publishedDate: book.publishedDate,
           status,
         }),
       });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.error || 'Failed to add book');
       }

       setUserBookStatus(status);
       alert(`Book added to ${status.toLowerCase().replace(/_/g, ' ')} list`);
     } catch (error) {
       console.error('Error adding book:', error);
       alert('Failed to add book. Please try again.');
     }
   };

   const handleSubmitReview = async (e: React.FormEvent) => {
     e.preventDefault();

     if (!user) {
       alert('Please sign in to submit a review');
       return;
     }

     if (newReview.rating === 0) {
       alert('Please select a rating');
       return;
     }

     if (!book) {
       alert('Book information not loaded');
       return;
     }

     try {
       const response = await fetch('/api/reviews', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           bookId: book.isbn || book.id,
           rating: newReview.rating,
           content: newReview.content,
         }),
       });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.error || 'Failed to submit review');
       }

       setReviews([data.review, ...reviews]);
       setNewReview({ rating: 0, content: '' });
       alert('Review submitted successfully!');
     } catch (error) {
       console.error('Error submitting review:', error);
       alert('Failed to submit review. Please try again.');
     }
   };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-gray-400" />
              </div>
            )}

            {user && (
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => handleAddToList('WANT_TO_READ')}
                  disabled={userBookStatus === 'WANT_TO_READ'}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md transition-colors ${
                    userBookStatus === 'WANT_TO_READ'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Want to Read</span>
                </button>

                <button
                  onClick={() => handleAddToList('CURRENTLY_READING')}
                  disabled={userBookStatus === 'CURRENTLY_READING'}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md transition-colors ${
                    userBookStatus === 'CURRENTLY_READING'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Currently Reading</span>
                </button>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

            {book.publishedDate && (
              <p className="text-sm text-gray-500 mb-2">
                Published: {book.publishedDate}
              </p>
            )}

            {book.pageCount && (
              <p className="text-sm text-gray-500 mb-4">
                {book.pageCount} pages
              </p>
            )}

            {book.description && (
              <div className="prose max-w-none mb-8">
                <p>{book.description}</p>
              </div>
            )}

             {/* Review Section */}
             <div className="mt-8">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                   {reviews.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                         <div className="flex">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <Star
                               key={star}
                               className={`h-5 w-5 ${
                                 star <= Math.round(getAverageRating())
                                   ? 'text-yellow-400 fill-current'
                                   : 'text-gray-300'
                               }`}
                             />
                           ))}
                         </div>
                        <span className="text-gray-600">({reviews.length} reviews)</span>
                      </div>
                   )}
                 </div>
               </div>

               {reviews.length > 0 && (
                 <div className="mb-6 flex gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
                     <select
                       value={ratingFilter}
                       onChange={(e) => setRatingFilter(parseInt(e.target.value))}
                       className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value={0}>All ratings</option>
                       <option value={5}>5 stars</option>
                       <option value={4}>4+ stars</option>
                       <option value={3}>3+ stars</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                     <select
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                       className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value="recent">Most Recent</option>
                       <option value="highest">Highest Rated</option>
                       <option value="lowest">Lowest Rated</option>
                     </select>
                   </div>
                 </div>
               )}

              {user && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            newReview.rating >= star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">
                      Review (Optional)
                    </label>
                    <textarea
                      id="review-content"
                      value={newReview.content}
                      onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts about this book"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Submit Review
                  </button>
                </form>
              )}

               {filteredReviews.length === 0 ? (
                 <div className="text-center bg-white rounded-lg shadow p-8">
                   <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-600">{reviews.length === 0 ? 'No reviews yet. Be the first to review!' : 'No reviews match your filter.'}</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {filteredReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex space-x-1 mr-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                review.rating >= star
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {review.content && (
                        <p className="text-gray-700 mb-4">{review.content}</p>
                      )}

                      <div className="flex items-center space-x-3">
                        {review.user.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.name || 'User'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600">
                            {review.user.name?.[0] || 'U'}
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {review.user.name || review.user.username || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}