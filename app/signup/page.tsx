import Link from "next/link";
import type { Route } from "next";
import { AuthBackdrop } from "@/app/components/AuthBackdrop";
import { AuthForm } from "@/app/components/AuthForm";

export default function SignUpPage({
  searchParams
}: {
  searchParams: { returnTo?: string };
}) {
  const closeHref = safeReturnTo(searchParams.returnTo);

  return (
    <main className="auth-shell">
      <AuthBackdrop returnTo={searchParams.returnTo} />
      <section className="auth-modal" role="dialog" aria-labelledby="signup-title" aria-modal="true">
        <Link className="modal-close" href={closeHref} aria-label="Chiudi sign up">
          ×
        </Link>
        <div>
          <h1 id="signup-title">Sign Up</h1>
          <p>Crea un account per ricevere suggerimenti e salvare opportunita.</p>
        </div>
        <AuthForm mode="signup" />
        <p className="auth-note">
          Il consenso email potra alimentare gli alert automatici sulle nuove opportunita.
        </p>
      </section>
    </main>
  );
}

function safeReturnTo(value: string | undefined) {
  return (value?.startsWith("/") ? value : "/") as Route;
}
