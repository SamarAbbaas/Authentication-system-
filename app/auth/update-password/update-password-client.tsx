'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function UpdatePasswordClient() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    async function bootstrapRecoverySession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        if (isMounted) {
          setCheckingSession(false);
        }
        return;
      }

      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        } else if (tokenHash && type === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token_hash: tokenHash,
          });

          if (error) {
            throw error;
          }
        }

        const { data: { session: refreshedSession } } = await supabase.auth.getSession();

        if (!refreshedSession) {
          throw new Error("Recovery session could not be established.");
        }
      } catch {
        toast.error("Session expired or invalid token. Please request reset link again.");
        router.replace("/forgot");
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    }

    void bootstrapRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(`Failed to update password: ${error.message}`);
      } else {
        toast.success("Password changed successfully! Logging you in...");
        router.replace("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm">
      <div className="space-y-8">
        {checkingSession ? (
          <div className="text-center text-sm text-muted-foreground">
            Verifying recovery session...
          </div>
        ) : null}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Set new password</h2>
          <p className="mt-2 text-muted-foreground">Must be at least 6 characters.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <LockIcon />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="block w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <LockIcon />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="block w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating password..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
