-- Add DELETE policy for visitor_records to match existing public access pattern
CREATE POLICY "Public can delete visitor records"
ON public.visitor_records
FOR DELETE
USING (true);