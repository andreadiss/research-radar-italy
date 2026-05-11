"use client";

import { useEffect, useState } from "react";
import { Bell, Bookmark } from "lucide-react";

type FilteredActionsProps = {
  filters: Record<string, string>;
  resultCount: number;
};

export function FilteredActions({ filters, resultCount }: FilteredActionsProps) {
  const [accountEmail, setAccountEmail] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const contactEmail = accountEmail || email;

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return;

      const result = (await response.json()) as { account?: { email?: string } };
      if (active && result.account?.email) {
        setAccountEmail(result.account.email);
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);

  async function submit(kind: "saved-searches" | "alerts") {
    setIsSaving(true);
    setStatus("");

    const response = await fetch(`/api/${kind}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: contactEmail,
        frequency: "weekly",
        name: searchName(filters),
        filters
      })
    });

    setIsSaving(false);
    setStatus(response.ok ? successLabel(kind, Boolean(accountEmail)) : "Non salvato. Accedi o controlla email e riprova.");
  }

  return (
    <div className="filtered-actions" aria-label="Azioni sulla ricerca filtrata">
      <div className="filtered-actions-copy">
        <strong>{resultCount} risultati filtrati</strong>
        <span>{accountEmail ? `Useremo il tuo account: ${accountEmail}` : "Salva questa intenzione di ricerca o ricevi nuovi match."}</span>
      </div>
      {accountEmail ? (
        <div className="email-field account-email">
          <span>Account</span>
          <strong>{accountEmail}</strong>
        </div>
      ) : (
        <label className="email-field">
          <span>Email</span>
          <input
            className="input"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nome@email.it"
            type="email"
            value={email}
          />
        </label>
      )}
      <div className="filtered-actions-buttons">
        <button className="button secondary" disabled={isSaving || !contactEmail} onClick={() => submit("saved-searches")} type="button">
          <Bookmark size={17} />
          Salva ricerca
        </button>
        <button className="button primary" disabled={isSaving || !contactEmail} onClick={() => submit("alerts")} type="button">
          <Bell size={17} />
          Crea alert
        </button>
      </div>
      {status ? <p className="action-status">{status}</p> : null}
    </div>
  );
}

function searchName(filters: Record<string, string>) {
  const values = Object.values(filters).filter(Boolean);
  return values.length > 0 ? values.join(" + ") : "Ricerca Research Radar";
}

function successLabel(kind: "saved-searches" | "alerts", isAccount: boolean) {
  if (kind === "alerts") {
    return isAccount ? "Alert creato sul tuo account." : "Alert creato.";
  }

  return isAccount ? "Ricerca salvata sul tuo account." : "Ricerca salvata.";
}
