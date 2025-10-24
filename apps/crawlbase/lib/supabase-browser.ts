"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const DEFAULT_SUPABASE_URL = "http://127.0.0.1:54321";
const DEFAULT_SUPABASE_ANON_KEY = "public-anon-key";

let client: SupabaseClient<Database> | null = null;

export const getSupabaseBrowserClient = (
  options?: SupabaseClientOptions<"public">
) => {
  if (!client) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? DEFAULT_SUPABASE_ANON_KEY;

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.warn(
        "Supabase environment variables are not set. Using placeholder credentials for local preview."
      );
    }

    client = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey,
      options
    });
  }

  return client;
};
