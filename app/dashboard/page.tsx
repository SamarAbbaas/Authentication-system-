'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { 
  Upload, 
  UserCircle2, 
  Home, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut, 
  Menu, 
  X,
  Sparkles,
  SendHorizonal,
  Bot,
  LoaderCircle
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '../themetoggler/page';

// Shadcn UI Dialog Imports
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

// Bucket name hamare upload page ke mutabiq
const BUCKET_NAME = "Samar Abbas";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'DevPortal';
  const agentEnabled = process.env.NEXT_PUBLIC_AGENT_ENABLED === 'true';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [agentReply, setAgentReply] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);
  const unauthorizedToastShown = useRef(false);

  useEffect(() => {
    if (searchParams.get('unauthorized') === 'admin' && !unauthorizedToastShown.current) {
      toast.error('Admin access only. You are not authorized to open this page.');
      unauthorizedToastShown.current = true;
    }
  }, [searchParams]);

  // Storage se avatar fetch karne ka central function
  const fetchUserAvatar = async (userId: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(userId);

      if (error) throw error;

      if (data && data.length > 0) {
        const avatarFile = data.find((f) => f.name.startsWith("avatar"));
        
        if (avatarFile) {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${userId}/${avatarFile.name}`);
          
          // Cache breaking query parameter
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/signin');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleAgentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agentPrompt.trim()) {
      toast.error('Please enter a prompt for the assistant.');
      return;
    }

    setAgentLoading(true);
    setAgentReply('');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: agentPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Assistant request failed');
      }

      setAgentReply(data.reply || 'No response generated.');
      setAgentPrompt('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setAgentReply(message);
      toast.error(message);
    } finally {
      setAgentLoading(false);
    }
  };

  if (loading) {
    return (<>  
       

      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="w-5 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        
        <p className="text-muted-foreground animate-pulse font-medium">Loading dashboard...</p>
      </div>
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* ==================== ATTRACTIVE NAVBAR ==================== */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo / Brand Name */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-700 dark:from-white dark:via-indigo-200 dark:to-gray-400 bg-clip-text text-transparent">
              {appName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-3 py-1.5 shadow-inner">
            <Link 
              href="/Home" 
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:bg-background hover:text-primary text-foreground"
            >
              <Home className="size-4" />
              Home
            </Link>
            <Link 
              href="/analytics" 
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <BarChart3 className="size-4" />
              Analytics
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Settings className="size-4" />
              Settings
            </Link>
            <Link 
              href="/admin/logs" 
              className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Shield className="size-4" />
              Admin Logs
            </Link>
          </nav>

          {/* Right Controls (Theme, Avatar & Logout) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {/* Profile Picture Avatar & Modal Dialog */}
            {imageUrl ? (
              <Dialog>
                <DialogTrigger className="relative group focus:outline-none">
                  <div className="size-10 rounded-full border-2 border-indigo-500/80 p-[1px] shadow-sm transition-transform group-hover:scale-105 dark:border-indigo-400">
                    <img 
                      src={imageUrl} 
                      alt="User Avatar" 
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
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
              <Link href="/upload">
                <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted">
                  <UserCircle2 className="size-6" />
                </div>
              </Link>
            )}

            {/* Functional Logout Button */}
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

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted focus:outline-none"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-background/95 p-4 backdrop-blur-lg md:hidden space-y-3">
            {/* User Profile Summary in Mobile Menu */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              {imageUrl ? (
                <img src={imageUrl} alt="Avatar" className="size-10 rounded-full object-cover border border-indigo-500" />
              ) : (
                <UserCircle2 className="size-10 text-muted-foreground" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate max-w-[200px]">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Logged In</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <Link 
                href="/Home" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Home className="size-4 text-indigo-500" />
                Home
              </Link>
              <Link 
                href="/analytics" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <BarChart3 className="size-4 text-indigo-500" />
                Analytics
              </Link>
              <Link 
                href="/settings" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Settings className="size-4 text-indigo-500" />
                Settings
              </Link>
              <Link 
                href="/upload" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Upload className="size-4 text-indigo-500" />
                Manage Profile Picture
              </Link>
              <Link 
                href="/admin/logs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Shield className="size-4 text-indigo-500" />
                Admin Logs
              </Link>
            </nav>

            <Button 
              variant="destructive" 
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* ==================== MAIN DASHBOARD CONTENT ==================== */}
      <main className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-md sm:p-10 space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                User Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dashboard</h1>
              {user && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome back, <strong className="text-foreground">{user.email}</strong>
                </p>
              )}
            </div>

            {/* Profile Avatar Card in Dashboard */}
            <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-2xl border border-border/40">
              {imageUrl ? (
                <Dialog>
                  <DialogTrigger className="size-16 rounded-full border-2 border-indigo-500 overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity focus:outline-none">
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
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Profile Status</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {imageUrl ? "Custom Avatar Active" : "Default Avatar"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button 
              onClick={() => router.push('/upload')} 
              className="w-full py-6 text-base font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-indigo-500/10"
            >
              <Upload className="mr-2 size-5" />
              Manage / Update Profile Picture
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="w-full py-6 text-base font-semibold text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="mr-2 size-5" />
              Logout Account
            </Button>
          </div>

          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 p-5 shadow-inner sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-300">
                <Bot className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  {agentEnabled
                    ? 'Ask for help, ideas, or quick coding support from your dashboard.'
                    : 'Assistant is currently disabled. Enable it from your environment variables.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAgentSubmit} className="space-y-3">
              <Input
                value={agentPrompt}
                onChange={(event) => setAgentPrompt(event.target.value)}
                placeholder="Ask your assistant anything..."
                className="h-12 rounded-2xl border-border/70 bg-background/80 px-4 text-sm shadow-sm"
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={agentLoading}>
                {agentLoading ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 size-4" />
                    Send
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground shadow-sm">
              {agentLoading ? (
                <div className="flex items-center gap-2 text-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  Generating a helpful response...
                </div>
              ) : agentReply ? (
                <div className="leading-7 text-foreground">
                  <p className="mb-2 font-medium text-indigo-600 dark:text-indigo-400">Assistant reply</p>
                  <p className="whitespace-pre-line">{agentReply}</p>
                </div>
              ) : (
                <p>Try a prompt like: “Help me summarize my project goals” or “Suggest a clean UI improvement for this dashboard”.</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}