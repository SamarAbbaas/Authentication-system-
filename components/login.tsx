'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { waitForSession } from "@/lib/auth-utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- INLINE SVG ICONS ---
const ShieldIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const AtSignIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. PASSWORD LOGIN
  async function handleLoginWithPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email.length < 5 || password.length < 6) {
      return toast.error("Please enter a valid email and a password of at least 6 characters");
    }

    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Error logging in: ${error.message}`);
      } else if (data.session) {
        const signedInUser = data.user ?? data.session.user;

        if (signedInUser?.id) {
          const { error: loginLogError } = await supabase.from("user_logins").insert({
            user_id: signedInUser.id,
            email: signedInUser.email ?? email,
            logged_in_at: new Date().toISOString(),
          });

          if (loginLogError) {
            console.error("Failed to insert user login activity:", loginLogError);
          }
        }

        toast.success("Logged in successfully!");
        const session = await waitForSession(supabase);
        if (session) {
          router.push("/dashboard");
        } else {
          toast.error("Session not persisted. Please try again.");
        }
      } else {
        toast.error("Login successful but no session created");
      }
    } catch (err) {
      toast.error(
        `An unexpected error occurred. ${
          err instanceof Error ? err.message : "Please try again later."
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  // 2. FIXED OAUTH LOGIN
  async function handleOAuthLogin(provider: "google") {
    setLoading(true);
    try {
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${targetOrigin}/auth/callback?next=/dashboard`,
          skipBrowserRedirect: false
        },
      });
      
      if (error) {
        console.error("Supabase OAuth Error Details:", error);
        toast.error(`OAuth Error: ${error.message}`);
        setLoading(false);
      }
    } catch (err) {
      console.error("Catch Block OAuth Error:", err);
      toast.error(
        `Unexpected Error: ${err instanceof Error ? err.message : "Please check your network."}`
      );
      setLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden">
      {/* Top Right Corner Glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-72 w-72 sm:h-96 sm:w-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Bottom Left Corner Glow */}
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 h-72 w-72 sm:h-96 sm:w-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-2 sm:p-4">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-500 dark:to-purple-500">
              <ShieldIcon />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Sign in</h2>
            <p className="mt-2 text-muted-foreground">Access your secure account</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button 
              type="button" 
              disabled={loading}
              onClick={() => handleOAuthLogin("google")}
              className="w-full flex items-center justify-center rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <GoogleIcon />
              <span className="ml-3">{loading ? "Connecting..." : "Continue with Google"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginWithPassword} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <AtSignIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="block w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="block w-full rounded-lg border border-border bg-background py-3 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 rounded border-border bg-background text-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Keep me signed in
                </label>
              </div>
              <Link 
                href="/forgot" 
                className="text-sm font-medium text-primary transition-colors hover:opacity-80"
              >
                Forgot password
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Sign in to your account"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to our platform?{" "}
              <Link 
                href="/signup" 
                className="font-medium text-primary transition-colors hover:opacity-80"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}