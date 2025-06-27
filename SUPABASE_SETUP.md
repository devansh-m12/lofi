# Supabase Live Chat Setup Guide (API-Based)

This guide will help you set up Supabase for the live chat functionality using secure API routes.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details and wait for the database to be created

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy your:
   - **Project URL** (something like `https://yourprojectref.supabase.co`)
   - **Anon/Public API Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`) - **Keep this secret!**

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Public keys (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Server-only key (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace the values with your actual credentials from step 2.

## 4. Create Database Tables

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Click "Run" to execute the SQL commands

This will create:
- `chat_rooms` table for managing different chat rooms
- `chat_messages` table for storing all messages
- Proper Row Level Security (RLS) policies
- Real-time subscriptions
- Performance indexes

## 5. Enable Real-time

1. In your Supabase dashboard, go to "Database" > "Replication"
2. Make sure the `chat_messages` table is enabled for real-time
3. If it's not already enabled, toggle it on

## 6. Test the Connection

1. Start your development server: `npm run dev`
2. Open your application in a browser
3. The chat card should appear in the bottom right
4. Click "TEST CONNECTION" to verify API connectivity
5. Set a username and try sending a message
6. Open another browser window/tab to test real-time messaging

## 7. New Features

### API-Based Architecture
- All database operations now go through secure API routes
- Better error handling and debugging
- More secure (credentials stay on server)

### Enhanced UI
- **Connection Status**: Live indicator showing LIVE/CONNECTING/ERROR/DISCONNECTED
- **Logout Button**: Click the ↪ button to logout and change username
- **Test Connection**: Button to verify API connectivity
- **User Info**: Shows current logged-in username
- **Better Error Messages**: More detailed error reporting

### Keyboard Shortcuts
- Press 'C' to minimize/maximize chat
- Enter to send messages
- Enter to confirm username

## 8. Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Make sure `.env.local` file exists in your project root
   - Check that all three environment variables are set
   - Restart your development server after adding the file

2. **API Connection errors**
   - Use the "TEST CONNECTION" button to verify API connectivity
   - Check browser console for detailed error messages
   - Verify your Supabase URL and keys are correct
   - Ensure your Supabase project is running

3. **Real-time not working**
   - Verify that real-time is enabled for the `chat_messages` table
   - Check browser console for EventSource errors
   - Make sure the SQL schema was executed properly
   - Try refreshing the page

4. **"Failed to send message" errors**
   - Check that the `chat_messages` table exists
   - Verify RLS policies allow public inserts
   - Check API route logs in terminal for detailed errors

5. **Permission denied errors**
   - Review the RLS policies in the SQL schema
   - Ensure the policies allow public read/write access
   - Try disabling RLS temporarily for testing

### Debug Steps:

1. **Check API Routes**: Visit these URLs directly in your browser:
   - `http://localhost:3000/api/chat/messages?roomId=general&limit=5`
   - Should return JSON with messages array

2. **Check Environment Variables**: Add this to any page to debug:
   ```javascript
   console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('Has ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   console.log('Has SERVICE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
   ```

3. **Check Browser Console**: Look for errors in the browser's developer tools

4. **Check Server Logs**: Watch your terminal for API route error messages

## 9. Architecture Overview

```
Client (ChatCard) 
    ↓ HTTP Requests
API Routes (/api/chat/*)
    ↓ Server-side calls
Supabase Database
    ↓ Real-time updates
EventSource (Server-Sent Events)
    ↓ Real-time data
Client (ChatCard)
```

## 10. API Endpoints

- `GET /api/chat/messages?roomId=general&limit=50` - Fetch messages
- `POST /api/chat/send` - Send a new message
- `GET /api/chat/realtime?roomId=general` - Real-time message stream

## 11. Security Notes

- API routes use server-side authentication
- Service role key is kept secure on the server
- Client only receives public data
- Rate limiting can be added to API routes
- Messages are validated server-side

## 12. Customization

You can customize the chat by modifying:

- **Room ID**: Change the `roomId` in `ChatCard.tsx`
- **Message limits**: Adjust limits in API routes
- **Validation**: Add custom validation in `/api/chat/send`
- **Themes**: The chat automatically adapts to your termina-ui theme
- **Real-time**: Customize the EventSource handling in `useChat.ts`

## Features

- **Real-time messaging**: Messages appear instantly across all connected clients
- **Username persistence**: Usernames are saved in localStorage
- **Connection status**: Shows LIVE/CONNECTING/ERROR status
- **Message history**: Loads the last 50 messages on connection
- **Responsive design**: Works on desktop and mobile
- **Keyboard shortcuts**: Press 'C' to minimize/maximize chat

## Security Notes

- The current setup allows anonymous messaging (no authentication required)
- All messages are publicly visible
- For production use, consider adding proper user authentication
- You may want to add message moderation and rate limiting 