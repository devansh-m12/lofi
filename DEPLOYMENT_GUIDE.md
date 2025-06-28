# 🚀 Netlify Deployment Guide

## Quick Deployment Steps

### 1. Environment Variables Setup

Before deploying, you need to set up your environment variables in Netlify:

1. **Copy your environment variables** from `.env.local`
2. **In Netlify Dashboard**:
   - Go to your site settings
   - Navigate to "Environment variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
     SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
     ```

### 2. Build Settings

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Node version: 18
- Proper redirects for API routes
- Static export configuration

### 3. Deploy Options

#### Option A: Git-based Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

#### Option B: Manual Deployment
1. Run `npm run build` locally
2. Upload the `.next` folder to Netlify
3. Set environment variables in Netlify dashboard

## Common Deployment Issues & Fixes

### Issue 1: "Missing Environment Variables"
**Solution**: Add all required environment variables in Netlify dashboard under Site Settings → Environment Variables

### Issue 2: "API Routes Not Working"
**Solution**: The `netlify.toml` file includes redirects for API routes. Make sure it's in your project root.

### Issue 3: "Build Fails"
**Solution**: 
- Check Node.js version (should be 18+)
- Ensure all dependencies are installed
- Check for TypeScript errors

### Issue 4: "Static Export Issues"
**Solution**: The `next.config.ts` is configured for static export with:
- `output: 'export'`
- `images: { unoptimized: true }`
- `trailingSlash: true`

## Environment Variables Required

```env
# Required for Supabase functionality
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Optional
VERCEL_ANALYTICS_ID=your_analytics_id
```

## Netlify-Specific Configuration

The project includes:

1. **netlify.toml** - Build and redirect configuration
2. **Static export** - Compatible with Netlify's static hosting
3. **API route redirects** - Ensures API endpoints work correctly
4. **Image optimization disabled** - Required for static export

## Testing Your Deployment

After deployment:

1. **Check the main page** loads correctly
2. **Test the lofi radio** functionality
3. **Verify chat system** works (if Supabase is configured)
4. **Check visitor counter** in header
5. **Test theme switching**

## Performance Optimizations

The deployment includes:
- Static export for faster loading
- Optimized images for web
- Compressed assets
- CDN distribution via Netlify

## Troubleshooting Commands

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run lint

# Test environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables are set
3. Test the build locally first
4. Check browser console for errors

---

**🎧 Your lofi radio terminal will be live soon! 🎧**