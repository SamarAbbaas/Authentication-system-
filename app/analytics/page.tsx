import { AreaChart, Clock3, Gauge, LineChart, PieChart, Users2 } from "lucide-react";
import { SaasPageShell, SaasSection, SaasStatsGrid } from "@/components/saas-shell";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/settings" },
  { label: "Pricing", href: "/Price" },
];

const channelMix = [
  { channel: "Organic Search", share: "39%", delta: "+5.2%" },
  { channel: "Product-Led Referrals", share: "24%", delta: "+2.8%" },
  { channel: "Paid Acquisition", share: "21%", delta: "-1.1%" },
  { channel: "Partner Programs", share: "16%", delta: "+0.9%" },
];

const funnel = [
  { stage: "Signups", value: "12,480", convert: "100%" },
  { stage: "Activated", value: "7,143", convert: "57.2%" },
  { stage: "Trial to Paid", value: "2,628", convert: "21.1%" },
  { stage: "Retained (90d)", value: "2,119", convert: "17.0%" },
];

export default function AnalyticsPage() {
  return (
    <SaasPageShell
      badge="Performance Intelligence"
      title="Analytics"
      subtitle="Monitor SaaS growth, activation quality, and retention health in one consolidated view."
      navItems={navItems}
    >
      <SaasStatsGrid
        items={[
          { label: "Monthly Recurring Revenue", value: "$186,240", trend: "+8.4% vs last month" },
          { label: "Net Revenue Retention", value: "112%", trend: "Enterprise plans driving expansion" },
          { label: "Customer Acquisition Cost", value: "$142", trend: "-6.1% after funnel fixes" },
          { label: "Time to Value", value: "11.8 min", trend: "Faster by 2.3 min" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SaasSection title="Engagement Trend" description="Last 30 days product usage quality.">
          <div className="space-y-3">
            {[
              { label: "Daily Active Users", value: "4,291", icon: Users2 },
              { label: "Session Completion", value: "83.9%", icon: Gauge },
              { label: "Median Session Length", value: "14m 22s", icon: Clock3 },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="size-4 text-primary" />
                    <span>{metric.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{metric.value}</span>
                </div>
              );
            })}
          </div>
        </SaasSection>

        <SaasSection title="Acquisition Mix" description="Top inbound channels by qualified pipeline.">
          <div className="space-y-3">
            {channelMix.map((row) => (
              <div key={row.channel} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
                <p className="text-sm">{row.channel}</p>
                <div className="text-right">
                  <p className="text-sm font-semibold">{row.share}</p>
                  <p className="text-xs text-emerald-400">{row.delta}</p>
                </div>
              </div>
            ))}
          </div>
        </SaasSection>

        <SaasSection title="Revenue Quality" description="Signals that influence expansion and churn.">
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-border/60 bg-background/60 p-3">
              <p className="text-muted-foreground">Expansion opportunities</p>
              <p className="mt-1 text-lg font-semibold">$41,900</p>
              <p className="text-xs text-muted-foreground">Across 27 accounts ready for upgrade</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-3">
              <p className="text-muted-foreground">Churn risk pipeline</p>
              <p className="mt-1 text-lg font-semibold">$8,240</p>
              <p className="text-xs text-amber-400">Down 13% after onboarding fixes</p>
            </div>
          </div>
        </SaasSection>
      </div>

      <SaasSection title="Conversion Funnel" description="Where users drop off and where teams should focus next.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {funnel.map((row, index) => (
            <div key={row.stage} className="rounded-xl border border-border/60 bg-background/50 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Stage {index + 1}</p>
              <p className="mt-1 text-sm font-semibold">{row.stage}</p>
              <p className="mt-2 text-xl font-semibold">{row.value}</p>
              <p className="text-xs text-muted-foreground">{row.convert}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-background/50 p-2">
            <LineChart className="mb-1 size-4 text-primary" />
            Weekly cohort stability
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-2">
            <AreaChart className="mb-1 size-4 text-primary" />
            Retention uplift experiments
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-2">
            <PieChart className="mb-1 size-4 text-primary" />
            Channel ROI comparison
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-2">
            <Gauge className="mb-1 size-4 text-primary" />
            Product performance index
          </div>
        </div>
      </SaasSection>
    </SaasPageShell>
  );
}
