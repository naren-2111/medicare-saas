import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Service role key bypasses RLS - used ONLY on the backend, never sent to frontend
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
