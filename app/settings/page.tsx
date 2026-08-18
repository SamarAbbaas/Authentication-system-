'use client';
import { Button } from "@/components/ui/button";
import { Bell, KeyRound, LogOut, Shield, UserCircle2 } from "lucide-react";
import Link from "next/link";
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { SaasPageShell, SaasSection } from "@/components/saas-shell";



export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/signin');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  
  return (
    <SaasPageShell
      badge="Account Control"
      title="Settings"
      subtitle="Manage security, profile assets, notification preferences, and account access from one place."
      navItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/analytics" },
        { label: "Pricing", href: "/Price" },
        { label: "Feedback", href: "/Feedback" },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SaasSection title="Profile & Access" description="Update identity and sign-in related controls.">
          <div className="space-y-3">
            <Link href="/upload" className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 text-sm transition hover:border-primary/40">
              <div className="flex items-center gap-2">
                <UserCircle2 className="size-4 text-primary" />
                <span>Change profile picture</span>
              </div>
              <span className="text-muted-foreground">Open</span>
            </Link>

            <Link href="/forgot" className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 text-sm transition hover:border-primary/40">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                <span>Reset password</span>
              </div>
              <span className="text-muted-foreground">Secure</span>
            </Link>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 p-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <span>Two-factor authentication</span>
              </div>
              <span className="text-emerald-400">Recommended</span>
            </div>
          </div>
        </SaasSection>

        <SaasSection title="Notification Preferences" description="Suggested defaults for professional teams.">
          <div className="space-y-3 text-sm">
            {[
              "Weekly product performance summary",
              "Security and account access alerts",
              "Customer feedback digest every morning",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/60 p-3">
                <Bell className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </SaasSection>
      </div>

      <SaasSection title="Session" description="Sign out safely from this device.">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </SaasSection>
    </SaasPageShell>
  );
}