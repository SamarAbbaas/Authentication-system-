'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

type UserLoginRow = {
  id: string;
  user_id: string;
  email: string | null;
  logged_in_at: string;
};

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<UserLoginRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/signin');
        return;
      }

      if (session.user.app_metadata?.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      const { data, error } = await supabase
        .from('user_logins')
        .select('id, user_id, email, logged_in_at')
        .order('logged_in_at', { ascending: false });

      if (error) {
        toast.error(`Failed to load login logs: ${error.message}`);
        setLogs([]);
      } else {
        setLogs(data ?? []);
      }

      setLoading(false);
    };

    loadLogs();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading admin login logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">User Login Activity</h1>
        <p className="mt-2 text-sm text-muted-foreground">Admin-only view of recorded sign-in events.</p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">User ID</th>
                <th className="px-4 py-3 text-left font-medium">Local Login Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={3}>
                    No login activity found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{log.email ?? 'N/A'}</td>
                    <td className="px-4 py-3 font-mono text-xs sm:text-sm break-all">{log.user_id}</td>
                    <td className="px-4 py-3">{new Date(log.logged_in_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
