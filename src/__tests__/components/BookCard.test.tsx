import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import BookCard from '@/components/BookCard';

const mockBook = {
  id: 'test-book-id',
  title: 'Test Book Title',
  author: 'Test Author',
  cover: 'https://example.com/cover.jpg',
  rating: 4,
  status: 'CURRENTLY_READING' as const,
  progress: 50,
};

describe('BookCard', () => {
  describe('grid variant', () => {
    it('renders book information correctly', () => {
      render(<BookCard book={mockBook} variant="grid" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders star rating correctly', () => {
      render(<BookCard book={mockBook} variant="grid" />);
      
      // Should have 4 filled stars and 1 empty star
      const stars = screen.getAllByTestId('star');
      expect(stars).toHaveLength(5);
      
      // Check that first 4 stars are filled (have fill-yellow-400 class)
      expect(stars[0]).toHaveClass('fill-yellow-400');
      expect(stars[1]).toHaveClass('fill-yellow-400');
      expect(stars[2]).toHaveClass('fill-yellow-400');
      expect(stars[3]).toHaveClass('fill-yellow-400');
      expect(stars[4]).not.toHaveClass('fill-yellow-400');
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(<BookCard book={mockBook} variant="grid" onClick={mockOnClick} />);
      
      const card = screen.getByText('Test Book Title').closest('.cursor-pointer');
      await user.click(card!);
      
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('renders without rating', () => {
      const bookWithoutRating = { ...mockBook, rating: undefined };
      
      render(<BookCard book={bookWithoutRating} variant="grid" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.queryByTestId('star')).not.toBeInTheDocument();
    });

    it('renders placeholder when no cover', () => {
      const bookWithoutCover = { ...mockBook, cover: undefined };
      
      render(<BookCard book={bookWithoutCover} variant="grid" />);
      
      // Should render the placeholder div with BookOpen icon
      const placeholder = screen.getByTestId('book-placeholder');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('list variant', () => {
    it('renders book information correctly', () => {
      render(<BookCard book={mockBook} variant="list" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('4/5')).toBeInTheDocument();
    });

    it('shows reading progress for currently reading books', () => {
      render(<BookCard book={mockBook} variant="list" />);
      
      expect(screen.getByText('50% complete')).toBeInTheDocument();
      
      // Check progress bar dots
      const progressDots = screen.getAllByTestId('progress-dot');
      expect(progressDots).toHaveLength(5);
      
      // First 2 dots should be filled (50% / 20% = 2.5, so first 2)
      expect(progressDots[0]).toHaveClass('bg-teal-600');
      expect(progressDots[1]).toHaveClass('bg-teal-600');
      expect(progressDots[2]).toHaveClass('bg-gray-300');
    });

    it('shows reading indicator for currently reading books without progress', () => {
      const bookWithoutProgress = { ...mockBook, progress: undefined };
      
      render(<BookCard book={bookWithoutProgress} variant="list" />);
      
      const indicator = screen.getByTestId('reading-indicator');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('bg-teal-500');
    });

    it('does not show progress for non-currently reading books', () => {
      const readBook = { ...mockBook, status: 'READ' as const };
      
      render(<BookCard book={readBook} variant="list" />);
      
      expect(screen.queryByText('50% complete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reading-indicator')).not.toBeInTheDocument();
    });

    it('renders star rating correctly in list view', () => {
      render(<BookCard book={mockBook} variant="list" />);
      
      const stars = screen.getAllByTestId('star');
      expect(stars).toHaveLength(5);
      
      expect(stars[0]).toHaveClass('fill-yellow-400');
      expect(stars[1]).toHaveClass('fill-yellow-400');
      expect(stars[2]).toHaveClass('fill-yellow-400');
      expect(stars[3]).toHaveClass('fill-yellow-400');
      expect(stars[4]).not.toHaveClass('fill-yellow-400');
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      
      render(<BookCard book={mockBook} variant="list" onClick={mockOnClick} />);
      
      const card = screen.getByText('Test Book Title').closest('.cursor-pointer');
      await user.click(card!);
      
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('renders without rating in list view', () => {
      const bookWithoutRating = { ...mockBook, rating: undefined };
      
      render(<BookCard book={bookWithoutRating} variant="list" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.queryByText('/5')).not.toBeInTheDocument();
      expect(screen.queryByTestId('star')).not.toBeInTheDocument();
    });

    it('renders placeholder when no cover in list view', () => {
      const bookWithoutCover = { ...mockBook, cover: undefined };
      
      render(<BookCard book={bookWithoutCover} variant="list" />);
      
      const placeholder = screen.getByTestId('book-placeholder-list');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('default variant', () => {
    it('defaults to list variant', () => {
      render(<BookCard book={mockBook} />);
      
      // Should render list variant by default
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('50% complete')).toBeInTheDocument();
    });
  });

  describe('different book statuses', () => {
    it('renders WANT_TO_READ status correctly', () => {
      const wantToReadBook = { ...mockBook, status: 'WANT_TO_READ' as const };
      
      render(<BookCard book={wantToReadBook} variant="list" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.queryByText('50% complete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reading-indicator')).not.toBeInTheDocument();
    });

    it('renders READ status correctly', () => {
      const readBook = { ...mockBook, status: 'READ' as const };
      
      render(<BookCard book={readBook} variant="list" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.queryByText('50% complete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reading-indicator')).not.toBeInTheDocument();
    });

    it('renders DNF status correctly', () => {
      const dnfBook = { ...mockBook, status: 'DNF' as const };
      
      render(<BookCard book={dnfBook} variant="list" />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.queryByText('50% complete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reading-indicator')).not.toBeInTheDocument();
    });
  });
});
