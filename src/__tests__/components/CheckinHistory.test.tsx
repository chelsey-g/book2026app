import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import CheckinHistory from '@/components/CheckinHistory';

const mockCheckins = [
  {
    id: 'checkin-1',
    book_id: 'book-1',
    pages_read: 50,
    checkin_date: new Date().toISOString().split('T')[0], // Today
    mood: 'excited',
    books: {
      id: 'book-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover_url: 'https://example.com/gatsby.jpg',
    },
  },
  {
    id: 'checkin-2',
    book_id: 'book-2',
    pages_read: 30,
    checkin_date: new Date().toISOString().split('T')[0], // Today
    mood: 'thoughtful',
    books: {
      id: 'book-2',
      title: '1984',
      author: 'George Orwell',
      cover_url: null,
    },
  },
  {
    id: 'checkin-3',
    book_id: 'book-1',
    pages_read: 25,
    checkin_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    mood: null,
    books: {
      id: 'book-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover_url: 'https://example.com/gatsby.jpg',
    },
  },
];

describe('CheckinHistory', () => {
  describe('empty state', () => {
    it('renders empty state when no checkins', () => {
      render(<CheckinHistory checkins={[]} />);

      expect(screen.getByText('No check-ins yet')).toBeInTheDocument();
      expect(screen.getByText('Start logging your reading to see your history')).toBeInTheDocument();
    });
  });

  describe('with checkins', () => {
    it('renders checkin list', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      // The Great Gatsby appears twice (checkin 1 and 3)
      expect(screen.getAllByText('The Great Gatsby')).toHaveLength(2);
      expect(screen.getByText('1984')).toBeInTheDocument();
    });

    it('displays book author', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      // F. Scott Fitzgerald appears twice (checkin 1 and 3)
      expect(screen.getAllByText('F. Scott Fitzgerald')).toHaveLength(2);
      expect(screen.getByText('George Orwell')).toBeInTheDocument();
    });

    it('displays pages read', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      expect(screen.getByText('50 pages')).toBeInTheDocument();
      expect(screen.getByText('30 pages')).toBeInTheDocument();
      expect(screen.getByText('25 pages')).toBeInTheDocument();
    });

    it('displays mood emoji for checkins with mood', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      // Excited mood emoji
      expect(screen.getByText('🤩')).toBeInTheDocument();
      expect(screen.getByText('Excited')).toBeInTheDocument();

      // Thoughtful mood emoji
      expect(screen.getByText('🤔')).toBeInTheDocument();
      expect(screen.getByText('Thoughtful')).toBeInTheDocument();
    });

    it('groups checkins by date', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      // Should show "Today" and "Yesterday" labels
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('renders book cover when available', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/gatsby.jpg');
    });
  });

  describe('delete functionality', () => {
    it('calls onDeleteCheckin when delete button clicked', async () => {
      const user = userEvent.setup();
      const mockOnDelete = vi.fn();

      render(
        <CheckinHistory
          checkins={mockCheckins}
          onDeleteCheckin={mockOnDelete}
        />
      );

      // Find and click the first delete button
      const deleteButtons = screen.getAllByTitle('Delete check-in');
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith('checkin-1');
    });

    it('does not render delete buttons when onDeleteCheckin not provided', () => {
      render(<CheckinHistory checkins={mockCheckins} />);

      const deleteButtons = screen.queryAllByTitle('Delete check-in');
      expect(deleteButtons).toHaveLength(0);
    });

    it('disables delete button when isDeleting matches checkin id', () => {
      const mockOnDelete = vi.fn();

      render(
        <CheckinHistory
          checkins={mockCheckins}
          onDeleteCheckin={mockOnDelete}
          isDeleting="checkin-1"
        />
      );

      const deleteButtons = screen.getAllByTitle('Delete check-in');
      expect(deleteButtons[0]).toBeDisabled();
      expect(deleteButtons[1]).not.toBeDisabled();
    });
  });

  describe('mood display', () => {
    it('displays all mood types correctly', () => {
      const checkinsWithAllMoods = [
        { ...mockCheckins[0], id: '1', mood: 'excited' },
        { ...mockCheckins[0], id: '2', mood: 'thoughtful' },
        { ...mockCheckins[0], id: '3', mood: 'sad' },
        { ...mockCheckins[0], id: '4', mood: 'confused' },
        { ...mockCheckins[0], id: '5', mood: 'inspired' },
        { ...mockCheckins[0], id: '6', mood: 'bored' },
      ];

      render(<CheckinHistory checkins={checkinsWithAllMoods} />);

      expect(screen.getByText('🤩')).toBeInTheDocument();
      expect(screen.getByText('🤔')).toBeInTheDocument();
      expect(screen.getByText('😢')).toBeInTheDocument();
      expect(screen.getByText('😕')).toBeInTheDocument();
      expect(screen.getByText('✨')).toBeInTheDocument();
      expect(screen.getByText('😴')).toBeInTheDocument();
    });

    it('does not display mood section when mood is null', () => {
      const checkinWithoutMood = [{
        ...mockCheckins[0],
        mood: null,
      }];

      render(<CheckinHistory checkins={checkinWithoutMood} />);

      expect(screen.queryByText('Excited')).not.toBeInTheDocument();
    });
  });
});
