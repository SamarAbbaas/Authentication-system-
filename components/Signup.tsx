"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Button } from "@base-ui/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: { preventDefault: () => void; }) {
    e.preventDefault();
    if (email.length < 5 || password.length < 6) {
      return toast.error(
        "Please enter a valid email and a password of at least 6 characters",
      );
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(`Error logging in: ${error.message}`);
      } else {
        toast.success("Logged in successfully!");
        // Optional: Redirect user here using next/navigation useRouter
      }
    } catch (err) {
      toast.error(`An unexpected error occurred. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle> Sign up Page</CardTitle>
          <CardDescription>
            Enter your email and Password below to sign up to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toString())}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value.toString())}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Sign up"}
            </Button>
            <Link
              href="/signin"
              className="text-sm underline-offset-4 hover:underline"
            >
              sign in
            </Link>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
