import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { config } from '../config';

export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
); 