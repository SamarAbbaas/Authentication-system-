import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

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
    if (code) {
      const { error } = await supabaseServer.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("Supabase Session Exchange Error:", error.message);
    } else if (tokenHash && type) {
      const { error } = await supabaseServer.auth.verifyOtp({
        type: type as 'recovery' | 'email' | 'signup' | 'invite' | 'magiclink',
        token_hash: tokenHash,
      });

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("Supabase OTP Verification Error:", error.message);
    }
  } catch (err) {
    console.error("Unexpected Auth Callback Error:", err);
  }

  return NextResponse.redirect(`${origin}/forgot`);
}