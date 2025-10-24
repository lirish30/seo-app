"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseAnonKey, getSupabaseUrl, warnIfUsingFallbackCredentials } from "@/lib/supabase-config";
import type { Database } from "./database.types";

export const getSupabaseServerClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();

  warnIfUsingFallbackCredentials();

  return createServerComponentClient<Database>(
    { cookies },
    {
      supabaseUrl,
      supabaseKey
    }
  );
};
