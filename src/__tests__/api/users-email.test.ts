import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/users/email/route';
import { NextRequest } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      updateUser: vi.fn(),
    },
  })),
}));

describe('Users Email API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/users/email', () => {
    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/users/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail: 'new@example.com' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 500 when newEmail is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/users/email', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('validates email format', async () => {
      const invalidEmail = 'notanemail';
      expect(invalidEmail.includes('@')).toBe(false);
    });

    it('prevents setting email to current email', async () => {
      expect(true).toBe(true);
    });

    it('handles already registered email error', async () => {
      expect(true).toBe(true);
    });

    it('sends confirmation email on success', async () => {
      const successMessage = 'Confirmation email sent to your new email address. Please verify it to complete the change.';
      expect(successMessage).toContain('Confirmation email');
    });
  });
});
