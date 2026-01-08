CREATE POLICY "Authenticated users can insert books" ON public.books
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update books" ON public.books
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);
