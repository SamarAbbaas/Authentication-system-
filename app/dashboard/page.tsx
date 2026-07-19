'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Upload, ExternalLink, UserCircle2 } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 bg-slate-50">
      <div className="relative w-full max-w-2xl rounded-3xl border bg-background/85 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6">
          
          {/* Header Section with Profile Layout */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm   uppercase font-bold">Welcome Back</p>
                     {user && <p className="mt-1 text-sm text-muted-foreground">{user.email} To </p>} 
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        
            </div>

            {/* Global Avatar Circle Indicator */}
            <div className="flex flex-col items-center gap-1">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Global Avatar" 
                  className="size-16 rounded-full border-2 border-emerald-500 object-cover shadow-sm ring-4 ring-emerald-50"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed bg-muted text-muted-foreground shadow-sm">
                  <UserCircle2 className="size-8 opacity-40" />
                </div>
              )}
              {/* <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Live View</span> */}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button onClick={() => router.push('/upload')} className="w-full">
              <Upload className="mr-2 size-4" />
              Manage / Update Avatar
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
          
          {/* Main Content Info Status */}
          {/* {imageUrl ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 text-sm text-emerald-800">
              <p className="font-medium mb-1 text-emerald-900">✨ Profile Photo Connected!</p>
              Aapka avatar live hai. Yeh image aapko poori website par standard placeholder ki jagah dikhegi.
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-muted/40 p-5 text-sm text-muted-foreground">
              Aapne abhi tak koi avatar set nahi kiya. Ek acchi si photo upload karne ke liye upar diye gaye button par click karein.
            </div>
          )} */}
          
          {/* URL Metadata Display (Optional Debug View) */}
          {/* {imageUrl && (
            <div className="rounded-xl border bg-card p-3 shadow-inner">
              <span className="block text-xs font-semibold mb-1 text-card-foreground">Raw Public Link:</span>
              <div className="flex items-center justify-between gap-2 bg-muted p-2 rounded border">
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[80%]">
                  {imageUrl}
                </span>
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center text-xs text-blue-500 hover:underline gap-0.5 font-medium shrink-0"
                >
                  View <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )} */}
          
        </div>
      </div>
    </div>
  );
}