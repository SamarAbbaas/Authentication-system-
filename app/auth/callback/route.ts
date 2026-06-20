import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Agar aapka dashboard lowercase me hai to '/dashboard', 
  // agar folder Capital hai to '/Dashboard' check kar lein
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = await cookies();

  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if handled by middleware redirects
          }
        },
      },
    }
  );

  try {
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success! Redirect to your post-login page
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Supabase Session Exchange Error:", error.message);
  } catch (err) {
    console.error("Unexpected Auth Callback Error:", err);
  }

  // 404 se bachne ke liye safe fallback: direct origin (root page) par send karein
  return NextResponse.redirect(`${origin}/`);
}