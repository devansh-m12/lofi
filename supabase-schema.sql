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

-- Enable Row Level Security
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_rooms (allow read for everyone)
CREATE POLICY "Anyone can view chat rooms" ON chat_rooms
  FOR SELECT USING (true);

-- Create policies for chat_messages (allow read and insert for everyone)
CREATE POLICY "Anyone can view messages" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_messages_room_id_idx ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);

-- Insert default chat room
INSERT INTO chat_rooms (id, name) VALUES ('general', 'General Chat') 
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; 