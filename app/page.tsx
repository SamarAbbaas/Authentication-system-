import Link from "next/link";
import { ArrowRight, CircleCheck, Layers3, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { SaasPageShell, SaasSection, SaasStatsGrid } from "@/components/saas-shell";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Pricing", href: "/Price" },
  { label: "Settings", href: "/settings" },
  { label: "Feedback", href: "/Feedback" },
];

const highlights = [
  {
    title: "Pipeline Visibility",
    text: "Track every team initiative from lead to release with clear ownership and live status signals.",
    icon: Workflow,
  },
  {
    title: "Unified Workspace",
    text: "Product, growth, support, and operations share one canonical source of truth.",
    icon: Layers3,
  },
  {
    title: "Built-in Security",
    text: "Role-aware access, audit-ready logs, and reliable authentication powered by Supabase.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <SaasPageShell
      badge="SaaS Command Center"
      title="Operate your product with confident speed"
      subtitle="A professional, modern SaaS workspace for product ops, customer analytics, and secure team collaboration."
      navItems={navItems}
      actions={
        <>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/signup">Get started</Link>
          </Button>
        </>
      }
    >
      <SaasStatsGrid
        items={[
          { label: "Active Teams", value: "248", trend: "+14% month over month" },
          { label: "Automated Workflows", value: "1,920", trend: "312 triggered today" },
          { label: "Issue Resolution SLA", value: "98.6%", trend: "Sustained above target" },
          { label: "Uptime", value: "99.98%", trend: "Last 90 days" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <SaasSection key={item.title} title={item.title}>
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
                  <Icon className="size-4" />
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </SaasSection>
          );
        })}
      </div>

      <SaasSection title="Why teams choose this platform" description="Move from scattered tools to a single execution layer.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            "Live KPI dashboards and fast reporting",
            "Secure account lifecycle with role checks",
            "Flexible feedback collection with rich categorization",
            "Profile and account settings built for self-service",
          ].map((value) => (
            <div key={value} className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm">
              <CircleCheck className="size-4 text-emerald-400" />
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              Open dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/analytics" className="inline-flex items-center gap-2">
              View analytics
              <Sparkles className="size-4" />
            </Link>
          </Button>
        </div>
      </SaasSection>
    </SaasPageShell>
  );
}
