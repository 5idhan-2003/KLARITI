-- KLARTI+ Database Schema
-- Copy and paste this entire code block into your Supabase SQL Editor

-- Create demo_requests table to store all form submissions
CREATE TABLE demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  institution_type VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  follow_up_date DATE,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_email ON demo_requests(contact_email);
CREATE INDEX idx_demo_requests_institution_type ON demo_requests(institution_type);

-- Enable Row Level Security (RLS)
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous inserts from the website
CREATE POLICY "Allow anonymous inserts" ON demo_requests
  FOR INSERT WITH CHECK (true);

-- Policy to allow authenticated users (you) to read all requests
CREATE POLICY "Allow authenticated reads" ON demo_requests
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Policy to allow authenticated users to update records (for status changes, notes, etc.)
CREATE POLICY "Allow authenticated updates" ON demo_requests
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Optional: Create a view for easy analytics
CREATE OR REPLACE VIEW demo_requests_summary AS
SELECT
  institution_type,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_requests,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
  COUNT(CASE WHEN status = 'demo_scheduled' THEN 1 END) as demo_scheduled,
  COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed,
  MAX(created_at) as latest_request
FROM demo_requests
GROUP BY institution_type
ORDER BY total_requests DESC;

-- Grant access to the view for authenticated users
GRANT SELECT ON demo_requests_summary TO authenticated;
GRANT SELECT ON demo_requests_summary TO service_role;

-- Insert some sample statuses for reference (optional)
-- You can update requests with these statuses for better organization
COMMENT ON COLUMN demo_requests.status IS 'Possible values: new, contacted, demo_scheduled, qualified, closed, not_interested';

-- Success message
SELECT 'Database schema created successfully! You can now view the demo_requests table in your Supabase dashboard.' as message;