module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/book-tracker-app/src/app/api/books/bulk-import/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
async function searchBookAPI(title, author) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/books/search?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.books?.[0] || null;
    } catch (error) {
        console.error('Error searching book API:', error);
        return null;
    }
}
function parseDate(dateString) {
    if (!dateString || dateString.trim() === '') return null;
    try {
        const currentYear = new Date().getFullYear();
        const cleanedDate = dateString.replace(/(\d+)(st|nd|rd|th)/g, '$1');
        const dateWithYear = `${cleanedDate} ${currentYear}`;
        const parsed = new Date(dateWithYear);
        if (isNaN(parsed.getTime())) {
            console.warn(`Could not parse date: "${dateString}"`);
            return null;
        }
        return parsed.toISOString();
    } catch (error) {
        console.warn(`Error parsing date "${dateString}":`, error);
        return null;
    }
}
async function findOrCreateBook(supabase, bookData) {
    const { data: existingBook } = await supabase.from('books').select('*').eq('title', bookData.name).eq('author', bookData.author).single();
    if (existingBook) {
        return existingBook.id;
    }
    let pageCount = null;
    if (!bookData.apiId) {
        const apiResult = await searchBookAPI(bookData.name, bookData.author);
        if (apiResult) {
            bookData.apiId = apiResult.id;
            bookData.cover = apiResult.coverUrl || apiResult.cover_url || apiResult.imageUrl;
            bookData.description = apiResult.description;
            bookData.publishedDate = apiResult.publishedDate || apiResult.published_date;
            bookData.publisher = apiResult.publisher;
            bookData.categories = apiResult.genres || apiResult.categories;
            pageCount = apiResult.pageCount || null;
        }
    }
    const { data: newBook, error } = await supabase.from('books').insert({
        title: bookData.name,
        author: bookData.author,
        description: bookData.description || '',
        cover_url: bookData.cover || null,
        page_count: pageCount,
        genres: bookData.categories || [],
        published_date: bookData.publishedDate || null
    }).select('id').single();
    if (error) {
        throw new Error(`Failed to create book: ${error.message}`);
    }
    return newBook.id;
}
async function createOrUpdateUserBook(supabase, userId, bookId, bookData) {
    const { data: existingUserBook } = await supabase.from('user_books').select('*').eq('user_id', userId).eq('book_id', bookId).single();
    const userBookData = {
        status: bookData.status,
        rating: bookData.rating || null,
        started_at: parseDate(bookData.dateStarted),
        completed_at: parseDate(bookData.dateFinished)
    };
    if (existingUserBook) {
        const { error } = await supabase.from('user_books').update(userBookData).eq('user_id', userId).eq('book_id', bookId);
        if (error) {
            throw new Error(`Failed to update user book: ${error.message}`);
        }
    } else {
        const { error } = await supabase.from('user_books').insert({
            user_id: userId,
            book_id: bookId,
            ...userBookData
        });
        if (error) {
            throw new Error(`Failed to create user book: ${error.message}`);
        }
    }
}
async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.slice(7);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://ipyvwuvdtpefyplpfdjr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXZ3dXZkdHBlZnlwbHBmZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjM4MjUsImV4cCI6MjA4MzE5OTgyNX0.ehla9b4usZxHEsAKgI13UcQVfOxKQgzr1KM2u_SnweQ"), {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const booksToImport = await request.json();
        console.log('📥 Received books to import:', booksToImport.length);
        console.log('📥 First book:', booksToImport[0]);
        console.log('👤 User ID:', user.id);
        if (!Array.isArray(booksToImport)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid request body: expected array of books'
            }, {
                status: 400
            });
        }
        let successCount = 0;
        const errors = [];
        for (const bookData of booksToImport){
            try {
                console.log(`🔍 Processing: "${bookData.name}" by "${bookData.author}"`);
                if (!bookData.name || !bookData.author) {
                    throw new Error('Missing required fields: name and author');
                }
                const bookId = await findOrCreateBook(supabase, bookData);
                console.log(`✅ Book created/found with ID: ${bookId}`);
                await createOrUpdateUserBook(supabase, user.id, bookId, bookData);
                console.log(`✅ User-book entry created`);
                successCount++;
            } catch (error) {
                console.error(`❌ Error processing book "${bookData.name}":`, error);
                errors.push({
                    book: bookData.name || 'Unknown',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        console.log(`📊 Import complete: ${successCount}/${booksToImport.length} succeeded`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            importedCount: successCount,
            totalBooks: booksToImport.length,
            errors: errors
        });
    } catch (error) {
        console.error('Bulk import error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0970cfe9._.js.map