# How to Create GitHub Issues

I've identified 6 follow-up improvements from the recent code review and prepared them as GitHub issues.

## Quick Summary of Issues

1. **Add loading states for book update operations** - No visual feedback during API calls
2. **Replace alert() with toast notification system** - Better error messaging UX
3. **Add click-outside handler for status dropdown** - Dropdown doesn't close when clicking outside
4. **Add confirmation dialog before deleting books** - Prevent accidental deletions
5. **Preserve pagination state in URL query parameters** - Enable bookmarking and browser navigation
6. **Improve accessibility on My Books page** - Keyboard navigation and screen reader support

## Option 1: Automated Script (Recommended)

Run the provided script with your GitHub token:

```bash
./create-github-issues.sh YOUR_GITHUB_TOKEN
```

**To get a GitHub token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Create Issues"
4. Select the `repo` scope
5. Click "Generate token"
6. Copy the token and use it with the script

## Option 2: Manual Creation

Each issue is available as a separate markdown file:

- `issue-1-loading-states.md`
- `issue-2-toast-notifications.md`
- `issue-3-dropdown-click-outside.md`
- `issue-4-delete-confirmation.md`
- `issue-5-url-state-persistence.md`
- `issue-6-accessibility.md`

**To create manually:**
1. Go to https://github.com/chelsey-g/book2026app/issues/new
2. Copy the content from each markdown file
3. Paste into the issue body
4. Add the suggested labels
5. Click "Submit new issue"

## Option 3: Using GitHub CLI

If you have the GitHub CLI installed:

```bash
gh issue create --title "Add loading states for book update operations" --body-file issue-1-loading-states.md --label enhancement,UX
gh issue create --title "Replace alert() with toast notification system" --body-file issue-2-toast-notifications.md --label enhancement,UX
gh issue create --title "Add click-outside handler for status dropdown" --body-file issue-3-dropdown-click-outside.md --label bug,UX
gh issue create --title "Add confirmation dialog before deleting books" --body-file issue-4-delete-confirmation.md --label enhancement,UX
gh issue create --title "Preserve pagination state in URL query parameters" --body-file issue-5-url-state-persistence.md --label enhancement,UX
gh issue create --title "Improve accessibility on My Books page" --body-file issue-6-accessibility.md --label accessibility,a11y
```

## Files Created

- ✅ `create-github-issues.sh` - Automated script to create all issues
- ✅ `issue-1-loading-states.md` - Loading states issue
- ✅ `issue-2-toast-notifications.md` - Toast notifications issue
- ✅ `issue-3-dropdown-click-outside.md` - Click-outside handler issue
- ✅ `issue-4-delete-confirmation.md` - Delete confirmation issue
- ✅ `issue-5-url-state-persistence.md` - URL state persistence issue
- ✅ `issue-6-accessibility.md` - Accessibility improvements issue

Choose whichever method works best for you!
