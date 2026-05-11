"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import type { Route } from "next";
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

    if (result.requiresEmailConfirmation) {
      setStatus("Account creato. Controlla la mail per confermare l'accesso.");
      return;
    }

    router.push(safeReturnTo(searchParams.get("returnTo")));
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={submit}>
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
          <span>Voglio ricevere aggiornamenti email su nuove opportunita coerenti con i miei interessi.</span>
        </label>
      ) : null}
      <button className="button primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Attendi..." : isSignup ? "Crea account" : "Accedi"}
      </button>
      {status ? <p className="action-status">{status}</p> : null}
    </form>
  );
}

function safeReturnTo(value: string | null) {
  return (value?.startsWith("/") ? value : "/") as Route;
}
