'use client';

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

// --- INLINE SVG ICONS ---
const KeyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const AtSignIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
  </svg>
);

const ArrowLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  async function handleResetRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email.length < 5) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);

    try {
      // Dynamic origin path setup (jaise login page par hai)
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Yeh URL user ko password update karne wale route par le kar jayega
        redirectTo: `${targetOrigin}/auth/update-password`,
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success("Reset link sent successfully!");
        setIsSubmitted(true);
      }
    } catch (err) {
      toast.error(
        `Unexpected error: ${err instanceof Error ? err.message : "Please try again later."}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
            <KeyIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isSubmitted 
              ? "Check your email inbox for the recovery link." 
              : "No worries, we'll send you reset instructions."}
          </p>
        </div>

        {!isSubmitted ? (
          /* Reset Form */
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transform transition-all duration-200 hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Sending link..." : "Reset password"}
            </button>
          </form>
        ) : (
          /* Success State View */
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We have sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>. 
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Try another email address
            </button>
          </div>
        )}

        {/* Footer Link to return to login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeftIcon />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}