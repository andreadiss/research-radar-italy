"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function AccountLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnTo = `${pathname}${query ? `?${query}` : ""}`;
  const encodedReturnTo = encodeURIComponent(returnTo);

  return (
    <>
      <Link className="account-link" href={`/login?returnTo=${encodedReturnTo}`}>
        Login
      </Link>
      <Link className="account-link primary" href={`/signup?returnTo=${encodedReturnTo}`}>
        Sign Up
      </Link>
    </>
  );
}
