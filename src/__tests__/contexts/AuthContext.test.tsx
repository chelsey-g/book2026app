import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn((callback) => {
        Promise.resolve().then(() => callback('INITIAL_SESSION', null));
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }),
    },
  },
}));

function TestComponent() {
  const context = useAuth();
  
  return (
    <div>
      <div data-testid="user">{context.user ? context.user.email : 'No user'}</div>
      {!context.loading && <div data-testid="loaded">Loaded</div>}
    </div>
  );
}

describe('AuthContext', () => {
  describe('AuthProvider', () => {
    it('renders children', () => {
      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      );
      
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides useAuth hook with context', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });
  });

  describe('useAuth hook', () => {
    it('is provided within AuthProvider context', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('loaded')).toBeInTheDocument();
    });
  });
});
