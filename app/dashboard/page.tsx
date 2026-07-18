'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Upload, ExternalLink, ImageIcon } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Naya state image URL ko store karne ke liye
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const handlegetURl = () => {
    try {
      if (!user?.email) {
        toast.error("User email not found");
        return;
      }

      const { data } = supabase.storage
        .from('image2')
        .getPublicUrl(`${user.email}/image.jpg`);

      if (data?.publicUrl) {
        // State mein URL set kar rahe hain taaky screen par dikhe
        setImageUrl(data.publicUrl);
        toast.success('Image loaded successfully!');
      } else {
        toast.error('Could not generate public URL');
      }
    } catch (error) {
      toast.error(`There is an error: ${error}`);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 opacity-40" />
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
          
          <div className="rounded-2xl border border-dashed bg-muted/40 p-5 text-sm text-muted-foreground">
            Click on upload avatar to upload an image.
          </div>
          
          {/* URL Fetch karne ka button */}
          <Button variant="secondary" onClick={handlegetURl} className="w-full">
            <ImageIcon className="mr-2 size-4" />
            Fetch & Show Image
          </Button>

          {/* ---- Image Card Section ---- */}
          {imageUrl && (
            <div className="mt-2 rounded-2xl border bg-card p-4 shadow-sm transition-all animate-in fade-in-50 duration-300">
              <p className="text-sm font-medium mb-3 text-card-foreground">Fetched Avatar:</p>
              
              {/* Image Preview Area */}
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted border mb-4">
                <img 
                  src={imageUrl} 
                  alt="Avatar Preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Agar image bucket me na ho ya path galat ho toh fallback error dikhaye
                    e.currentTarget.style.display = 'none';
                    toast.error("Image load nahi ho saki. Check karein kya file correctly uploaded hai?");
                  }}
                />
              </div>

              {/* Public URL Link */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-mono truncate bg-muted p-2 rounded-md border">
                  {imageUrl}
                </span>
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center text-xs text-blue-500 hover:text-blue-600 font-medium self-start mt-1 gap-1"
                >
                  Open in new tab <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          )}
          {/* ---------------------------- */}
          
        </div>
      </div>
    </div>
  );
}