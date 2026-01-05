import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Home from '@/app/page';

// Mock Next.js router
const mockPush = vi.fn();
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}));

// Mock AuthContext
const mockUseAuth = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock window.location
const mockLocation = { href: 'http://localhost:3000/' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = 'http://localhost:3000/';
  });

  describe('loading state', () => {
    it('shows loading when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      render(<Home />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('authenticated user redirect', () => {
    it('redirects to dashboard when user is authenticated', async () => {
      const mockUser = { id: 'test-user', email: 'test@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
      });

      render(<Home />);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('does not redirect when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      render(<Home />);
      
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not redirect while loading', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'test-user' },
        loading: true,
      });

      render(<Home />);
      
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('landing page content', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });
    });

    it('renders the main heading', () => {
      render(<Home />);
      
      expect(screen.getByText('Track Your Reading Journey')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      render(<Home />);
      
      expect(screen.getByText('Discover books, track your progress, and share your reviews with a community of readers.')).toBeInTheDocument();
    });

    it('renders the search form', () => {
      render(<Home />);
      
      const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      expect(searchInput).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });

    it('renders feature cards', () => {
      render(<Home />);
      
      expect(screen.getByText('Track Books')).toBeInTheDocument();
      expect(screen.getByText('Write Reviews')).toBeInTheDocument();
      expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    it('renders sign in and sign up buttons', () => {
      render(<Home />);
      
      const signInLink = screen.getByRole('link', { name: /sign in/i });
      const signUpLink = screen.getByRole('link', { name: /sign up/i });
      
      expect(signInLink).toHaveAttribute('href', '/auth/signin');
      expect(signUpLink).toHaveAttribute('href', '/auth/signup');
    });

    it('renders the BookTracker logo', () => {
      render(<Home />);
      
      expect(screen.getByText('BookTracker')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });
    });

    it('updates search query when typing', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
      await user.type(searchInput, 'test query');
      
      expect(searchInput).toHaveValue('test query');
    });

    it('navigates to search page when form is submitted', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(searchInput, 'test query');
      await user.click(searchButton);
      
      expect(mockLocation.href).toBe('/search?q=test%20query');
    });

    it('navigates to search page when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
      
      await user.type(searchInput, 'test query');
      await user.keyboard('{Enter}');
      
      expect(mockLocation.href).toBe('/search?q=test%20query');
    });

    it('does not navigate when search query is empty', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);
      
      expect(mockLocation.href).toBe('http://localhost:3000/');
    });

    it('trims whitespace from search query', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
      const searchButton = screen.getByRole('button', { name: /search/i });
      
      await user.type(searchInput, '  test query  ');
      await user.click(searchButton);
      
      expect(mockLocation.href).toBe('/search?q=test%20query');
    });
  });
});
