'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, KeyRound, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SaasPageShell, SaasSection } from '@/components/saas-shell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResetRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email.trim().length < 5) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const targetOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${targetOrigin}/auth/callback?next=/auth/update-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success('Reset link sent successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SaasPageShell
      badge="Recovery"
      title="Forgot password"
      subtitle="Request a secure password reset link and continue account recovery."
      navItems={[
        { label: 'Sign in', href: '/signin' },
        { label: 'Sign up', href: '/signup' },
        { label: 'Landing', href: '/' },
      ]}
    >
      <div className="mx-auto w-full max-w-xl">
        <SaasSection title="Reset your credentials" description="We will email a one-time recovery link to your registered address.">
          {!sent ? (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@company.com"
                  className="block w-full rounded-lg border border-border bg-background px-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                <Send className="size-4" />
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-300">
                <KeyRound className="size-4" />
                Recovery link sent
              </div>
              <p className="text-muted-foreground">
                Check your inbox for <span className="font-medium text-foreground">{email}</span> and open the link to set a new password.
              </p>
            </div>
          )}

          <Link href="/signin" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </SaasSection>
      </div>
    </SaasPageShell>
  );
}
