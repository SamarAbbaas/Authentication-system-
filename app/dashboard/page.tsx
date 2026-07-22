'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Upload, UserCircle2 } from 'lucide-react';
import ThemeToggle from '../themetoggler/page';

// Shadcn UI Dialog Imports
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

// Bucket name hamare upload page ke mutabiq hona chahiye
const BUCKET_NAME = "Samar Abbas";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Storage se avatar fetch karne ka central function
  const fetchUserAvatar = async (userId: string) => {
    try {
      // Pehle list check karenge taake sahi filename aur extension (png, jpg, jpeg) mil sake
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(userId);

      if (error) throw error;

      if (data && data.length > 0) {
        // UploadPage ki logic ke mutabiq file name 'avatar' se start hota hai
        const avatarFile = data.find((f) => f.name.startsWith("avatar"));
        
        if (avatarFile) {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${userId}/${avatarFile.name}`);
          
          // ?t= lagaya hai taake agar user profile update karke wapas aaye to fresh image dikhe (Cache breaking)
          setImageUrl(`${urlData.publicUrl}?t=${Date.now()}`);
        } else {
          setImageUrl(null);
        }
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error("Error loading profile picture:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
      } else {
        setUser(session.user);
        // User milte hi image automatically fetch ho jayegi
        await fetchUserAvatar(session.user.id);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        await fetchUserAvatar(session.user.id);
      } else if (event === 'SIGNED_OUT' || !session) {
        router.push('/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
        <div className="absolute top-[50vh] right-[50vw] h-screen w-screen bg-sidebar-primary opacity-10 rounded-2xl blur-3xl"></div>
      <div className="absolute bottom-[50vh] left-[50vw] h-screen w-screen bg-sidebar-primary opacity-10 rounded-2xl blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.14),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_35%)]" />
      <div className="relative w-full max-w-2xl rounded-3xl border bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6">
          
          {/* Header Section with Profile Layout */}
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div>
              <p className="text-sm uppercase font-bold">Welcome Back</p>
              {user && <p className="mt-1 text-sm text-muted-foreground">{user.email} To </p>} 
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex flex-col items-center gap-1">
                {imageUrl ? (
                  <Dialog>
                    <DialogTrigger className="size-16 rounded-full border-2 border-emerald-500 overflow-hidden shadow-sm ring-4 ring-emerald-50 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none dark:ring-emerald-950">
                      <img 
                        src={imageUrl} 
                        alt="Global Avatar" 
                        className="h-full w-full object-cover"
                      />
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none sm:max-w-lg flex flex-col items-center justify-center">
                      <DialogTitle className="sr-only">Profile Picture View</DialogTitle>
                      
                      <img 
                        src={imageUrl} 
                        alt="Avatar Expanded" 
                        className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border-4 border-white/10"
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed bg-muted text-muted-foreground shadow-sm">
                    <UserCircle2 className="size-8 opacity-40" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button 
              onClick={() => router.push('/upload')} 
              className="w-full transition-transform duration-200 hover:scale-[1.02]"
            >
              <Upload className="mr-2 size-4" />
              Manage / Update Avatar
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}