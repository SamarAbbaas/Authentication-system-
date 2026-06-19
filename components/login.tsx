"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
// import {Signup} from "@/components/Signup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleLoginWithPassword(e: { preventDefault: () => void; }) {

    e.preventDefault();
    
    if (email.length < 5 || password.length < 6) {
      return toast.error("Please enter a valid email and a password of at least 6 characters");
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Error logging in: ${error.message}`);
      } else {
        toast.success("Logged in successfully!");
        // Redirect to dashboard
        router.push("/dashboard");
        
      }
    } catch (err) {
      toast.error(`An unexpected error occurred. ${err instanceof Error ? err.message : "Please try again later."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <div className="mt-2">
   {/* < CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction> */}
        <Link href="/signup" className="text-sm underline-offset-4 hover:underline"
        >Sign up
        </Link>
          
          </div>
        </CardHeader>
        
        {/* Wrapped inputs inside the form and attached onSubmit */}
        <form onSubmit={handleLoginWithPassword}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}

            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}