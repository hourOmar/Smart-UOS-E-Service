import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration.
 *
 * Reads the project URL and anon key from Vite environment
 * variables (see .env.example / .env.local):
 *
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Both must be present. If either is missing we throw immediately
 * rather than letting an unconfigured client fail later with a
 * confusing runtime error.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl && 'VITE_SUPABASE_URL',
    !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
  ]
    .filter(Boolean)
    .join(', ');

  throw new Error(
    `Missing Supabase environment variable(s): ${missing}. ` +
      'Add them to .env.local at the root of the Senior project (see .env.example).',
  );
}

/**
 * Reusable Supabase client for the app.
 *
 * Import this wherever Supabase access is needed:
 *
 *   import { supabase } from '@/services/supabase/client';
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
