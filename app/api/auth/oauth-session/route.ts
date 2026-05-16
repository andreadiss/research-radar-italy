import { NextResponse } from "next/server";
import { z } from "zod";
import { completeOAuthSession } from "@/lib/server/auth-store";

const oauthSessionSchema = z.object({
  accessToken: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = oauthSessionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Token Google mancante." }, { status: 400 });
  }

  const result = await completeOAuthSession(parsed.data.accessToken);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, account: result.session.account });

  response.cookies.set("rr_access_token", result.session.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  response.cookies.set("rr_account_name", result.session.account.firstName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
