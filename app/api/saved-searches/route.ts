import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLocalStore } from "@/lib/server/local-store";
import { insertSupabase } from "@/lib/server/supabase-rest";
import { getCurrentAccount } from "@/lib/server/session";

const savedSearchSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(120),
  filters: z.record(z.string()).default({})
});

export async function POST(request: Request) {
  const parsed = savedSearchSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid saved search payload." }, { status: 400 });
  }

  const account = await getCurrentAccount();
  const email = account?.email ?? parsed.data.email;
  if (!email) {
    return NextResponse.json({ ok: false, error: "Login richiesto o email mancante." }, { status: 401 });
  }

  const record = {
    ...(account?.profileId ? { profile_id: account.profileId } : {}),
    user_email: email,
    name: parsed.data.name,
    filters_json: parsed.data.filters
  };
  const result = await insertSupabase("saved_searches", record);

  if (!result.ok && result.mode === "disabled") {
    await appendLocalStore("saved-searches.json", {
      email,
      accountEmail: account?.email,
      name: parsed.data.name,
      filters: parsed.data.filters,
      authenticated: Boolean(account)
    });
  }

  if (!result.ok && result.mode === "supabase") {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true, mode: result.ok ? result.mode : "local" });
}
