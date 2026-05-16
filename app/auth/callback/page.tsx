import { Suspense } from "react";
import { OAuthCallback } from "@/app/components/OAuthCallback";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthFallback />}>
      <OAuthCallback />
    </Suspense>
  );
}

function OAuthFallback() {
  return (
    <main className="shell auth-callback-shell">
      <section className="auth-modal">
        <h1>Login Google</h1>
        <p>Accesso Google in corso...</p>
      </section>
    </main>
  );
}
