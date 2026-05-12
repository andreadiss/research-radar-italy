import { cookies } from "next/headers";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { AccountLinks } from "@/app/components/AccountLinks";
import { LogoutButton } from "@/app/components/LogoutButton";

export function AccountNav() {
  const name = cookies().get("rr_account_name")?.value;

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
      <AccountLinks />
    </nav>
  );
}
