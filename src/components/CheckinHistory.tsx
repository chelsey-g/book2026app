'use client';

import { BookOpen, Calendar, Trash2 } from 'lucide-react';

interface Checkin {
  id: string;
  book_id: string;
  pages_read: number;
  checkin_date: string;
  mood: string | null;
  books: {
    id: string;
    title: string;
    author: string;
    cover_url: string | null;
  };
}

interface CheckinHistoryProps {
  checkins: Checkin[];
  onDeleteCheckin?: (id: string) => void;
  isDeleting?: string | null;
}

const MOOD_EMOJI: Record<string, string> = {
  excited: '🤩',
  thoughtful: '🤔',
  sad: '😢',
  confused: '😕',
  inspired: '✨',
  bored: '😴',
};

const MOOD_LABEL: Record<string, string> = {
  excited: 'Excited',
  thoughtful: 'Thoughtful',
  sad: 'Sad',
  confused: 'Confused',
  inspired: 'Inspired',
  bored: 'Bored',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
}

// Group checkins by date
function groupByDate(checkins: Checkin[]): Map<string, Checkin[]> {
  const grouped = new Map<string, Checkin[]>();

  for (const checkin of checkins) {
    const date = checkin.checkin_date;
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(checkin);
  }

  return grouped;
}

export default function CheckinHistory({
  checkins,
  onDeleteCheckin,
  isDeleting,
}: CheckinHistoryProps) {
  if (checkins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No check-ins yet</p>
        <p className="text-sm text-gray-500 mt-1">Start logging your reading to see your history</p>
      </div>
    );
  }

  const groupedCheckins = groupByDate(checkins);

  return (
    <div className="space-y-6">
      {Array.from(groupedCheckins.entries()).map(([date, dateCheckins]) => (
        <div key={date}>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(date)}
          </h4>
          <div className="space-y-3">
            {dateCheckins.map((checkin) => (
              <div
                key={checkin.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group"
              >
                {/* Book Cover */}
                {checkin.books?.cover_url ? (
                  <img
                    src={checkin.books.cover_url}
                    alt={checkin.books.title}
                    className="w-12 h-18 object-cover rounded-lg shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-18 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {checkin.books?.title || 'Unknown Book'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {checkin.books?.author || 'Unknown Author'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-sm text-teal-700 bg-teal-50 px-2 py-1 rounded-md font-medium">
                      {checkin.pages_read} pages
                    </span>
                    {checkin.mood && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <span>{MOOD_EMOJI[checkin.mood]}</span>
                        <span>{MOOD_LABEL[checkin.mood]}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                {onDeleteCheckin && (
                  <button
                    onClick={() => onDeleteCheckin(checkin.id)}
                    disabled={isDeleting === checkin.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                    title="Delete check-in"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
