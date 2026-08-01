'use client';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';



export default function SettingsPage() {
    const router = useRouter();

 const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/signin');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Settings Page</h1>
     
        <Link href="/forgot">
             <Button >Reset your Pasword </Button>
        </Link>
         <Link href="/upload">
             <Button > Change Profile Picture </Button>
        </Link>
        
 <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
     
    </div>
  );
}