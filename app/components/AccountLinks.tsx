"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

export function AccountLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnTo = `${pathname}${query ? `?${query}` : ""}`;
  const encodedReturnTo = encodeURIComponent(returnTo);

  return (
    <>
      <Link
        className="account-link"
        href={`/login?returnTo=${encodedReturnTo}`}
        onClick={() => track("auth_cta_clicked", { action: "login", path: returnTo })}
      >
        Login
      </Link>
      <Link
        className="account-link primary"
        href={`/signup?returnTo=${encodedReturnTo}`}
        onClick={() => track("auth_cta_clicked", { action: "signup", path: returnTo })}
      >
        Sign Up
      </Link>
    </>
  );
}
