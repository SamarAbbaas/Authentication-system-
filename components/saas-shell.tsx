import Link from "next/link";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
};

type StatItem = {
  label: string;
  value: string;
  trend?: string;
};

type ShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  navItems?: NavItem[];
  actions?: ReactNode;
  children: ReactNode;
};

export function SaasPageShell({
  title,
  subtitle,
  badge,
  navItems,
  actions,
  children,
}: ShellProps) {
  return (
    <div className="saas-bg min-h-screen text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="saas-glass sticky top-4 z-30 rounded-2xl border px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              {badge ? <p className="saas-badge">{badge}</p> : null}
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          </div>

          {navItems?.length ? (
            <nav className="mt-4 flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </header>

        {children}
      </div>
    </div>
  );
}

export function SaasStatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="saas-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
          {item.trend ? <p className="mt-1 text-xs text-emerald-400">{item.trend}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function SaasSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="saas-card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}