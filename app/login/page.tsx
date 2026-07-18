import Link from "next/link";
import { Suspense } from "react";
import { AuthBackdrop } from "@/app/components/AuthBackdrop";
import { AuthForm } from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <AuthBackdrop />
      <section className="auth-modal" role="dialog" aria-labelledby="login-title" aria-modal="true">
        <Link className="modal-close" href="/" aria-label="Chiudi login">
          x
        </Link>
        <div>
          <h1 id="login-title">Login</h1>
          <p>Accedi per ritrovare posizioni, grants e ricerche salvate.</p>
        </div>
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="auth-note">
          Nella versione statica l'accesso salva il profilo su questo browser.
        </p>
      </section>
    </main>
  );
}
