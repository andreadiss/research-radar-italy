import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/server/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ ok: false, account: null }, { status: 401 });
  }

  return NextResponse.json({ ok: true, account });
}
