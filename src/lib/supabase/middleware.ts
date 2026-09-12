import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')

  if (!url || !anonKey) {
    if (!isAuthRoute && pathname !== '/favicon.ico' && !pathname.startsWith('/_next')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error && data) {
      user = data.user
    }
  } catch {
    user = null
  }

  // Require auth for everything except login, auth, favicon, and nextjs assets
  if (!user && !isAuthRoute && pathname !== '/favicon.ico' && !pathname.startsWith('/_next')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  if (user && pathname === '/login') {
    // If logged in and trying to access login, redirect to home
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
