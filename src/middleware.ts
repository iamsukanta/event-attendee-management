import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE  = 'pb_session'
const SESSION_TOKEN   = 'pb-udjapon-1433-authenticated'

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options':        'DENY',
  'X-XSS-Protection':       '1; mode=block',
  'Referrer-Policy':        'strict-origin-when-cross-origin',
  'Permissions-Policy':     'camera=(), microphone=(), geolocation=()',
}

function withSecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, val] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, val)
  }
  return res
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Let auth API and Next.js internals pass through unconditionally
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const session         = req.cookies.get(SESSION_COOKIE)?.value
  const isAuthenticated = session === SESSION_TOKEN
  const isLoginPage     = pathname === '/login'

  // Logged-in user visiting /login → send to dashboard
  if (isLoginPage && isAuthenticated) {
    return withSecurityHeaders(NextResponse.redirect(new URL('/', req.url)))
  }

  // Unauthenticated user on any protected route → send to /login
  if (!isAuthenticated && !isLoginPage) {
    return withSecurityHeaders(NextResponse.redirect(new URL('/login', req.url)))
  }

  return withSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
