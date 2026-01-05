import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Header from '@/components/Header';

// Mock Next.js dependencies
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
  prefetch: mockPrefetch,
}));

const mockUseSearchParams = vi.fn(() => new URLSearchParams());
const mockUsePathname = vi.fn(() => '/dashboard');

vi.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  useSearchParams: () => mockUseSearchParams(),
  usePathname: () => mockUsePathname(),
}));

// Mock AuthContext
const mockSignOut = vi.fn();
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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = 'http://localhost:3000/';
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });
    });

    it('does not render when user is not authenticated', () => {
      const { container } = render(<Header />);
      expect(container.firstChild).toBeNull();
    });

    it('does not render on home page', () => {
      mockUsePathname.mockReturnValue('/');
      const { container } = render(<Header />);
      expect(container.firstChild).toBeNull();
    });

    it('does not render on auth pages', () => {
      mockUsePathname.mockReturnValue('/auth/signin');
      const { container } = render(<Header />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when user is authenticated', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        name: 'Test User',
      },
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });
      mockUsePathname.mockReturnValue('/dashboard');
    });

    it('renders the header with logo and navigation', () => {
      render(<Header />);
      
      expect(screen.getByText('BookTracker')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Discover')).toBeInTheDocument();
      expect(screen.getByText('My Books')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Friends')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
      mockUsePathname.mockReturnValue('/my-books');
      render(<Header />);
      
      const myBooksLink = screen.getByText('My Books').closest('a');
      expect(myBooksLink).toHaveClass('text-[#018283]');
    });

    it('shows user avatar with first letter of name', () => {
      render(<Header />);
      
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter of "Test User"
    });

    it('shows user name when available', () => {
      render(<Header />);
      
      expect(screen.getByText('Test')).toBeInTheDocument(); // First name
    });

    it('shows search button', () => {
      render(<Header />);
      
      const searchButton = screen.getByRole('button', { name: 'Toggle search' });
      expect(searchButton).toBeInTheDocument();
    });

    describe('search functionality', () => {
      it('toggles search input when search button is clicked', async () => {
        const user = userEvent.setup();
        render(<Header />);
        
        const searchButton = screen.getByRole('button', { name: 'Toggle search' });
        await user.click(searchButton);
        
        expect(screen.getByPlaceholderText('Search for books, authors, or ISBN...')).toBeInTheDocument();
      });

      it('closes search when clicking outside', async () => {
        const user = userEvent.setup();
        render(<Header />);
        
        const searchButton = screen.getByRole('button', { name: 'Toggle search' });
        await user.click(searchButton);
        
        expect(screen.getByPlaceholderText('Search for books, authors, or ISBN...')).toBeInTheDocument();
        
        // Click outside the search area
        await user.click(document.body);
        
        await waitFor(() => {
          expect(screen.queryByPlaceholderText('Search for books, authors, or ISBN...')).not.toBeInTheDocument();
        });
      });

      it('navigates to discover page with search query on Enter', async () => {
        const user = userEvent.setup();
        render(<Header />);
        
        const searchButton = screen.getByRole('button', { name: 'Toggle search' });
        await user.click(searchButton);
        
        const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
        await user.type(searchInput, 'test query');
        await user.keyboard('{Enter}');
        
        expect(mockLocation.href).toBe('/discover?q=test%20query');
      });

      it('closes search and clears query when X button is clicked', async () => {
        const user = userEvent.setup();
        render(<Header />);
        
        const searchButton = screen.getByRole('button', { name: 'Toggle search' });
        await user.click(searchButton);
        
        const searchInput = screen.getByPlaceholderText('Search for books, authors, or ISBN...');
        await user.type(searchInput, 'test query');
        
        const closeButton = screen.getByRole('button', { name: 'Close search' });
        await user.click(closeButton);
        
        await waitFor(() => {
          expect(screen.queryByPlaceholderText('Search for books, authors, or ISBN...')).not.toBeInTheDocument();
        });
      });
    });

    describe('sign out functionality', () => {
      it('calls signOut when sign out button is clicked', async () => {
        const user = userEvent.setup();
        render(<Header />);
        
        const testText = screen.getByText('Test');
        const userButton = testText.closest('button');
        if (userButton) {
          await user.click(userButton);
        }
        
        const signOutButton = screen.getByRole('button', { name: /sign out/i });
        await user.click(signOutButton);
        
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    describe('navigation links', () => {
      it('renders navigation links with correct hrefs', () => {
        render(<Header />);
        
        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        const discoverLink = screen.getByRole('link', { name: /discover/i });
        const myBooksLink = screen.getByRole('link', { name: /my books/i });
        
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');
        expect(discoverLink).toHaveAttribute('href', '/discover');
        expect(myBooksLink).toHaveAttribute('href', '/my-books');
      });
    });
  });

  describe('loading state', () => {
    it('does not render when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });
      
      const { container } = render(<Header />);
      expect(container.firstChild).toBeNull();
    });
  });
});
