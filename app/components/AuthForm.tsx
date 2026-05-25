"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { Route } from "next";
import { track } from "@/lib/client-analytics";
import { useState } from "react";

type AuthFormProps =
  | {
      mode: "login";
    }
  | {
      mode: "signup";
    };

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";
  const authError = searchParams.get("authError");

  function startGoogleAuth() {
    track("auth_google_clicked", { mode });
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(safeReturnTo(searchParams.get("returnTo")))}`;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = isSignup
      ? {
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          emailOptIn: formData.get("emailOptIn") === "on"
        }
      : {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? "")
        };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = (await response.json()) as { ok: boolean; error?: string; requiresEmailConfirmation?: boolean };

    setIsSubmitting(false);

    if (!response.ok || !result.ok) {
      setStatus(result.error ?? "Operazione non riuscita.");
      return;
    }

    router.push(authReturnTo(searchParams.get("returnTo"), mode, result.requiresEmailConfirmation));
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <button className="button google-auth-button" onClick={startGoogleAuth} type="button">
        <GoogleMark />
        Continua con Google
      </button>
      <div className="auth-divider">
        <span>oppure</span>
      </div>
      {isSignup ? (
        <>
          <label>
            Nome
            <input className="input" name="firstName" placeholder="Nome" required />
          </label>
          <label>
            Cognome
            <input className="input" name="lastName" placeholder="Cognome" required />
          </label>
        </>
      ) : null}
      <label>
        Email
        <input className="input" name="email" placeholder="nome@email.it" required type="email" />
      </label>
      <label>
        Password
        <input
          className="input"
          minLength={isSignup ? 8 : undefined}
          name="password"
          placeholder={isSignup ? "Crea una password" : "Password"}
          required
          type="password"
        />
      </label>
      {isSignup ? (
        <label className="checkbox-field">
          <input name="emailOptIn" type="checkbox" />
          <span>Voglio ricevere aggiornamenti email su nuove opportunitÃ  coerenti con i miei interessi.</span>
        </label>
      ) : null}
      <button className="button primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Attendi..." : isSignup ? "Crea account" : "Accedi"}
      </button>
      {authError === "google-unavailable" ? (
        <p className="action-status">Accesso Google non configurato in questo ambiente.</p>
      ) : null}
      {status ? <p className="action-status">{status}</p> : null}
    </form>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function safeReturnTo(value: string | null) {
  return (value?.startsWith("/") ? value : "/") as Route;
}

function authReturnTo(value: string | null, mode: "login" | "signup", requiresEmailConfirmation?: boolean) {
  const target = new URL(safeReturnTo(value), window.location.origin);

  if (mode === "signup") {
    target.searchParams.set("auth", requiresEmailConfirmation ? "check-email" : "signup-complete");
  }

  return `${target.pathname}${target.search}${target.hash}` as Route;
}
