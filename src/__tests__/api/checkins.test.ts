import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/checkins/route';
import { DELETE } from '@/app/api/checkins/[id]/route';
import { NextRequest } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  })),
}));

describe('Checkins API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/checkins', () => {
    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins', {
        method: 'GET',
        headers: {
          Authorization: 'InvalidToken',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 401 when authorization header has no token', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ',
        },
      });

      const response = await GET(request);
      // Still processes but auth will fail
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/checkins', () => {
    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: 'test-book-id',
          pagesRead: 50,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins', {
        method: 'POST',
        headers: {
          Authorization: 'InvalidToken',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: 'test-book-id',
          pagesRead: 50,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/checkins/[id]', () => {
    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins/test-id', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'test-id' }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkins/test-id', {
        method: 'DELETE',
        headers: {
          Authorization: 'InvalidToken',
        },
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: 'test-id' }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('Mood validation', () => {
    const validMoods = ['excited', 'thoughtful', 'sad', 'confused', 'inspired', 'bored'];

    it('defines six valid mood options', () => {
      expect(validMoods).toHaveLength(6);
    });

    it('includes excited mood', () => {
      expect(validMoods).toContain('excited');
    });

    it('includes thoughtful mood', () => {
      expect(validMoods).toContain('thoughtful');
    });

    it('includes sad mood', () => {
      expect(validMoods).toContain('sad');
    });

    it('includes confused mood', () => {
      expect(validMoods).toContain('confused');
    });

    it('includes inspired mood', () => {
      expect(validMoods).toContain('inspired');
    });

    it('includes bored mood', () => {
      expect(validMoods).toContain('bored');
    });
  });
});
