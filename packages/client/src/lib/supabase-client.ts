import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://ypafrhayqpygdnuyhadk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwYWZyaGF5cXB5Z2RudXloYWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NzQ5NTEsImV4cCI6MjA0OTM1MDk1MX0.pOwhaTMkXlvvGewB_83LlDZ-nWt_Lfx5QK9UGhqcAaY';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 