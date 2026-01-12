# GitHub Issues to Create

Based on the recent code review, here are the recommended follow-up issues to create on your repository:

---

## Issue 1: Add loading states for book update operations

**Labels:** enhancement, UX

### Problem
When users rate books or update book status on the My Books page, there's no visual feedback while the API call is in progress. This can lead to user confusion and multiple clicks if the server response is slow.

### Affected Operations
- Rating updates (`handleUpdateRating` in `src/app/my-books/page.tsx:169-197`)
- Status updates (`handleUpdateStatus` in `src/app/my-books/page.tsx:139-167`)
- Book deletions (`handleDeleteBook` in `src/app/my-books/page.tsx:115-137`)

### Suggested Solution
Add loading states to provide visual feedback during async operations:
- Disable interactive elements during the operation
- Show spinner or loading indicator
- Consider optimistic UI updates for better perceived performance

### Benefits
- Better user experience
- Prevents duplicate submissions
- Clear feedback on action progress

### References
Related to recent pagination and UX improvements in PR #7 and #9

---

## Issue 2: Replace alert() with toast notification system

**Labels:** enhancement, UX

### Problem
Error handling currently uses browser `alert()` dialogs, which provide poor UX:
- Blocks the entire page
- Cannot be styled
- Disrupts user workflow
- Looks unprofessional

### Current Usage
- `src/app/my-books/page.tsx:135` - Delete book errors
- `src/app/my-books/page.tsx:165` - Update status errors
- `src/app/my-books/page.tsx:195` - Update rating errors

### Suggested Solution
Implement a modern toast notification system:
- Non-blocking notifications
- Auto-dismiss after a few seconds
- Support for success, error, warning, and info states
- Consistent styling with the app design

### Recommended Libraries
- `react-hot-toast` (lightweight, simple)
- `sonner` (modern, accessible)
- Custom implementation with Tailwind CSS

### Benefits
- Professional appearance
- Better user experience
- Non-disruptive error messaging
- Can show multiple notifications simultaneously

---

## Issue 3: Add click-outside handler for status dropdown

**Labels:** bug, UX

### Problem
The status change dropdown on the My Books page doesn't close when clicking outside of it. It only closes when:
- Clicking the dropdown button again
- Selecting a status option

This is unexpected behavior and can be confusing for users.

### Location
`src/app/my-books/page.tsx:434-464` - Status dropdown component

### Suggested Solution
Add a click-outside handler to close the dropdown when users click anywhere outside of it:
- Use `useEffect` with document event listener
- Or use a library like `react-use` with `useClickAway` hook
- Consider adding an invisible backdrop for mobile devices

### Implementation Example
```javascript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (openDropdownId && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [openDropdownId]);
```

### Benefits
- Standard dropdown behavior
- Better UX
- Prevents confusion

---

## Issue 4: Add confirmation dialog before deleting books

**Labels:** enhancement, UX

### Problem
Books are deleted immediately when clicking the trash icon without any confirmation. This can lead to accidental deletions and data loss.

### Location
- `src/app/my-books/page.tsx:115-137` - `handleDeleteBook` function
- `src/app/my-books/page.tsx:467-473` - Delete button

### Suggested Solution
Add a confirmation dialog before deleting:
- Show modal or confirmation dialog asking "Are you sure you want to delete this book?"
- Include book title in the confirmation message
- Provide "Cancel" and "Delete" buttons
- Consider making the delete button red/destructive color

### Implementation Options
1. Browser `confirm()` dialog (quick but not ideal for UX)
2. Custom modal component (better UX, styled to match app)
3. Toast with undo action (modern approach)

### Benefits
- Prevents accidental deletions
- Gives users a chance to reconsider
- Standard pattern for destructive actions
- Better data safety

### Priority
Medium - This is a common UX pattern for destructive actions

---

## Issue 5: Preserve pagination state in URL query parameters

**Labels:** enhancement, UX

### Problem
Current pagination state (current page and items per page) is only stored in component state. This means:
- Users cannot bookmark a specific page
- Browser back/forward buttons don't work as expected
- Cannot share links to specific pages
- Pagination state is lost on page refresh

### Current Implementation
`src/app/my-books/page.tsx:43-44` - State only stored in React state:
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

### Suggested Solution
Use URL query parameters to store pagination state:
- Example: `/my-books?page=3&perPage=25&shelf=READ`
- Sync state with URL using `useRouter` and `useSearchParams`
- Read from URL on initial load
- Update URL when pagination changes

### Implementation Approach
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

### Benefits
- Shareable links to specific pages
- Browser navigation works correctly
- Better user experience
- State persists across refreshes
- Standard web application pattern

### Additional Considerations
- Also consider persisting `selectedShelf`, `searchTerm`, and `sortBy` in URL
- This would make the entire page state shareable and bookmarkable

---

## Issue 6: Improve accessibility on My Books page

**Labels:** accessibility, a11y

### Problem
The My Books page may have accessibility issues that could prevent users with disabilities from fully using the features:

1. **Rating stars** - Interactive but may not be keyboard accessible
2. **Status dropdown** - May need ARIA labels for screen readers
3. **Pagination controls** - Should announce current page to screen readers
4. **Table structure** - Should be properly labeled for screen readers

### Specific Areas to Review

#### Rating Stars (`src/app/my-books/page.tsx:387-411`)
- Cannot be operated with keyboard (Tab + Enter/Space)
- No ARIA labels to indicate current rating
- No keyboard navigation between stars

#### Status Dropdown (`src/app/my-books/page.tsx:420-465`)
- Should use proper ARIA attributes (`aria-expanded`, `aria-haspopup`)
- Dropdown items should be keyboard navigable
- Should announce current status to screen readers

#### Pagination (`src/app/my-books/page.tsx:507-562`)
- Page buttons need better ARIA labels (e.g., "Go to page 3")
- Current page should be announced
- Disabled state should be properly communicated

### Recommended Actions
1. **Audit with screen reader** (NVDA, JAWS, or VoiceOver)
2. **Test keyboard navigation** - Ensure all interactive elements are keyboard accessible
3. **Add ARIA attributes** where needed
4. **Follow WCAG 2.1 AA guidelines**

### Suggested Improvements
- Add `aria-label` to rating stars
- Make rating stars keyboard accessible with `tabIndex` and `onKeyDown` handlers
- Add proper ARIA attributes to dropdown
- Ensure focus management in dropdowns
- Add skip links if needed
- Test color contrast ratios

### Testing Checklist
- [ ] Full keyboard navigation works
- [ ] Screen reader announces all interactive elements correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] ARIA labels are descriptive and accurate

### Priority
Medium-High - Accessibility is important for inclusive web applications

---

## How to Create These Issues

You can create these issues on GitHub by:

1. Going to https://github.com/chelsey-g/book2026app/issues/new
2. Copy the title and content from each issue above
3. Add the suggested labels
4. Submit each issue

Or use the GitHub CLI if available:
```bash
gh issue create --title "Issue Title" --body "Issue content" --label "label1,label2"
```
