const FALLBACK_SUPABASE_URL = "https://dglgybhwgjqvmwrjpzxd.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbGd5Ymh3Z2pxdm13cmpwenhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTg0NzAsImV4cCI6MjA3Njg5NDQ3MH0.SuwO0X2tdsjs5Wn80x7tTyxYJTvmlvQKCDCbqosKoSk";

export const getSupabaseUrl = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
};

export const getSupabaseAnonKey = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY;
};

export const getSupabaseServiceRoleKey = () => {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    FALLBACK_SUPABASE_ANON_KEY
  );
};

export const warnIfUsingFallbackCredentials = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase environment variables are not set. Using provided project credentials for preview."
    );
  }
};

