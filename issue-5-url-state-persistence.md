# Preserve pagination state in URL query parameters

**Labels:** `enhancement`, `UX`

## Problem
Current pagination state (current page and items per page) is only stored in component state. This means:
- Users cannot bookmark a specific page
- Browser back/forward buttons don't work as expected
- Cannot share links to specific pages
- Pagination state is lost on page refresh

## Current Implementation
`src/app/my-books/page.tsx:43-44` - State only stored in React state:
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

## Suggested Solution
Use URL query parameters to store pagination state:
- Example: `/my-books?page=3&perPage=25&shelf=READ`
- Sync state with URL using `useRouter` and `useSearchParams`
- Read from URL on initial load
- Update URL when pagination changes

## Implementation Approach
```javascript
const router = useRouter();
const searchParams = useSearchParams();

// Read from URL on mount
const [currentPage, setCurrentPage] = useState(
  Number(searchParams.get('page')) || 1
);

// Update URL when page changes
const handlePageChange = (page: number) => {
  setCurrentPage(page);
  router.push(`/my-books?page=${page}&perPage=${itemsPerPage}`);
};
```

## Benefits
- Shareable links to specific pages
- Browser navigation works correctly
- Better user experience
- State persists across refreshes
- Standard web application pattern

## Additional Considerations
- Also consider persisting `selectedShelf`, `searchTerm`, and `sortBy` in URL
- This would make the entire page state shareable and bookmarkable
