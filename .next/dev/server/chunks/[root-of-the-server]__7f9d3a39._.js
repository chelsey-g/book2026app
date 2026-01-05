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
"[project]/book-tracker-app/src/app/api/statistics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.substring(7);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://ipyvwuvdtpefyplpfdjr.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweXZ3dXZkdHBlZnlwbHBmZGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjM4MjUsImV4cCI6MjA4MzE5OTgyNX0.ehla9b4usZxHEsAKgI13UcQVfOxKQgzr1KM2u_SnweQ"), {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        const { data, error: booksError } = await supabase.from('user_books').select(`
        id,
        rating,
        completed_at,
        status,
        books (
          id,
          title,
          author,
          genres,
          page_count
        )
      `).eq('user_id', user.id).eq('status', 'READ').order('completed_at', {
            ascending: false
        });
        if (booksError) throw booksError;
        // Cast the data, accounting for Supabase's response format
        const userBooks = data || [];
        if (!userBooks || userBooks.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                yearlyTrends: generateEmptyMonths(),
                genreBreakdown: [],
                readingStreak: 0,
                topRatedBooks: [],
                totalBooksRead: 0,
                totalPagesRead: 0,
                averageRating: 0,
                thisMonthBooks: 0,
                thisYearBooks: 0
            });
        }
        const yearlyBooks = userBooks.filter((ub)=>ub.completed_at && new Date(ub.completed_at).getFullYear() === currentYear);
        const thisMonthBooks = userBooks.filter((ub)=>{
            if (!ub.completed_at) return false;
            const completed = new Date(ub.completed_at);
            return completed.getFullYear() === currentYear && completed.getMonth() === currentDate.getMonth();
        });
        const yearlyTrends = generateMonthlyTrends(yearlyBooks);
        const genreBreakdown = generateGenreBreakdown(userBooks);
        const readingStreak = calculateReadingStreak(userBooks);
        const topRatedBooks = getTopRatedBooks(userBooks, 5);
        const totalPagesRead = userBooks.reduce((sum, ub)=>sum + (ub.books?.page_count || 0), 0);
        const averageRating = userBooks.length > 0 ? userBooks.reduce((sum, ub)=>sum + (ub.rating || 0), 0) / userBooks.length : 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            yearlyTrends,
            genreBreakdown,
            readingStreak,
            topRatedBooks,
            totalBooksRead: userBooks.length,
            totalPagesRead,
            averageRating: Math.round(averageRating * 10) / 10,
            thisMonthBooks: thisMonthBooks.length,
            thisYearBooks: yearlyBooks.length
        });
    } catch (error) {
        console.error('Statistics error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch statistics'
        }, {
            status: 500
        });
    }
}
function generateEmptyMonths() {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return monthNames.map((month)=>({
            month,
            booksRead: 0,
            pagesRead: 0
        }));
}
function generateMonthlyTrends(books) {
    const monthlyData = {};
    for(let i = 0; i < 12; i++){
        monthlyData[i] = {
            books: 0,
            pages: 0
        };
    }
    books.forEach((userBook)=>{
        if (userBook.completed_at) {
            const month = new Date(userBook.completed_at).getMonth();
            monthlyData[month].books += 1;
            monthlyData[month].pages += userBook.books?.page_count || 0;
        }
    });
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return monthNames.map((month, index)=>({
            month,
            booksRead: monthlyData[index].books,
            pagesRead: monthlyData[index].pages
        }));
}
function generateGenreBreakdown(books) {
    const genreCounts = {};
    books.forEach((userBook)=>{
        if (userBook.books?.genres && Array.isArray(userBook.books.genres)) {
            userBook.books.genres.forEach((genre)=>{
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        }
    });
    const total = Object.values(genreCounts).reduce((sum, count)=>sum + count, 0);
    if (total === 0) return [];
    return Object.entries(genreCounts).map(([genre, count])=>({
            genre,
            count,
            percentage: Math.round(count / total * 100)
        })).sort((a, b)=>b.count - a.count).slice(0, 8);
}
function calculateReadingStreak(books) {
    if (books.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedBooks = [
        ...books
    ].sort((a, b)=>{
        const dateA = a.completed_at ? new Date(a.completed_at) : new Date(0);
        const dateB = b.completed_at ? new Date(b.completed_at) : new Date(0);
        return dateB.getTime() - dateA.getTime();
    });
    const currentDate = new Date(today);
    for (const book of sortedBooks){
        if (!book.completed_at) continue;
        const bookDate = new Date(book.completed_at);
        bookDate.setHours(0, 0, 0, 0);
        if (bookDate.getTime() === currentDate.getTime()) {
            streak += 1;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (bookDate.getTime() < currentDate.getTime()) {
            break;
        }
    }
    return streak;
}
function getTopRatedBooks(books, limit = 5) {
    return books.filter((ub)=>ub.rating && ub.rating > 0).sort((a, b)=>(b.rating || 0) - (a.rating || 0)).slice(0, limit).map((ub)=>({
            title: ub.books?.title || 'Unknown',
            rating: ub.rating || 0,
            author: ub.books?.author || 'Unknown'
        }));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f9d3a39._.js.map