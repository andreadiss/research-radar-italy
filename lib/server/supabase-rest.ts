import { supabaseProjectUrl } from "@/lib/server/supabase-url";

type SupabaseWriteResult =
  | { ok: true; mode: "supabase" }
  | { ok: false; mode: "disabled"; reason: string }
  | { ok: false; mode: "supabase"; reason: string };

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabaseAuthConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export async function insertSupabase(table: string, record: Record<string, unknown>): Promise<SupabaseWriteResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, mode: "disabled", reason: "Supabase environment variables are not configured." };
  }

  const response = await fetch(`${supabaseProjectUrl()}/rest/v1/${table}`, {
    method: "POST",
    headers: supabaseHeaders({ prefer: "return=minimal" }),
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    return { ok: false, mode: "supabase", reason: await response.text() };
  }

  return { ok: true, mode: "supabase" };
}

export async function upsertSupabase(
  table: string,
  records: Array<Record<string, unknown>>,
  onConflict: string
): Promise<SupabaseWriteResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, mode: "disabled", reason: "Supabase environment variables are not configured." };
  }

  if (records.length === 0) {
    return { ok: true, mode: "supabase" };
  }

  const url = new URL(`${supabaseProjectUrl()}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", onConflict);

  const response = await fetch(url, {
    method: "POST",
    headers: supabaseHeaders({ prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(records)
  });

  if (!response.ok) {
    return { ok: false, mode: "supabase", reason: await response.text() };
  }

  return { ok: true, mode: "supabase" };
}

export async function selectSupabase<T>(
  table: string,
  query: Record<string, string>
): Promise<{ ok: true; data: T[] } | { ok: false; mode: "disabled" | "supabase"; reason: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, mode: "disabled", reason: "Supabase environment variables are not configured." };
  }

  const url = new URL(`${supabaseProjectUrl()}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: supabaseHeaders({ prefer: "" })
  });

  if (!response.ok) {
    return { ok: false, mode: "supabase", reason: await response.text() };
  }

  return { ok: true, data: (await response.json()) as T[] };
}

function supabaseHeaders({ prefer }: { prefer: string }) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    prefer
  };
}
