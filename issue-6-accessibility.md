# Improve accessibility on My Books page

**Labels:** `accessibility`, `a11y`

## Problem
The My Books page may have accessibility issues that could prevent users with disabilities from fully using the features:

1. **Rating stars** - Interactive but may not be keyboard accessible
2. **Status dropdown** - May need ARIA labels for screen readers
3. **Pagination controls** - Should announce current page to screen readers
4. **Table structure** - Should be properly labeled for screen readers

## Specific Areas to Review

### Rating Stars (`src/app/my-books/page.tsx:387-411`)
- Cannot be operated with keyboard (Tab + Enter/Space)
- No ARIA labels to indicate current rating
- No keyboard navigation between stars

### Status Dropdown (`src/app/my-books/page.tsx:420-465`)
- Should use proper ARIA attributes (`aria-expanded`, `aria-haspopup`)
- Dropdown items should be keyboard navigable
- Should announce current status to screen readers

### Pagination (`src/app/my-books/page.tsx:507-562`)
- Page buttons need better ARIA labels (e.g., "Go to page 3")
- Current page should be announced
- Disabled state should be properly communicated

## Recommended Actions
1. **Audit with screen reader** (NVDA, JAWS, or VoiceOver)
2. **Test keyboard navigation** - Ensure all interactive elements are keyboard accessible
3. **Add ARIA attributes** where needed
4. **Follow WCAG 2.1 AA guidelines**

## Suggested Improvements
- Add `aria-label` to rating stars
- Make rating stars keyboard accessible with `tabIndex` and `onKeyDown` handlers
- Add proper ARIA attributes to dropdown
- Ensure focus management in dropdowns
- Add skip links if needed
- Test color contrast ratios

## Testing Checklist
- [ ] Full keyboard navigation works
- [ ] Screen reader announces all interactive elements correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] ARIA labels are descriptive and accurate

## Priority
Medium-High - Accessibility is important for inclusive web applications
