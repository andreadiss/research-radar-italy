import { NextResponse } from "next/server";
import { isSupabaseAuthConfigured } from "@/lib/server/supabase-rest";
import { supabaseProjectUrl } from "@/lib/server/supabase-url";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnTo(requestUrl.searchParams.get("returnTo"));

  if (!isSupabaseAuthConfigured()) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set("returnTo", returnTo);
    loginUrl.searchParams.set("authError", "google-unavailable");
    return NextResponse.redirect(loginUrl);
  }

  const callbackUrl = new URL("/auth/callback", requestUrl.origin);
  callbackUrl.searchParams.set("returnTo", returnTo);

  const authorizeUrl = new URL(`${supabaseProjectUrl()}/auth/v1/authorize`);
  authorizeUrl.searchParams.set("provider", "google");
  authorizeUrl.searchParams.set("redirect_to", callbackUrl.toString());

  return NextResponse.redirect(authorizeUrl);
}

function safeReturnTo(value: string | null) {
  return value?.startsWith("/") ? value : "/";
}
