'use client';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
import { Button } from "@base-ui/react";
export default function Signup() {
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle> Sign up Page</CardTitle>
        <CardDescription>
          Enter your email and Password below to sign up  to your account
        </CardDescription>
      
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                 
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
       
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Sign up"}
            </Button>
          </CardFooter>
      
    </Card>
    </>
  );
}