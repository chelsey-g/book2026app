import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { searchBooksOpenLibrary, searchBooksGoogleAI, searchBooks } from '@/lib/data-sources/book-sources';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedAxiosGet = axios.get as ReturnType<typeof vi.fn>;

describe('Book Search Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchBooksOpenLibrary', () => {
    it('returns formatted book data from Open Library API', async () => {
      const mockResponse = {
        data: {
          docs: [
            {
              title: 'Test Book',
              author_name: ['Test Author'],
              isbn: ['1234567890'],
              cover_i: 12345,
              first_publish_year: 2020,
              number_of_pages_median: 300,
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksOpenLibrary('test query', 10);

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=test%20query&limit=10'
      );

      expect(result).toEqual([
        {
          title: 'Test Book',
          author: 'Test Author',
          isbn: '1234567890',
          coverUrl: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
          publishedDate: 2020,
          pageCount: 300,
          description: null,
        },
      ]);
    });

    it('handles missing author gracefully', async () => {
      const mockResponse = {
        data: {
          docs: [
            {
              title: 'Test Book',
              // No author_name
              isbn: ['1234567890'],
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksOpenLibrary('test query');

      expect(result[0].author).toBe('Unknown Author');
    });

    it('handles API errors gracefully', async () => {
      mockedAxiosGet.mockRejectedValue(new Error('API Error'));

      const result = await searchBooksOpenLibrary('test query');

      expect(result).toEqual([]);
    });

    it('returns empty array when no docs', async () => {
      const mockResponse = {
        data: {
          docs: [],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksOpenLibrary('test query');

      expect(result).toEqual([]);
    });
  });

  describe('searchBooksGoogleAI', () => {
    it('returns formatted book data from Google Books API', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              volumeInfo: {
                title: 'Test Book',
                authors: ['Test Author'],
                industryIdentifiers: [
                  { type: 'ISBN_13', identifier: '1234567890123' },
                ],
                imageLinks: {
                  thumbnail: 'http://example.com/thumb.jpg',
                },
                publishedDate: '2020-01-01',
                pageCount: 250,
                description: 'A test book description',
              },
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksGoogleAI('test query', 10);

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes?q=test%20query&maxResults=10'
      );

      expect(result).toEqual([
        {
          title: 'Test Book',
          author: 'Test Author',
          isbn: '1234567890123',
          coverUrl: 'http://example.com/thumb.jpg',
          publishedDate: '2020-01-01',
          pageCount: 250,
          description: 'A test book description',
        },
      ]);
    });

    it('handles missing optional fields gracefully', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              volumeInfo: {
                title: 'Test Book',
                // No authors, industryIdentifiers, imageLinks, etc.
              },
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksGoogleAI('test query');

      expect(result).toEqual([
        {
          title: 'Test Book',
          author: 'Unknown Author',
          isbn: undefined,
          coverUrl: undefined,
          publishedDate: undefined,
          pageCount: undefined,
          description: undefined,
        },
      ]);
    });

    it('handles API errors gracefully', async () => {
      mockedAxiosGet.mockRejectedValue(new Error('API Error'));

      const result = await searchBooksGoogleAI('test query');

      expect(result).toEqual([]);
    });

    it('returns empty array when no items', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksGoogleAI('test query');

      expect(result).toEqual([]);
    });

    it('finds ISBN_13 when available', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              volumeInfo: {
                title: 'Test Book',
                authors: ['Test Author'],
                industryIdentifiers: [
                  { type: 'ISBN_10', identifier: '1234567890' },
                  { type: 'ISBN_13', identifier: '1234567890123' },
                ],
              },
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValue(mockResponse);

      const result = await searchBooksGoogleAI('test query');

      expect(result[0].isbn).toBe('1234567890123');
    });
  });

  describe('searchBooks', () => {
    it('prefers Open Library results when available', async () => {
      const openLibraryResponse = {
        data: {
          docs: [
            {
              title: 'Open Library Book',
              author_name: ['Open Author'],
            },
          ],
        },
      };

      mockedAxiosGet.mockResolvedValueOnce(openLibraryResponse);

      const result = await searchBooks('test query');

      expect(result).toEqual([
        {
          title: 'Open Library Book',
          author: 'Open Author',
          isbn: undefined,
          coverUrl: null,
          publishedDate: undefined,
          pageCount: undefined,
          description: null,
        },
      ]);

      // Should not call Google Books API
      expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
    });

    it('falls back to Google Books when Open Library returns no results', async () => {
      const openLibraryResponse = {
        data: {
          docs: [], // No results
        },
      };

      const googleResponse = {
        data: {
          items: [
            {
              volumeInfo: {
                title: 'Google Book',
                authors: ['Google Author'],
              },
            },
          ],
        },
      };

      mockedAxiosGet
        .mockResolvedValueOnce(openLibraryResponse)
        .mockResolvedValueOnce(googleResponse);

      const result = await searchBooks('test query');

      expect(result).toEqual([
        {
          title: 'Google Book',
          author: 'Google Author',
          isbn: undefined,
          coverUrl: undefined,
          publishedDate: undefined,
          pageCount: undefined,
          description: undefined,
        },
      ]);

      // Should call both APIs
      expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
    });

    it('returns empty array when both APIs fail', async () => {
      mockedAxiosGet.mockRejectedValue(new Error('API Error'));

      const result = await searchBooks('test query');

      expect(result).toEqual([]);
    });
  });
});
