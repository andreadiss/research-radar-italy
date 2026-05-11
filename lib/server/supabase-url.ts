export function supabaseProjectUrl() {
  return normalizeSupabaseUrl(process.env.SUPABASE_URL);
}

export function normalizeSupabaseUrl(value?: string) {
  if (!value) return "";

  return value
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "")
    .replace(/\/auth\/v1$/i, "");
}
