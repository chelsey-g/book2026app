import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface BookData {
  name: string
  author: string
  status: string
  rating?: number
  dateStarted?: string
  dateFinished?: string
  type?: string
  cover?: string
  apiId?: string
  description?: string
  publishedDate?: string
  publisher?: string
  categories?: string[]
  year?: number
}

async function searchBookAPI(title: string, author: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/books/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.books?.[0] || null
  } catch (error) {
    console.error('Error searching book API:', error)
    return null
  }
}

function parseDate(dateString: string | undefined, year: number): string | null {
  if (!dateString || dateString.trim() === '') return null

  try {
    const cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/g, '$1')
    
    const dateWithYear = `${cleanedDate} ${year}`
    const parsed = new Date(dateWithYear)
    
    if (isNaN(parsed.getTime())) {
      console.warn(`Could not parse date: "${dateString}"`)
      return null
    }
    
    return parsed.toISOString()
  } catch (error) {
    console.warn(`Error parsing date "${dateString}":`, error)
    return null
  }
}

async function findOrCreateBook(supabase: any, bookData: BookData) {
  const { data: existingBook } = await supabase
    .from('books')
    .select('*')
    .eq('title', bookData.name)
    .eq('author', bookData.author)
    .single()

  if (existingBook) {
    return existingBook.id
  }

  let pageCount = null
  
  if (!bookData.apiId) {
    const apiResult = await searchBookAPI(bookData.name, bookData.author)
    if (apiResult) {
      bookData.apiId = apiResult.id
      bookData.cover = apiResult.coverUrl || apiResult.cover_url || apiResult.imageUrl
      bookData.description = apiResult.description
      bookData.publishedDate = apiResult.publishedDate || apiResult.published_date
      bookData.publisher = apiResult.publisher
      bookData.categories = apiResult.genres || apiResult.categories
      pageCount = apiResult.pageCount || null
    }
  }

  const { data: newBook, error } = await supabase
    .from('books')
    .insert({
      title: bookData.name,
      author: bookData.author,
      description: bookData.description || '',
      cover_url: bookData.cover || null,
      page_count: pageCount,
      genres: bookData.categories || [],
      published_date: bookData.publishedDate || null,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create book: ${error.message}`)
  }

  return newBook.id
}

async function createOrUpdateUserBook(supabase: any, userId: string, bookId: string, bookData: BookData) {
  const { data: existingUserBook } = await supabase
    .from('user_books')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single()

  const year = bookData.year || new Date().getFullYear()

  const userBookData = {
    status: bookData.status,
    rating: bookData.rating || null,
    started_at: parseDate(bookData.dateStarted, year),
    completed_at: parseDate(bookData.dateFinished, year),
  }

  if (existingUserBook) {
    const { error } = await supabase
      .from('user_books')
      .update(userBookData)
      .eq('user_id', userId)
      .eq('book_id', bookId)

    if (error) {
      throw new Error(`Failed to update user book: ${error.message}`)
    }
  } else {
    const { error } = await supabase
      .from('user_books')
      .insert({
        user_id: userId,
        book_id: bookId,
        ...userBookData,
      })

    if (error) {
      throw new Error(`Failed to create user book: ${error.message}`)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booksToImport: BookData[] = await request.json()

    console.log('📥 Received books to import:', booksToImport.length)
    console.log('📥 First book:', booksToImport[0])
    console.log('👤 User ID:', user.id)

    if (!Array.isArray(booksToImport)) {
      return NextResponse.json(
        { error: 'Invalid request body: expected array of books' },
        { status: 400 }
      )
    }

    let successCount = 0
    const errors: Array<{ book: string; error: string }> = []

    for (const bookData of booksToImport) {
      try {
        console.log(`🔍 Processing: "${bookData.name}" by "${bookData.author}"`)
        
        if (!bookData.name || !bookData.author) {
          throw new Error('Missing required fields: name and author')
        }

        const bookId = await findOrCreateBook(supabase, bookData)
        console.log(`✅ Book created/found with ID: ${bookId}`)

        await createOrUpdateUserBook(supabase, user.id, bookId, bookData)
        console.log(`✅ User-book entry created`)

        successCount++
      } catch (error) {
        console.error(`❌ Error processing book "${bookData.name}":`, error)
        errors.push({
          book: bookData.name || 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    console.log(`📊 Import complete: ${successCount}/${booksToImport.length} succeeded`)

    return NextResponse.json({
      success: true,
      importedCount: successCount,
      totalBooks: booksToImport.length,
      errors: errors
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
