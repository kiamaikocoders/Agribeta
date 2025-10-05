import { createClient } from '@supabase/supabase-js';

// Prefer environment variables; fall back to known values for local/dev.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qrkyzpiknmnbzegadozo.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDE2NjgsImV4cCI6MjA2MjU3NzY2OH0.k0AtoyorKQIvr3S0Sh8OQxLu1rJsxgdJMFn_Xngt6Jw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the site URL for redirects and email confirmations
 * Uses environment variable if available, otherwise falls back to localhost for development
 * or the production URL for production builds
 */
export function getSiteUrl(): string {
  // If we have an explicit site URL from environment, use it
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.endsWith('/') 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : `${process.env.NEXT_PUBLIC_SITE_URL}/`;
  }
  
  // Fallback based on environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.agribeta.com/';
  }
  
  // Development fallback
  return 'http://localhost:3000/';
}