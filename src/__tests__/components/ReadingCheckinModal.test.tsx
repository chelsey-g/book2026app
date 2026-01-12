import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReadingCheckinModal from '@/components/ReadingCheckinModal';

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({
        data: {
          session: {
            access_token: 'test-token',
          },
        },
      })),
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

const mockBooks = [
  {
    id: 'book-1',
    book_id: 'book-1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover_url: 'https://example.com/gatsby.jpg',
  },
  {
    id: 'book-2',
    book_id: 'book-2',
    title: '1984',
    author: 'George Orwell',
    cover_url: undefined,
  },
];

describe('ReadingCheckinModal', () => {
  const mockOnClose = vi.fn();
  const mockOnCheckinComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ checkin: { id: 'new-checkin' } }),
    });
  });

  describe('when closed', () => {
    it('does not render when isOpen is false', () => {
      render(
        <ReadingCheckinModal
          isOpen={false}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.queryByText('Log Reading')).not.toBeInTheDocument();
    });
  });

  describe('when open', () => {
    it('renders modal with title', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      // "Log Reading" appears twice - in header and submit button
      expect(screen.getAllByText('Log Reading')).toHaveLength(2);
      expect(screen.getByText('Track your daily progress')).toBeInTheDocument();
    });

    it('renders book selector', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.getByText('Book')).toBeInTheDocument();
      expect(screen.getByText('Select a book...')).toBeInTheDocument();
    });

    it('renders pages read input', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.getByText('Pages Read')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter number of pages')).toBeInTheDocument();
    });

    it('renders date input with today as default', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.getByText('Date')).toBeInTheDocument();
      const dateInput = screen.getByDisplayValue(new Date().toISOString().split('T')[0]);
      expect(dateInput).toBeInTheDocument();
    });

    it('renders all mood options', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.getByText('How did you feel about what you read?')).toBeInTheDocument();
      expect(screen.getByText('Excited')).toBeInTheDocument();
      expect(screen.getByText('Thoughtful')).toBeInTheDocument();
      expect(screen.getByText('Sad')).toBeInTheDocument();
      expect(screen.getByText('Confused')).toBeInTheDocument();
      expect(screen.getByText('Inspired')).toBeInTheDocument();
      expect(screen.getByText('Bored')).toBeInTheDocument();
    });

    it('renders mood emojis', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      expect(screen.getByText('🤩')).toBeInTheDocument();
      expect(screen.getByText('🤔')).toBeInTheDocument();
      expect(screen.getByText('😢')).toBeInTheDocument();
      expect(screen.getByText('😕')).toBeInTheDocument();
      expect(screen.getByText('✨')).toBeInTheDocument();
      expect(screen.getByText('😴')).toBeInTheDocument();
    });

    it('renders submit button disabled initially', () => {
      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Log Reading' });
      expect(submitButton).toBeDisabled();
    });

    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      const closeButton = screen.getByRole('button', { name: '' }); // X button has no text
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('book dropdown', () => {
    it('shows books when dropdown is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      await user.click(screen.getByText('Select a book...'));

      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      expect(screen.getByText('1984')).toBeInTheDocument();
    });

    it('shows empty message when no books', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={[]}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      await user.click(screen.getByText('Select a book...'));

      expect(screen.getByText('No books in progress')).toBeInTheDocument();
      expect(screen.getByText('Search for a book to log reading')).toBeInTheDocument();
    });

    it('selects book when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      await user.click(screen.getByText('Select a book...'));
      await user.click(screen.getByText('The Great Gatsby'));

      // The book should now be shown as selected (appears twice - once in dropdown trigger)
      expect(screen.getByText('F. Scott Fitzgerald')).toBeInTheDocument();
    });
  });

  describe('mood selection', () => {
    it('toggles mood selection on click', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      const excitedButton = screen.getByText('Excited').closest('button');

      // Click to select
      await user.click(excitedButton!);
      expect(excitedButton).toHaveClass('border-teal-500');

      // Click again to deselect
      await user.click(excitedButton!);
      expect(excitedButton).not.toHaveClass('border-teal-500');
    });
  });

  describe('form submission', () => {
    it('enables submit button when book and pages are filled', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      // Select a book
      await user.click(screen.getByText('Select a book...'));
      await user.click(screen.getByText('The Great Gatsby'));

      // Enter pages
      await user.type(screen.getByPlaceholderText('Enter number of pages'), '50');

      const submitButton = screen.getByRole('button', { name: 'Log Reading' });
      expect(submitButton).not.toBeDisabled();
    });

    it('shows error when trying to submit without book', async () => {
      const user = userEvent.setup();

      render(
        <ReadingCheckinModal
          isOpen={true}
          onClose={mockOnClose}
          currentlyReadingBooks={mockBooks}
          onCheckinComplete={mockOnCheckinComplete}
        />
      );

      // Enter pages but don't select book
      await user.type(screen.getByPlaceholderText('Enter number of pages'), '50');

      // Submit button should still be disabled
      const submitButton = screen.getByRole('button', { name: 'Log Reading' });
      expect(submitButton).toBeDisabled();
    });
  });
});
