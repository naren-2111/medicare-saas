import { createClient } from "@supabase/supabase-js";

// Anon key is safe to expose in frontend - RLS protects the data
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
