# 🚀 Lofi Radio Terminal - Setup Guide

## Environment Variables Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and wait for creation

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon/Public Key**: Starts with `eyJhbGciOiJIUzI1NiIs...`
   - **Service Role Key**: Starts with `eyJhbGciOiJIUzI1NiIs...` (different from anon key)

### 3. Setup Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

### 4. Setup Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to create the tables

### 5. Enable Real-time

1. Go to **Database** → **Replication**
2. Enable real-time for:
   - `chat_messages` table
   - `active_visitors` table

### 6. Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Look for the chat card in the bottom-right corner
4. Try setting a username and sending a message
5. Check the visitor counter in the header

## Features Enabled by Environment Variables

### ✅ Live Chat System
- Real-time messaging between users
- Username persistence
- Connection status indicators
- Message history

### ✅ Visitor Tracking
- Live visitor count in header
- Session-based tracking
- Automatic cleanup of inactive visitors

### ✅ Secure API Routes
- Server-side database operations
- Protected service role key
- Better error handling

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Ensure `.env.local` exists in project root
   - Check all three variables are set
   - Restart dev server after adding variables

2. **Chat not working**
   - Verify database schema was created
   - Check real-time is enabled
   - Look for errors in browser console

3. **Visitor count not updating**
   - Check API routes are working: `/api/visitors/active`
   - Verify `active_visitors` table exists
   - Check browser network tab for API errors

### Debug Commands:

```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Test API endpoints directly
curl http://localhost:3000/api/chat/messages?roomId=general&limit=5
```

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Service Role Key** has admin access - keep it secret
- **Anon Key** is safe for client-side use
- Consider adding rate limiting for production

## Optional Enhancements

### Vercel Analytics (Optional)
If you want to track usage analytics:

1. Get your Vercel Analytics ID from Vercel dashboard
2. Add to `.env.local`:
   ```env
   VERCEL_ANALYTICS_ID=your_analytics_id
   ```

### Custom Domain (Production)
When deploying to production, update your Supabase URL if using a custom domain.

## Need Help?

- Check the `SUPABASE_SETUP.md` file for detailed database setup
- Look at the browser console for error messages
- Check the terminal for API route errors
- Verify your Supabase project is active and running

---

**🎧 Ready to enjoy some lofi beats with live chat! 🎧**