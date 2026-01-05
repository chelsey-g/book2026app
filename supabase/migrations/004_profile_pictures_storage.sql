-- Storage RLS policies for profile-pictures bucket

CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "Public read access for profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can update profile pictures"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can delete profile pictures"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures');
