"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { AccountLinks } from "@/app/components/AccountLinks";
import { LogoutButton } from "@/app/components/LogoutButton";

export const accountChangedEvent = "rr:account-changed";

export function AccountNav() {
  const [name, setName] = useState("");

  useEffect(() => {
    const updateAccount = () => setName(window.localStorage.getItem("rr_account_name") ?? "");

    updateAccount();
    window.addEventListener(accountChangedEvent, updateAccount);
    window.addEventListener("storage", updateAccount);

    return () => {
      window.removeEventListener(accountChangedEvent, updateAccount);
      window.removeEventListener("storage", updateAccount);
    };
  }, []);

  if (name) {
    return (
      <nav className="account-actions" aria-label="Account">
        <Link className="account-icon-link" href="/lists" aria-label="Le mie liste" title="Le mie liste">
          <ListChecks size={17} />
          <span>Le mie liste</span>
        </Link>
        <span className="account-user">Ciao {name}</span>
        <LogoutButton />
      </nav>
    );
  }

  return (
    <nav className="account-actions" aria-label="Account">
      <Suspense fallback={<AuthFallbackLinks />}>
        <AccountLinks />
      </Suspense>
    </nav>
  );
}

function AuthFallbackLinks() {
  return (
    <>
      <Link className="account-link" href="/login">
        Login
      </Link>
      <Link className="account-link primary" href="/signup">
        Sign Up
      </Link>
    </>
  );
}
