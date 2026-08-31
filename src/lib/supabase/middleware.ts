import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { TRAILER_MODE } from '@/config/app'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            supabaseResponse.cookies.set(name, value, _options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;
  
  // If we are in trailer mode, redirect all protected routes to root
  if (TRAILER_MODE) {
    const protectedRoutes = ["/journal", "/memories", "/gallery", "/profile", "/ai"];
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtected) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return supabaseResponse;
  }

  // If NOT in trailer mode, require auth for protected routes
  // Root ('/') requires auth when TRAILER_MODE is false (redirects to /login)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth');
  
  if (!user && !isAuthRoute && !pathname.startsWith('/trailer') && pathname !== '/favicon.ico' && !pathname.startsWith('/_next')) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    // If logged in and trying to access login, redirect to home
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
