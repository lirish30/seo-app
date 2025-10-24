"use server";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./database.types";

const DEFAULT_SUPABASE_URL = "http://127.0.0.1:54321";
const DEFAULT_SUPABASE_ANON_KEY = "public-anon-key";

export const getSupabaseServerClient = () => {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? DEFAULT_SUPABASE_ANON_KEY;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase environment variables are not set. Using placeholder credentials for server preview."
    );
  }

  return createServerComponentClient<Database>({
    cookies,
    supabaseUrl,
    supabaseKey
  });
};
