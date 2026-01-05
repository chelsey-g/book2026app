# Supabase Setup Instructions

This app uses Supabase for authentication and database. Follow these steps to set up the database tables.

## Steps to Set Up Supabase Tables

1. **Go to your Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project: `vykivygbhabefwfxyrds`

2. **Navigate to SQL Editor**
   - In the left sidebar, click "SQL Editor"
   - Click "New Query"

3. **Run the migration SQL**
   - Copy the entire SQL from `supabase/migrations/001_init.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Cmd+Enter

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `users`
     - `books`
     - `user_books`
     - `reviews`
     - `reading_lists`
     - `reading_list_books`
     - `follows`

## What Gets Created

The migration creates:
- **users**: User profile data (extends Supabase auth)
- **books**: Book metadata (title, author, ISBN, etc.)
- **user_books**: Tracks what books each user is reading and their status
- **reviews**: User reviews and ratings for books
- **reading_lists**: Custom reading lists created by users
- **reading_list_books**: Books in reading lists
- **follows**: Friend/follower relationships

Each table has:
- Appropriate indexes for query performance
- Row Level Security (RLS) policies to protect user data
- Foreign key relationships for data integrity

## How It Works

- When a user adds a book to their reading list, it creates a record in `user_books`
- The app uses Supabase auth for user management
- All user data is private via RLS policies - users can only see their own data
- Books table is public - anyone can read book info, but only authenticated users can manage their lists

## If You Get an Error

If you get an error about table names or columns not existing:
1. Make sure you ran the SQL migration in Supabase
2. Check that the tables appear in "Table Editor"
3. Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct in `.env.local`

## Testing

Try adding a book to your list. It should now save to Supabase instead of showing an error!
