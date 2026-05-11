import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLocalStore } from "@/lib/server/local-store";
import { getCurrentAccount } from "@/lib/server/session";
import { insertSupabase } from "@/lib/server/supabase-rest";

const savedOpportunitySchema = z.object({
  opportunityId: z.string().min(1),
  opportunityType: z.enum(["position", "grant"]),
  title: z.string().min(1),
  status: z.enum(["saved", "reading", "applying", "discarded"]).default("saved")
});

export async function POST(request: Request) {
  const parsed = savedOpportunitySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid saved opportunity payload." }, { status: 400 });
  }

  const account = await getCurrentAccount();
  const record = {
    ...(account?.profileId ? { profile_id: account.profileId } : {}),
    opportunity_id: parsed.data.opportunityId,
    opportunity_type: parsed.data.opportunityType,
    status: parsed.data.status
  };

  const result = account?.profileId
    ? await insertSupabase("saved_opportunities", record)
    : { ok: false as const, mode: "disabled" as const, reason: "No account profile id." };

  if (!result.ok && result.mode === "disabled") {
    await appendLocalStore("saved-opportunities.json", {
      email: account?.email,
      opportunityId: parsed.data.opportunityId,
      opportunityType: parsed.data.opportunityType,
      title: parsed.data.title,
      status: parsed.data.status,
      authenticated: Boolean(account)
    });
  }

  if (!result.ok && result.mode === "supabase") {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 502 });
  }

  return NextResponse.json({ ok: true, mode: result.ok ? result.mode : "local" });
}
