import { cookies } from "next/headers";
import { AccountLinks } from "@/app/components/AccountLinks";
import { LogoutButton } from "@/app/components/LogoutButton";

export function AccountNav() {
  const name = cookies().get("rr_account_name")?.value;

  if (name) {
    return (
      <nav className="account-actions" aria-label="Account">
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
