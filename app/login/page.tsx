import Link from "next/link";
import type { Route } from "next";
import { AuthBackdrop } from "@/app/components/AuthBackdrop";
import { AuthForm } from "@/app/components/AuthForm";

export default function LoginPage({
  searchParams
}: {
  searchParams: { returnTo?: string };
}) {
  const closeHref = safeReturnTo(searchParams.returnTo);

  return (
    <main className="auth-shell">
      <AuthBackdrop returnTo={searchParams.returnTo} />
      <section className="auth-modal" role="dialog" aria-labelledby="login-title" aria-modal="true">
        <Link className="modal-close" href={closeHref} aria-label="Chiudi login">
          ×
        </Link>
        <div>
          <h1 id="login-title">Login</h1>
          <p>Accedi per ritrovare posizioni, grants e ricerche salvate.</p>
        </div>
        <AuthForm mode="login" />
        <p className="auth-note">
          Dopo l'accesso potrai ritrovare ricerche, posizioni e grants salvati.
        </p>
      </section>
    </main>
  );
}

function safeReturnTo(value: string | undefined) {
  return (value?.startsWith("/") ? value : "/") as Route;
}
