'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Image } from 'lucide-react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};


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
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p className="mb-4">Welcome, {user.email}</p>}
      <Button onClick={handleLogout}>Logout</Button>
      <Image>This is profile picture of the user 
      </Image>

          </div>
  );
}