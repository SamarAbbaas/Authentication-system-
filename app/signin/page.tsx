

import Login from "@/components/login";
import { Metadata } from "next";
import { SaasPageShell } from "@/components/saas-shell";
  export const metadata: Metadata = {
  title: "Sign In",
};

export default function Signin(){

    return(
        // <SaasPageShell
        //   badge="Secure Access"
        //   title="Welcome back"
        //   subtitle="Sign in to continue managing your product operations and customer lifecycle."
        //   navItems={[
        //     { label: "Landing", href: "/" },
        //     { label: "Sign up", href: "/signup" },
        //     // { label: "Pricing", href: "/Price" },
        //   ]}
        // >
         <Login />
        // </SaasPageShell>
    )
}