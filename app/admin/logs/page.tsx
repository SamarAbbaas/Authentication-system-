'use client';

import { useEffect, useState, useMemo } from 'react';
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
  ChevronRight,
  BookOpen
} from 'lucide-react';

type UserLoginRow = {
  id: string;
  user_id: string;
  email: string | null;
  logged_in_at: string;
};

const QURAN_VERSES = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", urdu: "بیشک مشکل کے ساتھ آسانی ہے۔", surah: "الشرح: 6" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", urdu: "اور وہ تمہارے ساتھ ہے جہاں بھی تم ہو۔", surah: "الحديد: 4" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", urdu: "پس تم مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔", surah: "البقرة: 152" },
  { arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", urdu: "اگر تم شکر ادا کرو گے تو میں تمہیں اور زیادہ دوں گا۔", surah: "إبراهيم: 7" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", urdu: "بیشک اللہ صبر کرنے والوں کے ساتھ ہے۔", surah: "البقرة: 153" },
  { arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ", urdu: "اور اس زندہ پر توکل کرو جسے کبھی موت نہیں آئے گی۔", surah: "الفرقان: 58" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", urdu: "سن لو! اللہ کے ذکر ہی سے دلوں کو اطمینان ملتا ہے۔", surah: "الرعد: 28" },
  { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", urdu: "اور دعا کرو کہ اے میرے رب! میرے علم میں اضافہ فرما۔", surah: "طه: 114" },
  { arabic: "إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ", urdu: "بیشک میرے ساتھ میرا رب ہے، وہ مجھے ضرور راستہ دکھائے گا۔", surah: "الشعراء: 62" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", urdu: "اور جو اللہ سے ڈرے گا، اللہ اس کے لیے نکلنے کا راستہ بنا دے گا۔", surah: "الطلاق: 2" },
  { arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", urdu: "اور جب میں بیمار ہوتا ہوں تو وہی مجھے شفا دیتا ہے۔", surah: "الشعراء: 80" },
  { arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", urdu: "بیشک اللہ کی رحمت نیکی کرنے والوں کے قریب ہے۔", surah: "الأعراف: 56" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", urdu: "اور جو اللہ پر بھروسہ کرے گا، وہ اس کے لیے کافی ہے۔", surah: "الطلاق: 3" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً", urdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی عطا فرما۔", surah: "البقرة: 201" },
  { arabic: "وَقُل جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ", urdu: "اور کہہ دو کہ حق آ گیا اور باطل مٹ گیا۔", surah: "الإسراء: 81" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", urdu: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔", surah: "آل عمران: 173" },
  { arabic: "وَخُلِقَ الْإِنسَانُ ضَعِيفًا", urdu: "اور انسان کمزور پیدا کیا گیا ہے۔", surah: "النساء: 28" },
  { arabic: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", urdu: "بیشک اللہ بخشنے والا، نہایت رحم کرنے والا ہے۔", surah: "البقرة: 173" },
  { arabic: "وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", urdu: "اور احسان کرو، بیشک اللہ احسان کرنے والوں سے محبت کرتا ہے۔", surah: "البقرة: 195" },
  { arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ", urdu: "بیشک نیکیاں برائیوں کو مٹا دیتی ہیں۔", surah: "هود: 114" },
  { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", urdu: "اور صبر اور نماز کے ذریعے مدد چاہو۔", surah: "البقرة: 45" },
  { arabic: "وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ", urdu: "اور اللہ جانتا ہے اور تم نہیں جانتے۔", surah: "البقرة: 216" },
  { arabic: "فَابْتَغُوا عِندَ اللَّهِ الرِّزْقَ", urdu: "پس تم اللہ ہی کے پاس رزق تلاش کرو۔", surah: "العنكبوت: 17" },
  { arabic: "فَسَيَكْفِيكَهُمُ اللَّهُ", urdu: "پس ان کے مقابلے میں اللہ تمہیں کافی ہوگا۔", surah: "البقرة: 137" },
  { arabic: "وَاللَّهُ غَالِبٌ عَلَى أَمْرِهِ", urdu: "اور اللہ اپنے کام پر غالب ہے۔", surah: "يوسف: 21" },
  { arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", urdu: "اے میرے رب! میرا سینہ کھول دے اور میرے کام کو آسان کر دے۔", surah: "طه: 25-26" },
  { arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ", urdu: "بیشک اللہ کے ہاں تم میں سے سب سے زیادہ عزت والا وہ ہے جو سب سے زیادہ متقی ہے۔", surah: "الحجرات: 13" },
  { arabic: "وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ", urdu: "اور تمہارا رزق اور جس کا تم سے وعدہ کیا جاتا ہے، آسمان میں ہے۔", surah: "الذاريات: 22" },
  { arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى", urdu: "اور عنقریب تمہارا رب تمہیں اتنا دے گا کہ تم خوش ہو جاؤ گے۔", surah: "الضحى: 5" },
  { arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ", urdu: "بیشک اللہ عدل اور احسان کا حکم دیتا ہے۔", surah: "النحل: 90" }
];

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<UserLoginRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quran Ticker States
  // Initialize with a shuffled copy to avoid setting state synchronously inside useEffect
  const [shuffledVerses] = useState(() => {
    return [...QURAN_VERSES].sort(() => Math.random() - 0.5);
  });
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Auto-slide timer with a short delay between transitions
  useEffect(() => {
    const intervalMs = 10000; // 5 seconds between items
    const transitionDelayMs = 900; // small delay for smoother transitions if needed

    const timer = setInterval(() => {
      // optional small delay before updating index
      setTimeout(() => {
        setCurrentVerseIndex((prevIndex) => (prevIndex + 1) % shuffledVerses.length);
      }, transitionDelayMs);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [shuffledVerses.length]);

  const fetchLogs = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    
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
      if (isManualRefresh) toast.success('Logs refreshed successfully');
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchLogs();
    }, 1000);
    return () => clearTimeout(t);
  }, [router]);

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
        
        {/* Quran News Ticker Banner */}
        <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-card to-emerald-950/60 p-3.5 shadow-lg">
          <div className="flex items-center gap-3" dir="rtl">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm whitespace-nowrap border border-emerald-500/40 shrink-0">
              <BookOpen className="h-4 w-4" />
              <span>آیاتِ مبارکہ</span>
            </div>
            
            {/* Vertical News Slide Container */}
            <div className="relative h-10 w-full overflow-hidden flex items-center">
              {shuffledVerses.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-x-0 transition-all duration-700 ease-in-out flex flex-wrap items-center gap-3 text-right ${
                    index === currentVerseIndex
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-8 pointer-events-none'
                  }`}
                >
                  <span className="font-bold text-emerald-300 text-lg sm:text-xl font-serif">
                    {item.arabic}
                  </span>
                  <span className="text-emerald-100/90 text-sm sm:text-base font-medium">
                    — {item.urdu}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    [{item.surah}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

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