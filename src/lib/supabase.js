import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjtdyyasyrpapdshoxvj.supabase.co';
const supabaseAnonKey = 'sb_publishable_BNnoB1NUpAeLUe1qFpp3NA_9kAkIDHU';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using env variable for security

// Client for the browser/anon requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for the backend with service role (bypass RLS for DB init/updates)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
