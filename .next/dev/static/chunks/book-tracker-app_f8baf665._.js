(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/book-tracker-app/src/app/my-books/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyBooksPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/src/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$marked$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookMarked$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/book-marked.js [app-client] (ecmascript) <export default as BookMarked>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function MyBooksPage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [userBooks, setUserBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredBooks, setFilteredBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedShelf, setSelectedShelf] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('WANT_TO_READ');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('date-added');
    const [openDropdownId, setOpenDropdownId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ratingHoverId, setRatingHoverId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const shelves = [
        {
            id: 'WANT_TO_READ',
            label: 'Want to Read',
            color: 'bg-blue-50'
        },
        {
            id: 'CURRENTLY_READING',
            label: 'Currently Reading',
            color: 'bg-green-50'
        },
        {
            id: 'READ',
            label: 'Read',
            color: 'bg-purple-50'
        },
        {
            id: 'DNF',
            label: 'Did Not Finish',
            color: 'bg-red-50'
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyBooksPage.useEffect": ()=>{
            if (user) {
                fetchUserBooks();
            }
        }
    }["MyBooksPage.useEffect"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyBooksPage.useEffect": ()=>{
            filterAndSortBooks();
        }
    }["MyBooksPage.useEffect"], [
        userBooks,
        selectedShelf,
        searchTerm,
        sortBy
    ]);
    const fetchUserBooks = async ()=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session?.access_token) {
                throw new Error('No authentication token available');
            }
            const response = await fetch('/api/users/books', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch books');
            const result = await response.json();
            setUserBooks(result.books || []);
        } catch (error) {
            console.error('Error fetching user books:', error);
        } finally{
            setLoading(false);
        }
    };
    const filterAndSortBooks = ()=>{
        let filtered = userBooks.filter((book)=>book.status === selectedShelf);
        if (searchTerm) {
            filtered = filtered.filter((book)=>book.books?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || book.books?.author?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        filtered.sort((a, b)=>{
            if (sortBy === 'date-added') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sortBy === 'title') {
                return (a.books?.title || '').localeCompare(b.books?.title || '');
            } else if (sortBy === 'author') {
                return (a.books?.author || '').localeCompare(b.books?.author || '');
            }
            return 0;
        });
        setFilteredBooks(filtered);
    };
    const handleDeleteBook = async (userBookId)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session?.access_token) {
                throw new Error('No authentication token available');
            }
            const response = await fetch(`/api/users/books/${userBookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete book');
            setUserBooks(userBooks.filter((b)=>b.id !== userBookId));
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        }
    };
    const handleUpdateStatus = async (userBookId, newStatus)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session?.access_token) {
                throw new Error('No authentication token available');
            }
            const response = await fetch('/api/users/books/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    userBookId,
                    status: newStatus
                })
            });
            if (!response.ok) throw new Error('Failed to update book status');
            const result = await response.json();
            setUserBooks(userBooks.map((b)=>b.id === userBookId ? result.book : b));
        } catch (error) {
            console.error('Error updating book status:', error);
            alert('Failed to update book status');
        }
    };
    const handleUpdateRating = async (userBookId, newRating)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session?.access_token) {
                throw new Error('No authentication token available');
            }
            const response = await fetch('/api/users/books/rating', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    userBookId,
                    rating: newRating
                })
            });
            if (!response.ok) throw new Error('Failed to update rating');
            const result = await response.json();
            setUserBooks(userBooks.map((b)=>b.id === userBookId ? result.book : b));
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Failed to update rating');
        }
    };
    const shelfStats = shelves.map((shelf)=>({
            ...shelf,
            count: userBooks.filter((b)=>b.status === shelf.id).length
        }));
    const StatusIcon = ({ status })=>{
        switch(status){
            case 'WANT_TO_READ':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$marked$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookMarked$3e$__["BookMarked"], {
                    className: "w-4 h-4 text-blue-500"
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 201,
                    columnNumber: 16
                }, this);
            case 'CURRENTLY_READING':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "w-4 h-4 text-emerald-500"
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 203,
                    columnNumber: 16
                }, this);
            case 'READ':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                    className: "w-4 h-4 text-purple-500"
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 205,
                    columnNumber: 16
                }, this);
            case 'DNF':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "w-4 h-4 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 207,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                    className: "w-4 h-4 text-gray-400"
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 209,
                    columnNumber: 16
                }, this);
        }
    };
    const getStatusDisplay = (status)=>{
        switch(status){
            case 'WANT_TO_READ':
                return 'Want to Read';
            case 'CURRENTLY_READING':
                return 'Reading';
            case 'READ':
                return 'Read';
            case 'DNF':
                return 'Did Not Finish';
            default:
                return status;
        }
    };
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                        className: "w-16 h-16 text-gray-400 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 mb-2",
                        children: "Please sign in"
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-6",
                        children: "You need to be signed in to view your books"
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/auth/signin",
                        className: "px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors",
                        children: "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 235,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                            className: "w-12 h-12 text-[#018283]"
                        }, void 0, false, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading your books..."
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                lineNumber: 246,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
            lineNumber: 245,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold text-gray-900 mb-2",
                                    children: "My Books"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600",
                                    children: "Manage and organize your reading library"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/import-books",
                            className: "inline-flex items-center gap-2 px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors self-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                "Import from Notion"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",
                    children: shelfStats.map((shelf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-lg border border-gray-200 p-4 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xl font-bold text-[#018283]",
                                    children: shelf.count
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600",
                                    children: shelf.label
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, shelf.id, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex space-x-4 mb-6 border-b border-gray-200",
                    children: shelves.map((shelf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedShelf(shelf.id),
                            className: `px-4 py-3 font-medium border-b-2 transition-colors ${selectedShelf === shelf.id ? 'border-[#018283] text-[#018283]' : 'border-transparent text-gray-600 hover:text-gray-900'}`,
                            children: [
                                shelf.label,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 text-sm bg-gray-100 px-2 py-1 rounded-full",
                                    children: shelfStats.find((s)=>s.id === shelf.id)?.count || 0
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, shelf.id, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 285,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-3 top-3 w-5 h-5 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search by title or author...",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: sortBy,
                            onChange: (e)=>setSortBy(e.target.value),
                            className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#018283] focus:border-transparent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "date-added",
                                    children: "Recently Added"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "title",
                                    children: "Title A-Z"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "author",
                                    children: "Author A-Z"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 305,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg border border-gray-200",
                    children: filteredBooks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50 border-b border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Title"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 334,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Author"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 335,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Rating"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Date Started"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 337,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Date Finished"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                lineNumber: 339,
                                                columnNumber: 22
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 20
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 332,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: filteredBooks.map((userBook, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: `border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/books/${userBook.books?.isbn || userBook.book_id}`,
                                                        className: "text-[#018283] hover:underline font-medium flex items-center gap-3",
                                                        children: [
                                                            userBook.books?.cover_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: userBook.books.cover_url,
                                                                alt: userBook.books.title,
                                                                className: "w-8 h-12 object-cover rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 30
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                                    className: "w-4 h-4 text-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                    lineNumber: 358,
                                                                    columnNumber: 32
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: userBook.books?.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                lineNumber: 361,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 text-gray-700",
                                                    children: userBook.books?.author
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1 cursor-pointer",
                                                        onMouseEnter: ()=>setRatingHoverId(userBook.id),
                                                        onMouseLeave: ()=>setRatingHoverId(null),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-0.5",
                                                            children: [
                                                                1,
                                                                2,
                                                                3,
                                                                4,
                                                                5
                                                            ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                    onClick: ()=>handleUpdateRating(userBook.id, star),
                                                                    className: `w-4 h-4 cursor-pointer transition-all ${ratingHoverId === userBook.id ? star <= (userBook.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300' : star <= (userBook.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`
                                                                }, star, false, {
                                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                    lineNumber: 373,
                                                                    columnNumber: 34
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 text-gray-500 text-sm",
                                                    children: userBook.started_at ? new Date(userBook.started_at).toLocaleDateString() : '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 text-gray-500 text-sm",
                                                    children: userBook.completed_at ? new Date(userBook.completed_at).toLocaleDateString() : '-'
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1 relative z-20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setOpenDropdownId(openDropdownId === userBook.id ? null : userBook.id),
                                                                        className: "flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-[#2CAED8] transition-all duration-200",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                                                                status: userBook.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                lineNumber: 403,
                                                                                columnNumber: 32
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm font-medium text-gray-900",
                                                                                children: getStatusDisplay(userBook.status)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                lineNumber: 404,
                                                                                columnNumber: 32
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: `w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${openDropdownId === userBook.id ? 'rotate-180' : ''}`,
                                                                                fill: "none",
                                                                                stroke: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    strokeLinecap: "round",
                                                                                    strokeLinejoin: "round",
                                                                                    strokeWidth: 2,
                                                                                    d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                    lineNumber: 408,
                                                                                    columnNumber: 34
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                lineNumber: 407,
                                                                                columnNumber: 32
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                        lineNumber: 399,
                                                                        columnNumber: 30
                                                                    }, this),
                                                                    openDropdownId === userBook.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
                                                                        children: [
                                                                            {
                                                                                value: 'WANT_TO_READ',
                                                                                label: 'Want to Read',
                                                                                color: 'text-blue-600',
                                                                                bgColor: 'bg-blue-50'
                                                                            },
                                                                            {
                                                                                value: 'CURRENTLY_READING',
                                                                                label: 'Currently Reading',
                                                                                color: 'text-emerald-600',
                                                                                bgColor: 'bg-emerald-50'
                                                                            },
                                                                            {
                                                                                value: 'READ',
                                                                                label: 'Read',
                                                                                color: 'text-purple-600',
                                                                                bgColor: 'bg-purple-50'
                                                                            },
                                                                            {
                                                                                value: 'DNF',
                                                                                label: 'Did Not Finish',
                                                                                color: 'text-red-600',
                                                                                bgColor: 'bg-red-50'
                                                                            }
                                                                        ].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>{
                                                                                    handleUpdateStatus(userBook.id, status.value);
                                                                                    setOpenDropdownId(null);
                                                                                },
                                                                                className: `w-full px-3 py-2 flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors ${userBook.status === status.value ? status.bgColor : ''}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                                                                        status: status.value
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                        lineNumber: 430,
                                                                                        columnNumber: 38
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `font-medium ${userBook.status === status.value ? status.color : 'text-gray-700'}`,
                                                                                        children: status.label
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                        lineNumber: 431,
                                                                                        columnNumber: 38
                                                                                    }, this),
                                                                                    userBook.status === status.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                        className: "w-4 h-4 text-[#018283] ml-auto"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                        lineNumber: 437,
                                                                                        columnNumber: 40
                                                                                    }, this)
                                                                                ]
                                                                            }, status.value, true, {
                                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                                lineNumber: 420,
                                                                                columnNumber: 36
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                        lineNumber: 413,
                                                                        columnNumber: 32
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                lineNumber: 398,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleDeleteBook(userBook.id),
                                                                className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group flex-shrink-0",
                                                                title: "Delete book",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "w-4 h-4 group-hover:scale-110 transition-transform"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                    lineNumber: 450,
                                                                    columnNumber: 30
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, userBook.id, true, {
                                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 342,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                            lineNumber: 331,
                            columnNumber: 16
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 330,
                        columnNumber: 14
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-10 h-10 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                    lineNumber: 462,
                                    columnNumber: 18
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                lineNumber: 461,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-2xl font-bold text-gray-900 mb-3",
                                children: "No books on this shelf yet"
                            }, void 0, false, {
                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                lineNumber: 464,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4 max-w-sm mx-auto",
                                children: selectedShelf === 'WANT_TO_READ' ? "Start building your reading list by discovering books" : selectedShelf === 'CURRENTLY_READING' ? "Begin a book to add it to your currently reading shelf" : selectedShelf === 'READ' ? "Mark books as read to see them here" : "Books you haven't finished will appear here"
                            }, void 0, false, {
                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                lineNumber: 465,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-3 justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/discover",
                                        className: "px-6 py-3 bg-[#018283] text-white rounded-lg hover:bg-[#017374] transition-colors font-medium",
                                        children: "Discover Books"
                                    }, void 0, false, {
                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                        lineNumber: 475,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/import-books",
                                        className: "px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium",
                                        children: "Import from Notion"
                                    }, void 0, false, {
                                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                        lineNumber: 481,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                                lineNumber: 474,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                        lineNumber: 460,
                        columnNumber: 14
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
                    lineNumber: 328,
                    columnNumber: 10
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
            lineNumber: 258,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/book-tracker-app/src/app/my-books/page.tsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
_s(MyBooksPage, "wrHCcyhEz1/30Ip2CTxL1ypoV/g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = MyBooksPage;
var _c;
__turbopack_context__.k.register(_c, "MyBooksPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Star
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
            key: "r04s7s"
        }
    ]
];
const Star = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("star", __iconNode);
;
 //# sourceMappingURL=star.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Star",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trash2
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 11v6",
            key: "nco0om"
        }
    ],
    [
        "path",
        {
            d: "M14 11v6",
            key: "outv1u"
        }
    ],
    [
        "path",
        {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }
    ],
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }
    ]
];
const Trash2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trash-2", __iconNode);
;
 //# sourceMappingURL=trash-2.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trash2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/book-marked.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>BookMarked
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 2v8l3-3 3 3V2",
            key: "sqw3rj"
        }
    ],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
            key: "k3hazp"
        }
    ]
];
const BookMarked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("book-marked", __iconNode);
;
 //# sourceMappingURL=book-marked.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/book-marked.js [app-client] (ecmascript) <export default as BookMarked>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookMarked",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$marked$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$marked$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/book-marked.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Circle
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ]
];
const Circle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle", __iconNode);
;
 //# sourceMappingURL=circle.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Circle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleCheckBig
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21.801 10A10 10 0 1 1 17 3.335",
            key: "yps3ct"
        }
    ],
    [
        "path",
        {
            d: "m9 11 3 3L22 4",
            key: "1pflzl"
        }
    ]
];
const CircleCheckBig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-check-big", __iconNode);
;
 //# sourceMappingURL=circle-check-big.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Clock
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 6v6l4 2",
            key: "mmk7yg"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ]
];
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("clock", __iconNode);
;
 //# sourceMappingURL=clock.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>CircleX
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "m15 9-6 6",
            key: "1uzhvr"
        }
    ],
    [
        "path",
        {
            d: "m9 9 6 6",
            key: "z0biqf"
        }
    ]
];
const CircleX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("circle-x", __iconNode);
;
 //# sourceMappingURL=circle-x.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript)");
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Upload
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 3v12",
            key: "1x0j5s"
        }
    ],
    [
        "path",
        {
            d: "m17 8-5-5-5 5",
            key: "7q97r8"
        }
    ],
    [
        "path",
        {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }
    ]
];
const Upload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("upload", __iconNode);
;
 //# sourceMappingURL=upload.js.map
}),
"[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Upload",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$book$2d$tracker$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/book-tracker-app/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=book-tracker-app_f8baf665._.js.map