'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flower2, CalendarDays, MapPin, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (res.ok) {
        router.replace('/')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Login failed.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-baisakh-cream flex flex-col">

      {/* Header */}
      <header className="bg-baisakh-red shadow-lg">
        <div className="h-1.5 alpona-border bg-baisakh-gold" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1 text-baisakh-gold">
              <Flower2 size={28} strokeWidth={1.5} />
              <Flower2 size={36} strokeWidth={1.5} />
              <Flower2 size={28} strokeWidth={1.5} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-white font-bold text-2xl sm:text-3xl tracking-wide">
                পহেলা বৈশাখ ১৪৩৩
              </h1>
              <p className="text-red-200 text-sm mt-0.5 font-medium tracking-widest uppercase">
                Pohela Baisakh Celebration
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1.5 text-red-200 text-sm justify-end">
                <CalendarDays size={14} />
                <span>April 25, 2025</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-200 text-sm justify-end mt-0.5">
                <MapPin size={14} />
                <span>উদযাপন, বার্লিন, জার্মানি</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 alpona-border bg-baisakh-gold opacity-60" />
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Decorative flowers */}
          <div className="flex justify-center gap-2 text-baisakh-gold mb-6">
            <Flower2 size={22} strokeWidth={1.5} />
            <Flower2 size={30} strokeWidth={1.5} />
            <Flower2 size={22} strokeWidth={1.5} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Card header */}
            <div className="bg-baisakh-red-light px-6 py-5 text-center border-b border-gray-100">
              <h2 className="text-baisakh-red font-bold text-xl">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to manage event attendees</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field pl-9"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input-field pl-9"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-sm mt-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                  : <><Flower2 size={16} /> Sign In</>}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            শুভ নববর্ষ ১৪৩৩ &nbsp;•&nbsp; উদযাপন, বার্লিন
          </p>
          <small className="text-center text-[8px] text-gray-400 mt-1 block">
            Developed by <a href='https://iamsukanta.com' target='_blank'>iamsukanta.com</a>
          </small>
        </div>
      </main>
    </div>
  )
}
