import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Dashboard from '@/app/dashboard/page';
import { ThemeProvider } from '@/contexts/ThemeContext';

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

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = 'http://localhost:3000/';
    
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('authentication redirect', () => {
    it('redirects to home when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signOut: vi.fn(),
      });

      render(
        <ThemeProvider>
          <Dashboard />
        </ThemeProvider>
      );
      
      expect(mockLocation.href).toBe('/');
    });

    it('does not redirect when user is authenticated', () => {
      const mockUser = { id: 'test-user', email: 'test@example.com' };
      
      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: vi.fn(),
      });

      render(
        <ThemeProvider>
          <Dashboard />
        </ThemeProvider>
      );
      
      expect(mockLocation.href).toBe('http://localhost:3000/');
    });

    it('does not redirect while auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signOut: vi.fn(),
      });

      render(
        <ThemeProvider>
          <Dashboard />
        </ThemeProvider>
      );
      
      expect(mockLocation.href).toBe('http://localhost:3000/');
    });
  });
});
