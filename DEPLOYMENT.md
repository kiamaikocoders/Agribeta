# Deployment Instructions

## Environment Variables Required

The following environment variables must be configured in your deployment platform (Vercel, Netlify, etc.):

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://qrkyzpiknmnbzegadozo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDE2NjgsImV4cCI6MjA2MjU3NzY2OH0.k0AtoyorKQIvr3S0Sh8OQxLu1rJsxgdJMFn_Xngt6Jw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzAwMTY2OCwiZXhwIjoyMDYyNTc3NjY4fQ.J5DS4XBA9OQk9VWti2GsmnP0hJ_BsLWLDN
```

### Optional Variables:
```
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Vercel Deployment

1. **Connect your GitHub repository to Vercel**
2. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add each variable listed above
3. **Redeploy** your application

## Netlify Deployment

1. **Connect your GitHub repository to Netlify**
2. **Add Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add each variable listed above
3. **Redeploy** your application

## Manual Deployment

If deploying manually, ensure these variables are available in your deployment environment.

## Troubleshooting

- **Build Error**: "Missing NEXT_PUBLIC_SUPABASE_URL" → Check environment variables are set
- **Database Errors**: Ensure Supabase project is active and RLS policies are configured
- **Authentication Issues**: Verify anon key and service role key are correct
