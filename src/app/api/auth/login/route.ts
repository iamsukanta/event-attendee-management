import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_TOKEN, CREDENTIALS } from '@/lib/auth'

// In-memory rate limiter: max 5 attempts per IP per 15-minute window
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS  = 5
const WINDOW_MS     = 15 * 60 * 1000

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_ATTEMPTS) return true

  entry.count++
  return false
}

function clearAttempts(ip: string) {
  attempts.delete(ip)
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait 15 minutes.' },
      { status: 429 }
    )
  }

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { email, password } = body

  if (
    typeof email    !== 'string' ||
    typeof password !== 'string' ||
    email.trim()    === '' ||
    password        === ''
  ) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  if (email.trim() !== CREDENTIALS.email || password !== CREDENTIALS.password) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  clearAttempts(ip)

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  })
  return res
}
