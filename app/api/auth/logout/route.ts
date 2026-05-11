import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of ["rr_access_token", "rr_local_session", "rr_account_name"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
  }

  return response;
}
