
import Signup from "@/components/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Signup Page</h1>
      <Signup />
      {/* <Button><Link href="/login">Go to login page</Link></Button> */}
    </div>
  );
}