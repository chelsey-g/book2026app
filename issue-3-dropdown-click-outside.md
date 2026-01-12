# Add click-outside handler for status dropdown

**Labels:** `bug`, `UX`

## Problem
The status change dropdown on the My Books page doesn't close when clicking outside of it. It only closes when:
- Clicking the dropdown button again
- Selecting a status option

This is unexpected behavior and can be confusing for users.

## Location
`src/app/my-books/page.tsx:434-464` - Status dropdown component

## Suggested Solution
Add a click-outside handler to close the dropdown when users click anywhere outside of it:
- Use `useEffect` with document event listener
- Or use a library like `react-use` with `useClickAway` hook
- Consider adding an invisible backdrop for mobile devices

## Implementation Example
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

## Benefits
- Standard dropdown behavior
- Better UX
- Prevents confusion
