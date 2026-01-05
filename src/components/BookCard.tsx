import { BookOpen, Star } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'READ';
  progress?: number;
}

interface BookCardProps {
  book: Book;
  variant?: 'list' | 'grid';
  onClick?: () => void;
}

export default function BookCard({ book, variant = 'list', onClick }: BookCardProps) {
  if (variant === 'grid') {
    return (
      <div onClick={onClick} className="group cursor-pointer">
        <div className="relative mb-3 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
          {book.cover ? (
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div data-testid="book-placeholder" className="aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white/60" />
            </div>
          )}
        </div>
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
          {book.title}
        </h4>
        <p className="text-xs text-gray-600 mb-2">{book.author}</p>
        {book.rating && (
          <div className="flex items-center justify-center space-x-1">
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  data-testid="star"
                  className={`h-3 w-3 ${i < book.rating! ? 'fill-yellow-400' : ''}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div onClick={onClick} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
      <div className="flex-shrink-0 relative">
        {book.cover ? (
          <div className="w-12 h-18 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover rounded-lg" />
          </div>
        ) : (
          <div data-testid="book-placeholder-list" className="w-12 h-18 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="h-6 w-6 text-white/80" />
          </div>
        )}
        {book.status === 'CURRENTLY_READING' && book.progress && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${book.progress}%` }}
            />
          </div>
        )}
        {book.status === 'CURRENTLY_READING' && !book.progress && (
          <div data-testid="reading-indicator" className="absolute -top-2 -right-2 h-4 w-4 bg-teal-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 mb-1">
          {book.title}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        {book.status === 'CURRENTLY_READING' && book.progress && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{book.progress}% complete</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                   key={i}
                   data-testid="progress-dot"
                   className={`w-1.5 h-1.5 rounded-full ${
                     book.progress && i < Math.floor(book.progress / 20) ? 'bg-teal-600' : 'bg-gray-300'
                   }`}
                 />
              ))}
            </div>
          </div>
        )}
        {book.rating && (
          <div className="flex items-center mt-2 space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  data-testid="star"
                  className={`h-4 w-4 ${i < book.rating! ? 'fill-yellow-400' : ''}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">{book.rating}/5</span>
          </div>
        )}
      </div>
    </div>
  );
}
