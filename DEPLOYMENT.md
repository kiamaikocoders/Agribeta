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
NEXT_PUBLIC_SITE_URL=https://agribeta.vercel.app
```

**Important:** The `NEXT_PUBLIC_SITE_URL` is crucial for password reset and email confirmation functionality. It should be set to your production domain.

## Vercel Deployment

1. **Connect your GitHub repository to Vercel**
2. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Click "Add New" for each variable
   - Add the following variables:

### Environment Variables to Add:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://qrkyzpiknmnbzegadozo.supabase.co`
- Environment: Production, Preview, Development

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDE2NjgsImV4cCI6MjA2MjU3NzY2OH0.k0AtoyorKQIvr3S0Sh8OQxLu1rJsxgdJMFn_Xngt6Jw`
- Environment: Production, Preview, Development

**Variable 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzAwMTY2OCwiZXhwIjoyMDYyNTc3NjY4fQ.J5DS4XBA9OQk9VWti2GsmnP0hJ_BsLWLDN`
- Environment: Production, Preview, Development

**Variable 4 (Recommended for Production):**
- Name: `NEXT_PUBLIC_SITE_URL`
- Value: `https://agribeta.vercel.app`
- Environment: Production, Preview

3. **Redeploy** your application by:
   - Going to Deployments tab
   - Clicking "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

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
