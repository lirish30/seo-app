"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClientOptions } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, warnIfUsingFallbackCredentials } from "@/lib/supabase-config";
import type { Database } from "./database.types";

let client: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export const getSupabaseBrowserClient = (
  options?: SupabaseClientOptions<"public">
) => {
  if (!client) {
    const supabaseUrl = getSupabaseUrl();
    const supabaseKey = getSupabaseAnonKey();

    warnIfUsingFallbackCredentials();

    client = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey,
      options
    });
  }

  return client;
};
