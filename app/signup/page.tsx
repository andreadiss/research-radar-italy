import Link from "next/link";
import { Suspense } from "react";
import { AuthBackdrop } from "@/app/components/AuthBackdrop";
import { AuthForm } from "@/app/components/AuthForm";

export default function SignUpPage() {
  return (
    <main className="auth-shell">
      <AuthBackdrop />
      <section className="auth-modal" role="dialog" aria-labelledby="signup-title" aria-modal="true">
        <Link className="modal-close" href="/" aria-label="Chiudi sign up">
          x
        </Link>
        <div>
          <h1 id="signup-title">Sign Up</h1>
          <p>Crea un profilo locale per salvare opportunità su questo browser.</p>
        </div>
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
        <p className="auth-note">
          Account cloud, Google login e notifiche email saranno riattivati con un backend esterno.
        </p>
      </section>
    </main>
  );
}
