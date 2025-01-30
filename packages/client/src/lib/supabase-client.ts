import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : undefined
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '[HIDDEN]' : undefined
  });
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
); 