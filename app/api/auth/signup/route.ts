import { NextResponse } from "next/server";
import { z } from "zod";
import { signUpAccount } from "@/lib/server/auth-store";

const signUpSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  emailOptIn: z.boolean().default(false)
});

export async function POST(request: Request) {
  const parsed = signUpSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Controlla i campi e usa una password di almeno 8 caratteri." }, { status: 400 });
  }

  const result = await signUpAccount(parsed.data);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
  }

  const response = NextResponse.json({
    ok: true,
    account: result.session?.account,
    requiresEmailConfirmation: result.requiresEmailConfirmation
  });

  if (result.session && "accessToken" in result.session) {
    response.cookies.set("rr_access_token", result.session.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
  }

  if (result.session && "localToken" in result.session) {
    response.cookies.set("rr_local_session", result.session.localToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
  }

  if (result.session?.account) {
    response.cookies.set("rr_account_name", result.session.account.firstName, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
  }

  return response;
}
