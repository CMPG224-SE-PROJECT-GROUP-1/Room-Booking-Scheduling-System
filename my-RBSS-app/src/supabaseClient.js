import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  process.env.VITE_SUPABASE_URL;

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  process.env.VITE_SUPABASE_ANON_KEY;

console.log('LOADED_URL:', JSON.stringify(supabaseUrl));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
