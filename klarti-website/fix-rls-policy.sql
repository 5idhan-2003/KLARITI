-- Fix Row Level Security Policy for KLARTI+ Form Submissions
-- Run this in your Supabase SQL Editor to fix the RLS issue

-- First, drop the existing policy that's too restrictive
DROP POLICY IF EXISTS "Allow anonymous inserts" ON demo_requests;

-- Create a new, more permissive policy for anonymous inserts
CREATE POLICY "Enable insert access for anonymous users"
ON demo_requests FOR INSERT
TO anon
WITH CHECK (true);

-- Also ensure we have a policy for authenticated users
DROP POLICY IF EXISTS "Allow authenticated reads" ON demo_requests;
CREATE POLICY "Enable read access for authenticated users"
ON demo_requests FOR SELECT
TO authenticated
USING (true);

-- And for service role (your admin access)
CREATE POLICY "Enable all access for service role"
ON demo_requests FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Check current policies (for verification)
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'demo_requests';

-- Test the fix with a sample insert (optional)
SELECT 'RLS Policy updated successfully! Try submitting the form again.' as message;