import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { appendLocalStore } from "@/lib/server/local-store";
import { insertSupabase, isSupabaseAuthConfigured, isSupabaseConfigured, selectSupabase, upsertSupabase } from "@/lib/server/supabase-rest";
import { supabaseProjectUrl } from "@/lib/server/supabase-url";

export type AccountSession = {
  email: string;
  firstName: string;
  lastName: string;
};

type LocalUser = AccountSession & {
  id: string;
  passwordHash: string;
  salt: string;
  emailOptIn: boolean;
  createdAt: string;
};

type LocalSession = AccountSession & {
  token: string;
  createdAt: string;
};

const storeDir = path.join(process.cwd(), "data", "store");
const usersPath = path.join(storeDir, "auth-users.json");
const sessionsPath = path.join(storeDir, "auth-sessions.json");

export async function signUpAccount(input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  emailOptIn: boolean;
}) {
  if (isSupabaseAuthConfigured()) {
    return signUpSupabase(input);
  }

  return signUpLocal(input);
}

export async function loginAccount(input: { email: string; password: string }) {
  if (isSupabaseAuthConfigured()) {
    return loginSupabase(input);
  }

  return loginLocal(input);
}

export async function getLocalSession(token: string | undefined): Promise<AccountSession | undefined> {
  if (!token) return undefined;
  const sessions = await readJson<LocalSession[]>(sessionsPath, []);
  const session = sessions.find((item) => item.token === token);
  if (!session) return undefined;

  return {
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName
  };
}

async function signUpSupabase(input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  emailOptIn: boolean;
}) {
  const response = await fetch(`${supabaseProjectUrl()}/auth/v1/signup`, {
    method: "POST",
    headers: supabaseAuthHeaders(),
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        email_opt_in: input.emailOptIn
      }
    })
  });

  const payload = (await response.json()) as { user?: { id?: string; email?: string }; access_token?: string; error_description?: string; msg?: string };
  if (!response.ok) {
    return { ok: false as const, reason: payload.error_description ?? payload.msg ?? "Registrazione non riuscita." };
  }

  await persistProfile({
    authUserId: payload.user?.id,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    emailOptIn: input.emailOptIn
  });

  const session = payload.access_token
    ? {
        accessToken: payload.access_token,
        account: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName
        }
      }
    : undefined;

  return { ok: true as const, session, requiresEmailConfirmation: !payload.access_token };
}

async function loginSupabase(input: { email: string; password: string }) {
  const url = new URL(`${supabaseProjectUrl()}/auth/v1/token`);
  url.searchParams.set("grant_type", "password");

  const response = await fetch(url, {
    method: "POST",
    headers: supabaseAuthHeaders(),
    body: JSON.stringify(input)
  });

  const payload = (await response.json()) as { access_token?: string; user?: { email?: string; user_metadata?: Record<string, string> }; error_description?: string; msg?: string };
  if (!response.ok || !payload.access_token) {
    return { ok: false as const, reason: payload.error_description ?? payload.msg ?? "Accesso non riuscito." };
  }

  const account = await findProfile(input.email);

  return {
    ok: true as const,
    session: {
      accessToken: payload.access_token,
      account: account ?? {
        email: payload.user?.email ?? input.email,
        firstName: payload.user?.user_metadata?.first_name ?? "",
        lastName: payload.user?.user_metadata?.last_name ?? ""
      }
    }
  };
}

async function signUpLocal(input: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  emailOptIn: boolean;
}) {
  const email = normalizeEmail(input.email);
  const users = await readJson<LocalUser[]>(usersPath, []);
  if (users.some((user) => user.email === email)) {
    return { ok: false as const, reason: "Esiste gia un account con questa email." };
  }

  const salt = randomBytes(16).toString("hex");
  const user: LocalUser = {
    id: randomBytes(16).toString("hex"),
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    emailOptIn: input.emailOptIn,
    passwordHash: hashPassword(input.password, salt),
    salt,
    createdAt: new Date().toISOString()
  };

  users.unshift(user);
  await writeJson(usersPath, users);
  await appendLocalStore("profiles.json", {
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    emailOptIn: input.emailOptIn
  });

  if (input.emailOptIn) {
    await appendLocalStore("alert-subscriptions.json", {
      email,
      frequency: "weekly",
      filters: {},
      source: "signup"
    });
  }

  const session = await createLocalSession(user);
  return { ok: true as const, session, requiresEmailConfirmation: false };
}

async function loginLocal(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const users = await readJson<LocalUser[]>(usersPath, []);
  const user = users.find((item) => item.email === email);
  if (!user || !verifyPassword(input.password, user.salt, user.passwordHash)) {
    return { ok: false as const, reason: "Email o password non corrette." };
  }

  return { ok: true as const, session: await createLocalSession(user) };
}

async function createLocalSession(user: LocalUser) {
  const session: LocalSession = {
    token: randomBytes(24).toString("hex"),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: new Date().toISOString()
  };
  const sessions = await readJson<LocalSession[]>(sessionsPath, []);
  sessions.unshift(session);
  await writeJson(sessionsPath, sessions.slice(0, 200));

  return {
    localToken: session.token,
    account: {
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName
    }
  };
}

async function persistProfile(input: {
  authUserId?: string;
  email: string;
  firstName: string;
  lastName: string;
  emailOptIn: boolean;
}) {
  if (!isSupabaseConfigured()) return;

  const profile = {
    auth_user_id: input.authUserId,
    email: normalizeEmail(input.email),
    first_name: input.firstName,
    last_name: input.lastName,
    email_opt_in: input.emailOptIn,
    email_opt_in_at: input.emailOptIn ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  await upsertSupabase("profiles", [profile], "email");

  if (input.emailOptIn) {
    await insertSupabase("alert_subscriptions", {
      email: normalizeEmail(input.email),
      frequency: "weekly",
      filters_json: {},
      confirmed_at: new Date().toISOString()
    });
  }
}

async function findProfile(email: string): Promise<AccountSession | undefined> {
  const result = await selectSupabase<{ email: string; first_name: string; last_name: string }>("profiles", {
    select: "email,first_name,last_name",
    email: `eq.${normalizeEmail(email)}`,
    limit: "1"
  });

  if (!result.ok || result.data.length === 0) return undefined;

  return {
    email: result.data[0].email,
    firstName: result.data[0].first_name,
    lastName: result.data[0].last_name
  };
}

function supabaseAuthHeaders() {
  const key = process.env.SUPABASE_ANON_KEY ?? "";
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json"
  };
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function readJson<T>(filePath: string, fallback: T) {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson<T>(filePath: string, value: T) {
  await mkdir(storeDir, { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
