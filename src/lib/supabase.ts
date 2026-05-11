import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://example.supabase.co';
const FALLBACK_KEY = 'missing-supabase-key';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
const SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — safe in browser, respects RLS
export const supabase = createClient(URL, ANON);

// Admin client — bypasses RLS, server-side only
export const supabaseAdmin = createClient(URL, SRK || ANON);
