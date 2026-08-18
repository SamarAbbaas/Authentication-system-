
import Signup from "@/components/Signup";
import { Metadata } from "next";
import { SaasPageShell } from "@/components/saas-shell";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <SaasPageShell
      badge="Create Account"
      title="Start your SaaS workspace"
      subtitle="Set up your team account and access professional dashboards, analytics, and secure workflows."
      navItems={[
        { label: "Landing", href: "/" },
        { label: "Sign in", href: "/signin" },
        { label: "Pricing", href: "/Price" },
      ]}
    >
      <Signup />
    </SaasPageShell>
  );
}