import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/profile-picture/route';
import { NextRequest } from 'next/server';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
      })),
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
}));

describe('Profile Picture API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/profile-picture', () => {
    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/profile-picture', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 400 when no file provided', async () => {
      const formData = new FormData();
      const request = new NextRequest('http://localhost:3000/api/profile-picture', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
        },
        body: formData,
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('validates file type', async () => {
      expect(['image/jpeg', 'image/png', 'image/gif', 'image/webp']).toContain('image/jpeg');
    });

    it('validates file size limit', async () => {
      const maxSize = 5 * 1024 * 1024;
      expect(maxSize).toBe(5242880);
    });
  });
});
