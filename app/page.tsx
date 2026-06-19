"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

<div className="">
  <Button variant={'link'}> <Link href='/signin'>Signin</Link></Button>
</div>
      
    </main>
  );
}