# Add confirmation dialog before deleting books

**Labels:** `enhancement`, `UX`

## Problem
Books are deleted immediately when clicking the trash icon without any confirmation. This can lead to accidental deletions and data loss.

## Location
- `src/app/my-books/page.tsx:115-137` - `handleDeleteBook` function
- `src/app/my-books/page.tsx:467-473` - Delete button

## Suggested Solution
Add a confirmation dialog before deleting:
- Show modal or confirmation dialog asking "Are you sure you want to delete this book?"
- Include book title in the confirmation message
- Provide "Cancel" and "Delete" buttons
- Consider making the delete button red/destructive color

## Implementation Options
1. Browser `confirm()` dialog (quick but not ideal for UX)
2. Custom modal component (better UX, styled to match app)
3. Toast with undo action (modern approach)

## Benefits
- Prevents accidental deletions
- Gives users a chance to reconsider
- Standard pattern for destructive actions
- Better data safety

## Priority
Medium - This is a common UX pattern for destructive actions
