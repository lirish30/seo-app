import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl, warnIfUsingFallbackCredentials } from "@/lib/supabase-config";
import type { Database } from "../database.types";

let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!supabaseAdmin) {
    const url = getSupabaseUrl();
    const serviceKey = getSupabaseServiceRoleKey();

    warnIfUsingFallbackCredentials();

    supabaseAdmin = createClient<Database>(url, serviceKey, {
      auth: {
        persistSession: false
      }
    });
  }
  return supabaseAdmin;
}
