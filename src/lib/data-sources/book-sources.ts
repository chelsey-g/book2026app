import axios from 'axios';

async function fetchCoverFromAbeBooks(isbn: string): Promise<string | null> {
  try {
    const url = `https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`;
    const response = await axios.head(url);
    if (response.status === 200) return url;
    return null;
  } catch {
    return null;
  }
}

async function fetchCoverFromOpenLibrarySearch(title: string, author: string): Promise<string | null> {
  try {
    const query = `${title} ${author}`.trim();
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=cover_i`
    );
    const coverId = response.data?.docs?.[0]?.cover_i;
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  } catch {
    return null;
  }
}

export async function findBookCover(isbn?: string, title?: string, author?: string): Promise<string | null> {
  if (isbn) {
    const abeCover = await fetchCoverFromAbeBooks(isbn);
    if (abeCover) return abeCover;
  }

  if (title) {
    return fetchCoverFromOpenLibrarySearch(title, author || '');
  }
  return null;
}

export async function searchBooksOpenLibrary(query: string, limit = 20) {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    const books = response.data.docs.map((book: any) => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      isbn: book.isbn?.[0],
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      publishedDate: book.first_publish_year,
      pageCount: book.number_of_pages_median,
      description: null, // Open Library doesn't typically provide descriptions
    }));
    const results = await Promise.all(
      books.map(async (book: any) => {
        if (!book.coverUrl) {
          book.coverUrl = await findBookCover(book.isbn, book.title, book.author);
        }
        return book;
      })
    );
    return results;
  } catch (error) {
    console.error('Open Library search error:', error);
    return [];
  }
}

export async function searchBooksGoogleAI(query: string, limit = 20) {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}`);
    if (!response.data.items || !Array.isArray(response.data.items)) {
      return [];
    }
    const books = response.data.items.map((book: any) => ({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0] || 'Unknown Author',
      isbn: book.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier
        || book.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier,
      coverUrl: book.volumeInfo.imageLinks?.thumbnail,
      publishedDate: book.volumeInfo.publishedDate,
      pageCount: book.volumeInfo.pageCount,
      description: book.volumeInfo.description,
    }));
    const results = await Promise.all(
      books.map(async (book: any) => {
        if (!book.coverUrl) {
          book.coverUrl = await findBookCover(book.isbn, book.title, book.author);
        }
        return book;
      })
    );
    return results;
  } catch (error) {
    console.error('Google Books search error:', error);
    return [];
  }
}

export async function searchBooks(query: string, limit = 20) {
  // Try Google Books first since it has better metadata (descriptions, page counts, etc.)
  const googleResults = await searchBooksGoogleAI(query, limit);

  if (googleResults.length > 0) {
    return googleResults;
  }

  // Fallback to Open Library if Google Books returns nothing
  return searchBooksOpenLibrary(query, limit);
}