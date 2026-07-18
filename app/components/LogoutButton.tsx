"use client";

import { useState } from "react";
import { accountChangedEvent } from "@/app/components/AccountNav";

export function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function logout() {
    setIsSubmitting(true);
    window.localStorage.removeItem("rr_account_name");
    window.localStorage.removeItem("rr_account_email");
    window.dispatchEvent(new Event(accountChangedEvent));
    window.location.href = "/";
  }

  return (
    <button className="account-link" disabled={isSubmitting} onClick={logout} type="button">
      Logout
    </button>
  );
}
