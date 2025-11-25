import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''; // Default empty string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

// Validate variables unless using fallback for mock purposes
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is required.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'mock-key') {
  console.warn('VITE_SUPABASE_ANON_KEY is missing or using default fallback.');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Allow detection of mock client during testing
export const isMockClient = supabaseUrl === 'https://mock.supabase.co';