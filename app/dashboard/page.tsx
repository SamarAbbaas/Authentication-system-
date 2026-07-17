'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Image, Upload } from 'lucide-react';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT' || !session) {
        router.push('/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden   p-4">
      <div className="absolute inset-0   opacity-40" />
      <div className="relative w-full max-w-2xl rounded-3xl border bg-background/85 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Signed in</p>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            {user && <p className="mt-2 text-muted-foreground">Welcome, {user.email}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button onClick={() => router.push('/upload')} className="w-full">
              <Upload className="mr-2 size-4" />
              Upload avatar
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
          <div className="rounded-2xl border border-dashed bg-muted/40 p-5">
Clik on  upload  avatar to upload a image 
          </div>

          {/* <div className="rounded-2xl border border-dashed bg-muted/40 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
                <Image className="size-5 text-muted-foreground" />
              </div>
              {/* <div>
                {/* <p className="font-medium">Profile picture</p>
                <p className="text-sm text-muted-foreground">
                  Open the upload page to choose a file and replace your avatar in Supabase storage.
                </p> 
              </div> 
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}