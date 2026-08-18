import Link from "next/link";
import { CheckCircle2, Crown, Rocket, Shield } from "lucide-react";
import { SaasPageShell, SaasSection } from "@/components/saas-shell";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "per workspace / month",
    icon: Rocket,
    description: "For early-stage teams shipping their first product motions.",
    features: ["Up to 8 team members", "Core dashboard + analytics", "Email support", "Basic automation rules"],
  },
  {
    name: "Growth",
    price: "$89",
    period: "per workspace / month",
    icon: Crown,
    highlighted: true,
    description: "For scaling SaaS teams optimizing conversion and retention.",
    features: ["Up to 40 team members", "Advanced analytics and cohorts", "Priority support", "Role-based permissions"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual contract",
    icon: Shield,
    description: "For regulated organizations with security and compliance needs.",
    features: ["Unlimited members", "Dedicated success manager", "Custom integrations", "Audit-grade controls"],
  },
];

export default function PricingPage() {
  return (
    <SaasPageShell
      badge="Pricing"
      title="Simple pricing that scales with your product"
      subtitle="Choose a plan that matches your stage and upgrade when your pipeline and team grow."
      navItems={[
        { label: "Landing", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/analytics" },
        { label: "Settings", href: "/settings" },
      ]}
      actions={
        <Button asChild className="rounded-full">
          <Link href="/signup">Start free trial</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <SaasSection
              key={plan.name}
              title={plan.name}
              description={plan.description}
            >
              <div className={`rounded-xl border p-4 ${plan.highlighted ? "border-primary/50 bg-primary/10" : "border-border/70 bg-background/60"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <Icon className="size-5 text-primary" />
                  {plan.highlighted ? <span className="saas-badge">Most Popular</span> : null}
                </div>
                <p className="text-3xl font-semibold tracking-tight">{plan.price}</p>
                <p className="text-xs text-muted-foreground">{plan.period}</p>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/50 p-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-emerald-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-4 w-full" variant={plan.highlighted ? "default" : "outline"}>
                Choose {plan.name}
              </Button>
            </SaasSection>
          );
        })}
      </div>

      <SaasSection title="Need a custom rollout?" description="Enterprise migration, procurement, and compliance support are available.">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/Feedback">Contact sales</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/signin">Sign in to manage subscription</Link>
          </Button>
        </div>
      </SaasSection>
    </SaasPageShell>
  );
}
