'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverImageProps {
  src?: string | null;
  isbn?: string | null;
  title?: string | null;
  author?: string | null;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  placeholderTestId?: string;
  iconClassName?: string;
}

function buildFallbackUrl(isbn?: string | null, title?: string | null, author?: string | null): string {
  const params = new URLSearchParams();
  if (isbn) params.set('isbn', isbn);
  if (title) params.set('title', title);
  if (author) params.set('author', author);
  return `/api/cover-fallback?${params.toString()}`;
}

export default function BookCoverImage({
  src,
  isbn,
  title,
  author,
  alt,
  className = 'w-full h-full object-cover',
  placeholderClassName = 'w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center',
  placeholderTestId,
  iconClassName = 'h-6 w-6 text-white/60',
}: BookCoverImageProps) {
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [imgBroken, setImgBroken] = useState(false);
  const [fetchKey, setFetchKey] = useState<string | null>(null);

  const currentKey = `${isbn || ''}|${title || ''}`;

  // Fetch fallback cover when there's no src (or src broke) and we have ISBN or title
  useEffect(() => {
    if (src) {
      setFallbackUrl(null);
      setImgBroken(false);
      setFetchKey(null);
      return;
    }

    if ((isbn || title) && fetchKey !== currentKey) {
      setFetchKey(currentKey);
      let cancelled = false;
      fetch(buildFallbackUrl(isbn, title, author))
        .then(res => res.json())
        .then(data => {
          if (!cancelled) setFallbackUrl(data.coverUrl || null);
        })
        .catch(() => {
          if (!cancelled) setFallbackUrl(null);
        });
      return () => { cancelled = true; };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, isbn, title, author]);

  const handleImgError = () => {
    if (!imgBroken) {
      setImgBroken(true);
      if ((isbn || title) && fetchKey !== currentKey) {
        setFetchKey(currentKey);
        fetch(buildFallbackUrl(isbn, title, author))
          .then(res => res.json())
          .then(data => setFallbackUrl(data.coverUrl || null))
          .catch(() => setFallbackUrl(null));
      }
    }
  };

  const displayUrl = (!imgBroken && src) ? src : fallbackUrl;

  if (displayUrl) {
    return (
      <img
        src={displayUrl}
        alt={alt}
        className={className}
        onError={handleImgError}
      />
    );
  }

  return (
    <div data-testid={placeholderTestId} className={placeholderClassName}>
      <BookOpen className={iconClassName} />
    </div>
  );
}
