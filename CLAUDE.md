# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without emitting

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (used in CI)
npm run test:ui      # Run tests with visual UI
npm run test:coverage # Run tests with coverage report

# Single test file
npx vitest run src/__tests__/api/books.test.ts

# E2E tests
npx playwright test
```

## Architecture

### Tech Stack
- Next.js 16 with App Router, React 19, TypeScript
- Tailwind CSS 4 for styling
- Supabase for auth and PostgreSQL database
- Vitest + React Testing Library for unit tests, Playwright for E2E

### Key Patterns

**Authentication Flow**: Supabase Auth with JWT tokens. API routes validate via `Authorization: Bearer <token>` header. Client-side auth state managed through `AuthContext` (`src/contexts/AuthContext.tsx`).

**API Routes**: Located in `src/app/api/`. Each route creates its own Supabase client with the user's token for RLS (Row Level Security). Pattern:
```typescript
const token = authHeader.substring(7);
const supabase = createClient(url, key, {
  global: { headers: { Authorization: `Bearer ${token}` } }
});
```

**Provider Hierarchy**: `ThemeProvider` wraps `AuthProvider` in `src/components/Providers.tsx`. Both contexts are client components.

**Database**: Supabase PostgreSQL with migrations in `supabase/migrations/`. Main tables: `users`, `books`, `user_books` (junction with status/rating), `reviews`, `reading_lists`, `follows`, `reading_goals`.

**Reading Status Values**: `WANT_TO_READ`, `CURRENTLY_READING`, `READ`

### Test Setup
- Tests mock Next.js router, Supabase client, and AuthContext in `src/__tests__/setup.ts`
- Use `@/` path alias (maps to `src/`)
- E2E tests in `e2e/` directory (excluded from Vitest)

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
