-- Create avatar_images storage bucket with RLS policies
-- This migration sets up the storage bucket for user avatar images

-- Ensure the avatar_images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatar_images', 'avatar_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop any existing policies for avatar_images to avoid conflicts
DROP POLICY IF EXISTS "Public read access for avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatar images" ON storage.objects;

-- Allow public read access to all files in avatar_images bucket
-- This ensures avatars can be displayed without authentication
CREATE POLICY "Public read access for avatar images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatar_images');

-- Allow authenticated users to upload to avatar_images
CREATE POLICY "Authenticated users can upload avatar images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatar_images');

-- Allow authenticated users to update files in avatar_images
CREATE POLICY "Authenticated users can update avatar images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatar_images')
WITH CHECK (bucket_id = 'avatar_images');

-- Allow authenticated users to delete files in avatar_images
CREATE POLICY "Authenticated users can delete avatar images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatar_images');
