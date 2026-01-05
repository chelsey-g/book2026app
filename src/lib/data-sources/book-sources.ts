import axios from 'axios';

export async function searchBooksOpenLibrary(query: string, limit = 20) {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data.docs.map((book: any) => ({
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      isbn: book.isbn?.[0],
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      publishedDate: book.first_publish_year,
      pageCount: book.number_of_pages_median,
      description: null, // Open Library doesn't typically provide descriptions
    }));
  } catch (error) {
    console.error('Open Library search error:', error);
    return [];
  }
}

export async function searchBooksGoogleAI(query: string, limit = 20) {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}`);
    return response.data.items.map((book: any) => ({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0] || 'Unknown Author',
      isbn: book.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
      coverUrl: book.volumeInfo.imageLinks?.thumbnail,
      publishedDate: book.volumeInfo.publishedDate,
      pageCount: book.volumeInfo.pageCount,
      description: book.volumeInfo.description,
    }));
  } catch (error) {
    console.error('Google Books search error:', error);
    return [];
  }
}

export async function searchBooks(query: string, limit = 20) {
  const openLibraryResults = await searchBooksOpenLibrary(query, limit);
  
  if (openLibraryResults.length > 0) {
    return openLibraryResults;
  }
  
  return searchBooksGoogleAI(query, limit);
}