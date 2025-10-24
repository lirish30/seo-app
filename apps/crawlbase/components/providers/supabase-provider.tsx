"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => getSupabaseBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
