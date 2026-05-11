import { cookies } from "next/headers";
import { getLocalSession, type AccountSession } from "@/lib/server/auth-store";
import { selectSupabase } from "@/lib/server/supabase-rest";

export type CurrentAccount = AccountSession & {
  profileId?: string;
};

export async function getCurrentAccount(): Promise<CurrentAccount | undefined> {
  const cookieStore = cookies();
  const localSession = await getLocalSession(cookieStore.get("rr_local_session")?.value);
  if (localSession) {
    return localSession;
  }

  const accessToken = cookieStore.get("rr_access_token")?.value;
  if (!accessToken || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return undefined;
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) return undefined;

  const user = (await response.json()) as {
    email?: string;
    user_metadata?: Record<string, string>;
  };
  if (!user.email) return undefined;

  const profile = await selectSupabase<{ id: string; email: string; first_name: string; last_name: string }>("profiles", {
    select: "id,email,first_name,last_name",
    email: `eq.${user.email.toLowerCase()}`,
    limit: "1"
  });

  if (profile.ok && profile.data.length > 0) {
    return {
      profileId: profile.data[0].id,
      email: profile.data[0].email,
      firstName: profile.data[0].first_name,
      lastName: profile.data[0].last_name
    };
  }

  return {
    email: user.email,
    firstName: user.user_metadata?.first_name ?? "",
    lastName: user.user_metadata?.last_name ?? ""
  };
}
