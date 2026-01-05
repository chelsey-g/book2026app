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
"[project]/book-tracker-app/src/lib/supabase/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUser",
    ()=>getUser,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://ipyvwuvdtpefyplpfdjr.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXZ3dXZkdHBlZnlwbHBmZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjM4MjUsImV4cCI6MjA4MzE5OTgyNX0.ehla9b4usZxHEsAKgI13UcQVfOxKQgzr1KM2u_SnweQ");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const getUser = async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/book-tracker-app/src/lib/data-sources/book-sources.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "searchBooks",
    ()=>searchBooks,
    "searchBooksGoogleAI",
    ()=>searchBooksGoogleAI,
    "searchBooksOpenLibrary",
    ()=>searchBooksOpenLibrary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/axios/lib/axios.js [app-route] (ecmascript)");
;
async function searchBooksOpenLibrary(query, limit = 20) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data.docs.map((book)=>({
                title: book.title,
                author: book.author_name?.[0] || 'Unknown Author',
                isbn: book.isbn?.[0],
                coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
                publishedDate: book.first_publish_year,
                pageCount: book.number_of_pages_median,
                description: null
            }));
    } catch (error) {
        console.error('Open Library search error:', error);
        return [];
    }
}
async function searchBooksGoogleAI(query, limit = 20) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}`);
        return response.data.items.map((book)=>({
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.[0] || 'Unknown Author',
                isbn: book.volumeInfo.industryIdentifiers?.find((id)=>id.type === 'ISBN_13')?.identifier,
                coverUrl: book.volumeInfo.imageLinks?.thumbnail,
                publishedDate: book.volumeInfo.publishedDate,
                pageCount: book.volumeInfo.pageCount,
                description: book.volumeInfo.description
            }));
    } catch (error) {
        console.error('Google Books search error:', error);
        return [];
    }
}
async function searchBooks(query, limit = 20) {
    const openLibraryResults = await searchBooksOpenLibrary(query, limit);
    if (openLibraryResults.length > 0) {
        return openLibraryResults;
    }
    return searchBooksGoogleAI(query, limit);
}
}),
"[project]/book-tracker-app/src/app/api/recommendations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/src/lib/supabase/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$data$2d$sources$2f$book$2d$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/src/lib/data-sources/book-sources.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    const authHeader = request.headers.get('Authorization');
    try {
        let userId = null;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const tempSupabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://ipyvwuvdtpefyplpfdjr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXZ3dXZkdHBlZnlwbHBmZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjM4MjUsImV4cCI6MjA4MzE5OTgyNX0.ehla9b4usZxHEsAKgI13UcQVfOxKQgzr1KM2u_SnweQ"), {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            });
            const { data: { user } } = await tempSupabase.auth.getUser();
            userId = user?.id || null;
        }
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                recommendations: []
            });
        }
        const { data: userBooksData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('user_books').select('*, books(*)').eq('user_id', userId);
        if (error) {
            throw new Error('Failed to fetch user books for recommendations');
        }
        const userBooks = userBooksData || [];
        const userReadBooks = userBooks.filter((book)=>book.status === 'READ');
        if (userReadBooks.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                recommendations: []
            });
        }
        const allAuthors = userReadBooks.map((book)=>book.books?.author || 'Unknown');
        const authorCounts = allAuthors.reduce((acc, author)=>{
            acc[author] = (acc[author] || 0) + 1;
            return acc;
        }, {});
        const topAuthors = Object.entries(authorCounts).sort(([, a], [, b])=>b - a).slice(0, 5).map(([author])=>author);
        const recommendedBooks = [];
        for (const author of topAuthors){
            try {
                const books = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$data$2d$sources$2f$book$2d$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchBooks"])(author, 3);
                recommendedBooks.push(...books);
            } catch (error) {
                console.error(`Error fetching books for author ${author}:`, error);
            }
        }
        const genreResults = await Promise.all(userReadBooks.filter((book)=>book.books?.genres?.length > 0).map(async (book)=>{
            const primaryGenre = book.books?.genres?.[0];
            if (!primaryGenre) return [];
            try {
                const genreBooks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$data$2d$sources$2f$book$2d$sources$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchBooks"])(primaryGenre, 3);
                return genreBooks.filter((b)=>b.author !== book.books?.author && b.isbn !== book.books?.isbn && !recommendedBooks.find((rb)=>rb.isbn === b.isbn)).slice(0, 2);
            } catch (error) {
                console.error(`Error fetching books for genre ${primaryGenre}:`, error);
                return [];
            }
        }));
        const genreBasedRecommendations = genreResults.flatMap((x)=>x).slice(0, 5);
        const allRecommendations = [
            ...recommendedBooks,
            ...genreBasedRecommendations
        ];
        const uniqueRecommendations = allRecommendations.filter((book, index, self)=>self.findIndex((b)=>b.isbn === book.isbn) === index);
        const bookRecommendations = uniqueRecommendations.map((book)=>({
                ...book,
                type: 'personalized'
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            recommendations: bookRecommendations.slice(0, 12),
            count: bookRecommendations.length
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch recommendations'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9121787d._.js.map