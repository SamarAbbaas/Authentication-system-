import { Suspense } from "react";
import UpdatePasswordClient from "./update-password-client";
import { SaasPageShell } from "@/components/saas-shell";

export default function UpdatePasswordPage() {
  return (
    <SaasPageShell
      badge="Credential Update"
      title="Set your new password"
      subtitle="Use a secure password to regain access to your account."
      navItems={[
        { label: "Sign in", href: "/signin" },
        { label: "Forgot password", href: "/forgot" },
      ]}
    >
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card/80 p-6 text-center text-sm text-muted-foreground">
            Loading password reset form...
          </div>
        }
      >
        <UpdatePasswordClient />
      </Suspense>
    </SaasPageShell>
  );
}
