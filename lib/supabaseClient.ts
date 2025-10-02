import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrkyzpiknmnbzegadozo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya3l6cGlrbm1uYnplZ2Fkb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDE2NjgsImV4cCI6MjA2MjU3NzY2OH0.k0AtoyorKQIvr3S0Sh8OQxLu1rJsxgdJMFn_Xngt6Jw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 