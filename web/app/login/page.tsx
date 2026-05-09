import { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Accès réservé aux administrateurs.
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
