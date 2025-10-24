import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error(
        "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }

    supabaseAdmin = createClient<Database>(url, serviceKey, {
      auth: {
        persistSession: false
      }
    });
  }
  return supabaseAdmin;
}
