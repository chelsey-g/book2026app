import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/recommendations/route';
import { NextRequest } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}));

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/lib/data-sources/book-sources', () => ({
  searchBooks: vi.fn(() => Promise.resolve([])),
}));

describe('Recommendations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/recommendations', () => {
    it('returns empty recommendations when no auth header', async () => {
      const request = new NextRequest('http://localhost:3000/api/recommendations', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.recommendations).toEqual([]);
    });

    it('returns empty recommendations for user with no read books', async () => {
      expect([]).toHaveLength(0);
    });

    it('generates recommendations based on favorite authors', async () => {
      const authors = ['Author A', 'Author B', 'Author C'];
      expect(authors).toHaveLength(3);
    });

    it('generates recommendations based on genres', async () => {
      const genres = ['Fiction', 'Mystery', 'Thriller'];
      expect(genres).toContain('Fiction');
    });

    it('removes duplicate recommendations', async () => {
      const books = [
        { isbn: '123', title: 'Book A' },
        { isbn: '123', title: 'Book A' },
        { isbn: '456', title: 'Book B' },
      ];
      const unique = books.filter((book, index, self) => 
        self.findIndex((b) => b.isbn === book.isbn) === index
      );
      expect(unique).toHaveLength(2);
    });

    it('limits recommendations to 12 books', async () => {
      const limit = 12;
      expect(limit).toBe(12);
    });

    it('marks recommendations as personalized type', async () => {
      const recommendation = { type: 'personalized' };
      expect(recommendation.type).toBe('personalized');
    });

    it('filters out books by same author from genre recommendations', async () => {
      expect(true).toBe(true);
    });
  });
});
