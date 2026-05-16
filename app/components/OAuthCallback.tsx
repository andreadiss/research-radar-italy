"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useEffect, useState } from "react";

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Accesso Google in corso...");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const error = hashParams.get("error_description") ?? hashParams.get("error");

    if (error) {
      setStatus(error);
      return;
    }

    if (!accessToken) {
      setStatus("Accesso Google non completato.");
      return;
    }

    fetch("/api/auth/oauth-session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken })
    })
      .then(async (response) => {
        const result = (await response.json()) as { ok: boolean; error?: string };
        if (!response.ok || !result.ok) {
          throw new Error(result.error ?? "Accesso Google non riuscito.");
        }

        router.replace(safeReturnTo(searchParams.get("returnTo")));
        router.refresh();
      })
      .catch((caughtError: Error) => {
        setStatus(caughtError.message);
      });
  }, [router, searchParams]);

  return (
    <main className="shell auth-callback-shell">
      <section className="auth-modal">
        <h1>Login Google</h1>
        <p>{status}</p>
      </section>
    </main>
  );
}

function safeReturnTo(value: string | null) {
  return (value?.startsWith("/") ? value : "/") as Route;
}
