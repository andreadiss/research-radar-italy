import { NextResponse } from "next/server";
import { z } from "zod";
import { loginAccount } from "@/lib/server/auth-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Inserisci email e password." }, { status: 400 });
  }

  const result = await loginAccount(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, account: result.session.account });

  if ("accessToken" in result.session) {
    response.cookies.set("rr_access_token", result.session.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
  }

  if ("localToken" in result.session) {
    response.cookies.set("rr_local_session", result.session.localToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
  }

  response.cookies.set("rr_account_name", result.session.account.firstName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
