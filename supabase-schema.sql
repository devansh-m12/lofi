-- Enable RLS (Row Level Security)
-- Run these commands in your Supabase SQL editor

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_id UUID,
  room_id TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create active_visitors table
CREATE TABLE IF NOT EXISTS active_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address INET,
  room_id TEXT NOT NULL DEFAULT 'general',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_rooms (allow read for everyone)
DROP POLICY IF EXISTS "Anyone can view chat rooms" ON chat_rooms;
CREATE POLICY "Anyone can view chat rooms" ON chat_rooms
  FOR SELECT USING (true);

-- Create policies for chat_messages (allow read and insert for everyone)
DROP POLICY IF EXISTS "Anyone can view messages" ON chat_messages;
CREATE POLICY "Anyone can view messages" ON chat_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can send messages" ON chat_messages;
CREATE POLICY "Anyone can send messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Create policies for active_visitors (allow read, insert, update for everyone)
DROP POLICY IF EXISTS "Anyone can view active visitors" ON active_visitors;
CREATE POLICY "Anyone can view active visitors" ON active_visitors
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert visitor sessions" ON active_visitors;
CREATE POLICY "Anyone can insert visitor sessions" ON active_visitors
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update visitor sessions" ON active_visitors;
CREATE POLICY "Anyone can update visitor sessions" ON active_visitors
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete visitor sessions" ON active_visitors;
CREATE POLICY "Anyone can delete visitor sessions" ON active_visitors
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_messages_room_id_idx ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS active_visitors_session_id_idx ON active_visitors(session_id);
CREATE INDEX IF NOT EXISTS active_visitors_room_id_idx ON active_visitors(room_id);
CREATE INDEX IF NOT EXISTS active_visitors_last_seen_idx ON active_visitors(last_seen);

-- Insert default chat room
INSERT INTO chat_rooms (id, name) VALUES ('general', 'General Chat') 
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for chat_messages and active_visitors
-- Use DO block to handle existing publication memberships
DO $$
BEGIN
  -- Try to drop chat_messages from publication if it exists
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE chat_messages;
  EXCEPTION
    WHEN undefined_object THEN
      -- Table not in publication, continue
      NULL;
  END;
  
  -- Add chat_messages to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  
  -- Try to drop active_visitors from publication if it exists
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE active_visitors;
  EXCEPTION
    WHEN undefined_object THEN
      -- Table not in publication, continue
      NULL;
  END;
  
  -- Add active_visitors to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE active_visitors;
END $$;

-- Function to clean up old visitor sessions (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_inactive_visitors()
RETURNS void AS $$
BEGIN
  DELETE FROM active_visitors 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically cleanup inactive visitors
-- This will run every time there's an update to the active_visitors table
CREATE OR REPLACE FUNCTION trigger_cleanup_inactive_visitors()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_inactive_visitors();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- You can also set up a periodic job to run cleanup (optional)
-- This requires the pg_cron extension in Supabase
-- SELECT cron.schedule('cleanup-inactive-visitors', '*/2 * * * *', 'SELECT cleanup_inactive_visitors();'); 