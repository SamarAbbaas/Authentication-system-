'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Activity, 
  Calendar,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      setRefreshing(false);
      router.replace('/signin');
      return;
    }

    if (session.user.app_metadata?.role !== 'admin') {
      setLoading(false);
      setRefreshing(false);
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
      if (isManualRefresh) {
        toast.success('Logs refreshed successfully');
      }
    }

    setLoading(false);
    setRefreshing(false);
  }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchLogs]);

  // Handle Search Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const emailMatch = log.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = log.user_id.toLowerCase().includes(searchQuery.toLowerCase());
      return emailMatch || idMatch;
    });
  }, [logs, searchQuery]);

  // Handle Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  // Analytics Stats
  const totalLogins = logs.length;
  const uniqueUsers = new Set(logs.map((l) => l.user_id)).size;
  const todayLogins = logs.filter((l) => {
    const logDate = new Date(l.logged_in_at).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('User ID copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading security logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Audit & Login Logs</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor real-time user authentication events and login history.
            </p>
          </div>

          <button
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border border-border rounded-lg bg-card hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Sign-ins
              </span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{totalLogins}</div>
            <p className="mt-1 text-xs text-muted-foreground">Recorded across system</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Unique Active Users
              </span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{uniqueUsers}</div>
            <p className="mt-1 text-xs text-muted-foreground">Distinct accounts logged in</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Logins Today
              </span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{todayLogins}</div>
            <p className="mt-1 text-xs text-muted-foreground">Activity within 24 hours</p>
          </div>
        </div>

        {/* Table Filter Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by email or User ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Logs Table */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-3.5">User Email</th>
                    <th className="px-6 py-3.5">User Identifier (UUID)</th>
                    <th className="px-6 py-3.5">Login Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                        No authentication logs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          {log.email ? (
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                              <span>{log.email}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Anonymous / System</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-muted/60 px-2 py-1 rounded text-muted-foreground">
                              {log.user_id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(log.user_id, log.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1"
                              title="Copy User ID"
                            >
                              {copiedId === log.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs sm:text-sm">
                          {new Date(log.logged_in_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'medium',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}