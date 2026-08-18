import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { SaasPageShell, SaasSection } from "@/components/saas-shell";
import { Button } from "@/components/ui/button";

export default function HomeRoutePage() {
  return (
    <SaasPageShell
      badge="Product Hub"
      title="Workspace Home"
      subtitle="Use this area as your team launchpad for daily operations and product decisions."
      navItems={[
        { label: "Main Landing", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/analytics" },
        { label: "Settings", href: "/settings" },
      ]}
      actions={
        <Button asChild className="rounded-full">
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SaasSection title="Quick Launch" description="Jump into high-priority workflows.">
          <div className="space-y-3">
            {[
              { title: "Review growth analytics", href: "/analytics" },
              { title: "Update profile and account security", href: "/settings" },
              { title: "Inspect latest sign-in logs", href: "/admin/logs" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm transition hover:border-primary/40"
              >
                <span>{item.title}</span>
                <ArrowUpRight className="size-4 text-primary" />
              </Link>
            ))}
          </div>
        </SaasSection>

        <SaasSection title="This Week Focus" description="Recommended execution priorities for SaaS teams.">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="rounded-xl border border-border/70 bg-background/60 p-3">
              Improve activation by reducing onboarding steps from 7 to 5.
            </p>
            <p className="rounded-xl border border-border/70 bg-background/60 p-3">
              Run retention outreach for accounts with usage down 20% week over week.
            </p>
            <p className="rounded-xl border border-border/70 bg-background/60 p-3">
              Collect qualitative input from support tickets and the feedback page.
            </p>
          </div>
        </SaasSection>
      </div>

      <SaasSection title="Operating Principle" description="SaaS excellence is consistent execution, not one-time spikes.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
            <Compass className="mb-2 size-4 text-primary" />
            Align roadmap to measurable customer outcomes.
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
            <Sparkles className="mb-2 size-4 text-primary" />
            Ship in small iterations with clear feedback loops.
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
            <ArrowUpRight className="mb-2 size-4 text-primary" />
            Tie every initiative to conversion, retention, or expansion.
          </div>
        </div>
      </SaasSection>
    </SaasPageShell>
  );
}
