#!/bin/bash

# Script to create GitHub issues from markdown files
# Usage: ./create-github-issues.sh <GITHUB_TOKEN>

REPO="chelsey-g/book2026app"
API_URL="https://api.github.com/repos/${REPO}/issues"

# Check if token is provided
if [ -z "$1" ]; then
  echo "❌ Error: GitHub token required"
  echo ""
  echo "Usage: ./create-github-issues.sh <GITHUB_TOKEN>"
  echo ""
  echo "To create a token:"
  echo "1. Go to https://github.com/settings/tokens"
  echo "2. Click 'Generate new token (classic)'"
  echo "3. Select 'repo' scope"
  echo "4. Copy the token"
  echo ""
  echo "Then run: ./create-github-issues.sh YOUR_TOKEN"
  exit 1
fi

TOKEN="$1"

echo "🚀 Creating GitHub issues for repo: ${REPO}"
echo ""

# Issue 1: Loading States
echo "📝 Creating Issue 1: Loading states..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Add loading states for book update operations",
    "body": "## Problem\nWhen users rate books or update book status on the My Books page, there'\''s no visual feedback while the API call is in progress. This can lead to user confusion and multiple clicks if the server response is slow.\n\n## Affected Operations\n- Rating updates (`handleUpdateRating` in `src/app/my-books/page.tsx:169-197`)\n- Status updates (`handleUpdateStatus` in `src/app/my-books/page.tsx:139-167`)\n- Book deletions (`handleDeleteBook` in `src/app/my-books/page.tsx:115-137`)\n\n## Suggested Solution\nAdd loading states to provide visual feedback during async operations:\n- Disable interactive elements during the operation\n- Show spinner or loading indicator\n- Consider optimistic UI updates for better perceived performance\n\n## Benefits\n- Better user experience\n- Prevents duplicate submissions\n- Clear feedback on action progress\n\n## References\nRelated to recent pagination and UX improvements in PR #7 and #9",
    "labels": ["enhancement", "UX"]
  }' | grep -q '"number"' && echo "✅ Issue 1 created" || echo "❌ Issue 1 failed"

sleep 1

# Issue 2: Toast Notifications
echo "📝 Creating Issue 2: Toast notifications..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Replace alert() with toast notification system",
    "body": "## Problem\nError handling currently uses browser `alert()` dialogs, which provide poor UX:\n- Blocks the entire page\n- Cannot be styled\n- Disrupts user workflow\n- Looks unprofessional\n\n## Current Usage\n- `src/app/my-books/page.tsx:135` - Delete book errors\n- `src/app/my-books/page.tsx:165` - Update status errors\n- `src/app/my-books/page.tsx:195` - Update rating errors\n\n## Suggested Solution\nImplement a modern toast notification system:\n- Non-blocking notifications\n- Auto-dismiss after a few seconds\n- Support for success, error, warning, and info states\n- Consistent styling with the app design\n\n## Recommended Libraries\n- `react-hot-toast` (lightweight, simple)\n- `sonner` (modern, accessible)\n- Custom implementation with Tailwind CSS\n\n## Benefits\n- Professional appearance\n- Better user experience\n- Non-disruptive error messaging\n- Can show multiple notifications simultaneously",
    "labels": ["enhancement", "UX"]
  }' | grep -q '"number"' && echo "✅ Issue 2 created" || echo "❌ Issue 2 failed"

sleep 1

# Issue 3: Dropdown Click Outside
echo "📝 Creating Issue 3: Dropdown click-outside handler..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Add click-outside handler for status dropdown",
    "body": "## Problem\nThe status change dropdown on the My Books page doesn'\''t close when clicking outside of it. It only closes when:\n- Clicking the dropdown button again\n- Selecting a status option\n\nThis is unexpected behavior and can be confusing for users.\n\n## Location\n`src/app/my-books/page.tsx:434-464` - Status dropdown component\n\n## Suggested Solution\nAdd a click-outside handler to close the dropdown when users click anywhere outside of it:\n- Use `useEffect` with document event listener\n- Or use a library like `react-use` with `useClickAway` hook\n- Consider adding an invisible backdrop for mobile devices\n\n## Implementation Example\n```javascript\nuseEffect(() => {\n  const handleClickOutside = (event: MouseEvent) => {\n    if (openDropdownId && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {\n      setOpenDropdownId(null);\n    }\n  };\n\n  document.addEventListener('\''mousedown'\'', handleClickOutside);\n  return () => document.removeEventListener('\''mousedown'\'', handleClickOutside);\n}, [openDropdownId]);\n```\n\n## Benefits\n- Standard dropdown behavior\n- Better UX\n- Prevents confusion",
    "labels": ["bug", "UX"]
  }' | grep -q '"number"' && echo "✅ Issue 3 created" || echo "❌ Issue 3 failed"

sleep 1

