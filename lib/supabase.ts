import { createClient } from "@supabase/supabase-js";

// PENTING: file ini hanya boleh dipakai di server (API routes),
// karena pakai service role key yang punya akses penuh ke database.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
