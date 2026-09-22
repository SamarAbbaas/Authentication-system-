import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let session: Session | null = null

  try {
    const result = await supabase.auth.getSession()
    session = result.data.session
  } catch (error) {
    console.error('Supabase is unavailable. Check NEXT_PUBLIC_SUPABASE_URL.', error)
  }

  // Protect dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (session.user.app_metadata?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?unauthorized=admin', request.url))
    }
  }

  // Redirect signed-in users away from auth pages
  if (
    (request.nextUrl.pathname === '/signin' || 
     request.nextUrl.pathname === '/signup') &&
    session
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = { 
  matcher: ['/dashboard/:path*', '/admin/:path*', '/signin', '/signup']
} 

