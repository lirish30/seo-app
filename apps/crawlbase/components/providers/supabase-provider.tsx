"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => getSupabaseBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient as unknown as SupabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
