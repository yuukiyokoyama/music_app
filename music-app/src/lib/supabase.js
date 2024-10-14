import { createClient } from "@supabase/supabase-js";

// supabaseの初期化
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);
