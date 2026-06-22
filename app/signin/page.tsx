

import Login from "@/components/login";
import { Metadata } from "next";
  export const metadata: Metadata = {
  title: "Sign In",
};

export default function Signin(){

    return(
        <>
         <Login />
        </>
    )
}