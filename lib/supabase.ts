import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('supabaseUrl is required. Please set VITE_SUPABASE_URL environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('supabaseAnonKey is required. Please set VITE_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isMockClient = supabaseUrl === 'https://mock.supabase.co';
