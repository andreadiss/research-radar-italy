import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLocalStore } from "@/lib/server/local-store";
import { insertSupabase } from "@/lib/server/supabase-rest";
import { getCurrentAccount } from "@/lib/server/session";

const alertSchema = z.object({
  email: z.string().email().optional(),
  frequency: z.enum(["immediate", "daily", "weekly"]).default("weekly"),
  filters: z.record(z.string()).default({})
});

export async function POST(request: Request) {
  const parsed = alertSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid alert payload." }, { status: 400 });
  }

  const account = await getCurrentAccount();
  const email = account?.email ?? parsed.data.email;
  if (!email) {
    return NextResponse.json({ ok: false, error: "Login richiesto o email mancante." }, { status: 401 });
  }

  const record = {
    ...(account?.profileId ? { profile_id: account.profileId } : {}),
    email,
    frequency: parsed.data.frequency,
    filters_json: parsed.data.filters,
    confirmed_at: account ? new Date().toISOString() : undefined
  };
  const result = await insertSupabase("alert_subscriptions", record);

  if (!result.ok && result.mode === "disabled") {
    await appendLocalStore("alert-subscriptions.json", {
      email,
      accountEmail: account?.email,
      frequency: parsed.data.frequency,
      filters: parsed.data.filters,
      authenticated: Boolean(account)
    });
  }

  if (!result.ok && result.mode === "supabase") {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true, mode: result.ok ? result.mode : "local" });
}