# Issue 4: Delete Confirmation
echo "📝 Creating Issue 4: Delete confirmation dialog..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Add confirmation dialog before deleting books",
    "body": "## Problem\nBooks are deleted immediately when clicking the trash icon without any confirmation. This can lead to accidental deletions and data loss.\n\n## Location\n- `src/app/my-books/page.tsx:115-137` - `handleDeleteBook` function\n- `src/app/my-books/page.tsx:467-473` - Delete button\n\n## Suggested Solution\nAdd a confirmation dialog before deleting:\n- Show modal or confirmation dialog asking \"Are you sure you want to delete this book?\"\n- Include book title in the confirmation message\n- Provide \"Cancel\" and \"Delete\" buttons\n- Consider making the delete button red/destructive color\n\n## Implementation Options\n1. Browser `confirm()` dialog (quick but not ideal for UX)\n2. Custom modal component (better UX, styled to match app)\n3. Toast with undo action (modern approach)\n\n## Benefits\n- Prevents accidental deletions\n- Gives users a chance to reconsider\n- Standard pattern for destructive actions\n- Better data safety\n\n## Priority\nMedium - This is a common UX pattern for destructive actions",
    "labels": ["enhancement", "UX"]
  }' | grep -q '"number"' && echo "✅ Issue 4 created" || echo "❌ Issue 4 failed"

sleep 1

# Issue 5: URL State Persistence
echo "📝 Creating Issue 5: URL state persistence..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Preserve pagination state in URL query parameters",
    "body": "## Problem\nCurrent pagination state (current page and items per page) is only stored in component state. This means:\n- Users cannot bookmark a specific page\n- Browser back/forward buttons don'\''t work as expected\n- Cannot share links to specific pages\n- Pagination state is lost on page refresh\n\n## Current Implementation\n`src/app/my-books/page.tsx:43-44` - State only stored in React state:\n```javascript\nconst [currentPage, setCurrentPage] = useState(1);\nconst [itemsPerPage, setItemsPerPage] = useState(10);\n```\n\n## Suggested Solution\nUse URL query parameters to store pagination state:\n- Example: `/my-books?page=3&perPage=25&shelf=READ`\n- Sync state with URL using `useRouter` and `useSearchParams`\n- Read from URL on initial load\n- Update URL when pagination changes\n\n## Implementation Approach\n```javascript\nconst router = useRouter();\nconst searchParams = useSearchParams();\n\n// Read from URL on mount\nconst [currentPage, setCurrentPage] = useState(\n  Number(searchParams.get('\''page'\'')) || 1\n);\n\n// Update URL when page changes\nconst handlePageChange = (page: number) => {\n  setCurrentPage(page);\n  router.push(`/my-books?page=${page}&perPage=${itemsPerPage}`);\n};\n```\n\n## Benefits\n- Shareable links to specific pages\n- Browser navigation works correctly\n- Better user experience\n- State persists across refreshes\n- Standard web application pattern\n\n## Additional Considerations\n- Also consider persisting `selectedShelf`, `searchTerm`, and `sortBy` in URL\n- This would make the entire page state shareable and bookmarkable",
    "labels": ["enhancement", "UX"]
  }' | grep -q '"number"' && echo "✅ Issue 5 created" || echo "❌ Issue 5 failed"

sleep 1

# Issue 6: Accessibility
echo "📝 Creating Issue 6: Accessibility improvements..."
curl -s -X POST \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github.v3+json" \
  "${API_URL}" \
  -d '{
    "title": "Improve accessibility on My Books page",
    "body": "## Problem\nThe My Books page may have accessibility issues that could prevent users with disabilities from fully using the features:\n\n1. **Rating stars** - Interactive but may not be keyboard accessible\n2. **Status dropdown** - May need ARIA labels for screen readers\n3. **Pagination controls** - Should announce current page to screen readers\n4. **Table structure** - Should be properly labeled for screen readers\n\n## Specific Areas to Review\n\n### Rating Stars (`src/app/my-books/page.tsx:387-411`)\n- Cannot be operated with keyboard (Tab + Enter/Space)\n- No ARIA labels to indicate current rating\n- No keyboard navigation between stars\n\n### Status Dropdown (`src/app/my-books/page.tsx:420-465`)\n- Should use proper ARIA attributes (`aria-expanded`, `aria-haspopup`)\n- Dropdown items should be keyboard navigable\n- Should announce current status to screen readers\n\n### Pagination (`src/app/my-books/page.tsx:507-562`)\n- Page buttons need better ARIA labels (e.g., \"Go to page 3\")\n- Current page should be announced\n- Disabled state should be properly communicated\n\n## Recommended Actions\n1. **Audit with screen reader** (NVDA, JAWS, or VoiceOver)\n2. **Test keyboard navigation** - Ensure all interactive elements are keyboard accessible\n3. **Add ARIA attributes** where needed\n4. **Follow WCAG 2.1 AA guidelines**\n\n## Suggested Improvements\n- Add `aria-label` to rating stars\n- Make rating stars keyboard accessible with `tabIndex` and `onKeyDown` handlers\n- Add proper ARIA attributes to dropdown\n- Ensure focus management in dropdowns\n- Add skip links if needed\n- Test color contrast ratios\n\n## Testing Checklist\n- [ ] Full keyboard navigation works\n- [ ] Screen reader announces all interactive elements correctly\n- [ ] Focus indicators are visible\n- [ ] Color contrast meets WCAG AA standards\n- [ ] ARIA labels are descriptive and accurate\n\n## Priority\nMedium-High - Accessibility is important for inclusive web applications",
    "labels": ["accessibility", "a11y"]
  }' | grep -q '"number"' && echo "✅ Issue 6 created" || echo "❌ Issue 6 failed"

echo ""
echo "✨ Done! Check your issues at: https://github.com/${REPO}/issues"
