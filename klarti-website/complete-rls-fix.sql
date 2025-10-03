-- Complete RLS Fix for KLARTI+ Demo Requests
-- This will completely reset and fix the RLS policies

-- Step 1: Temporarily disable RLS to clear any conflicts
ALTER TABLE demo_requests DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous inserts" ON demo_requests;
DROP POLICY IF EXISTS "Allow authenticated reads" ON demo_requests;
DROP POLICY IF EXISTS "Allow authenticated updates" ON demo_requests;
DROP POLICY IF EXISTS "Enable insert access for anonymous users" ON demo_requests;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON demo_requests;
DROP POLICY IF EXISTS "Enable all access for service role" ON demo_requests;

-- Step 3: Re-enable RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, working policies

-- Allow anyone to insert (for website form submissions)
CREATE POLICY "website_inserts" ON demo_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow service role to do everything (for your admin access)
CREATE POLICY "service_role_all" ON demo_requests
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Allow authenticated users to read (if you plan to have user accounts)
CREATE POLICY "authenticated_read" ON demo_requests
  FOR SELECT USING (
    auth.role() = 'authenticated' OR
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Step 5: Grant necessary permissions
GRANT INSERT ON demo_requests TO anon;
GRANT ALL ON demo_requests TO service_role;
GRANT SELECT ON demo_requests TO authenticated;

-- Step 6: Test the setup
INSERT INTO demo_requests (institution_name, contact_email, institution_type, message)
VALUES ('Test Institution', 'test@example.com', 'university', 'Test message from SQL');

-- Step 7: Verify the test data was inserted
SELECT COUNT(*) as total_records FROM demo_requests;

-- Success message
SELECT 'RLS policies have been completely reset and fixed!' as message;
SELECT 'You can now try the form submission again.' as next_step;