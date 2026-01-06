# BookTracker 📚

A modern web application for tracking your reading journey, discovering new books, and connecting with fellow readers.

## ✨ Features

- **📖 Book Tracking**: Add books to your personal reading lists and track your progress
- **⭐ Reviews & Ratings**: Share your thoughts and rate books to help others discover great reads
- **🔍 Book Discovery**: Search for books by title, author, or ISBN
- **👥 Social Features**: Follow other readers and get book recommendations
- **📊 Reading Statistics**: View your reading progress with interactive charts
- **🎯 Reading Goals**: Set and track annual reading goals
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query, React Context
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest, React Testing Library, Playwright

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/book-tracker-app.git
   cd book-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Then follow the database setup instructions in `SUPABASE_SETUP.md` to create the required tables.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
book-tracker-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── [pages]/           # Feature pages
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility functions
│   └── __tests__/             # Test files
├── supabase/
│   └── migrations/            # Database schema migrations
├── e2e/                       # Playwright end-to-end tests
└── public/                    # Static assets
```

## 🧪 Testing

The project includes a comprehensive test suite:

- **Unit Tests**: `npm run test` - Run unit tests with Vitest
- **Test UI**: `npm run test:ui` - Run tests with visual interface
- **E2E Tests**: `npx playwright test` - Run end-to-end tests with Playwright

## 📊 Database Schema

The app uses the following main tables:

- **users**: User profiles and preferences
- **books**: Book metadata and information
- **user_books**: Tracks reading status and progress
- **reviews**: User reviews and ratings
- **reading_lists**: Custom book collections
- **follows**: User social connections
- **reading_goals**: Annual reading goals

## 🎨 Key Features in Detail

### Book Management
- Add books to your personal library
- Track reading status (Want to Read, Currently Reading, Read)
- Rate books with 1-5 stars
- Write detailed reviews
- Import books in bulk

### Social Features
- Follow other readers to see their activity
- Discover books through friend recommendations
- Share your reading progress
- View personalized book recommendations

### Analytics & Goals
- Visualize your reading statistics with interactive charts
- Set annual reading goals
- Track progress towards your goals
- View reading history and trends

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables for Supabase
3. **Deploy**

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Auth and database powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

If you run into any issues or have questions:

1. Check the [existing issues](https://github.com/your-username/book-tracker-app/issues)
2. Create a new issue with detailed information
3. Review the `SUPABASE_SETUP.md` for database configuration help

Happy reading! 📚✨