'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Flower2, CalendarDays, MapPin,
  CreditCard, Building2, Banknote,
  CheckCircle2, Loader2, ArrowLeft, Users,
} from 'lucide-react'
import { PAYMENT_METHODS, PaymentMethod } from '@/types'

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
  'PayPal':        <CreditCard   size={18} />,
  'Bank Transfer': <Building2    size={18} />,
  'Cash':          <Banknote     size={18} />,
}

const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  'PayPal':        'border-blue-300   bg-blue-50   text-blue-700   ring-blue-400',
  'Bank Transfer': 'border-purple-300 bg-purple-50 text-purple-700 ring-purple-400',
  'Cash':          'border-green-300  bg-green-50  text-green-700  ring-green-400',
}

interface SuccessData {
  name:          string
  attendeeNo:    number
  code:          string
  email:         string
  paymentMethod: string
  amount:        number
  quantity:      number
  isPresent:     boolean
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name:          '',
    email:         '',
    amount:        '',
    quantity:      '1',
    comment:       '',
    paymentMethod: '' as PaymentMethod | '',
  })
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState<SuccessData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim())  { setError('Name is required.');               return }
    if (!form.email.trim()) { setError('Email is required.');              return }
    if (!form.paymentMethod){ setError('Please select a payment method.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          form.name.trim(),
          email:         form.email.trim(),
          amount:        parseFloat(form.amount) || 0,
          quantity:      parseInt(form.quantity) || 1,
          comment:       form.comment.trim() || null,
          isOnspot:      true,
          paymentMethod: form.paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return }
      setSuccess({
        name:          data.name,
        attendeeNo:    data.attendeeNo,
        code:          data.code,
        email:         data.email,
        paymentMethod: data.paymentMethod,
        amount:        data.amount,
        quantity:      data.quantity,
        isPresent:     data.isPresent,
      })
      setForm({ name: '', email: '', amount: '', quantity: '1', comment: '', paymentMethod: '' })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-baisakh-cream">
      {/* ─── Header ──────────────────────────────────────────────── */}
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
                পহেলা বৈশাখ ১৪৩২
              </h1>
              <p className="text-red-200 text-sm mt-0.5 font-medium tracking-widest uppercase">
                Pohela Baisakh Celebration
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1.5 text-red-200 text-sm justify-end">
                <CalendarDays size={14} /><span>April 25, 2025</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-200 text-sm justify-end mt-0.5">
                <MapPin size={14} /><span>Udjapon Community, Berlin</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 alpona-border bg-baisakh-gold opacity-60" />
      </header>

      {/* ─── Navigation Tabs ─────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-baisakh-red hover:border-b-2 hover:border-baisakh-red transition-all"
          >
            Attendees List
          </Link>
          <span className="px-5 py-2.5 text-sm font-semibold text-baisakh-red border-b-2 border-baisakh-red">
            On-Spot Registration
          </span>
        </div>
      </nav>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Success Card */}
        {success && (
          <div className="mb-6 bg-white rounded-2xl shadow-lg border-2 border-baisakh-green overflow-hidden">
            <div className="bg-baisakh-green px-6 py-4 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-white" />
              <div>
                <h3 className="text-white font-bold text-lg">Registration Successful!</h3>
                <p className="text-green-200 text-sm">Attendee has been registered.</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-baisakh-green-light rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">Attendee No.</p>
                  <p className="text-3xl font-bold text-baisakh-green">#{success.attendeeNo}</p>
                </div>
                <div className="bg-baisakh-gold-light rounded-xl p-4 text-center">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">Entry Code</p>
                  <p className="text-3xl font-bold text-baisakh-gold font-mono tracking-widest">{success.code}</p>
                </div>
              </div>

              {/* Attendee details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-800 text-base">{success.name}</p>
                <p className="text-gray-500">{success.email}</p>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className="font-semibold text-gray-700">€{success.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Participants</p>
                    <p className="font-semibold text-gray-700 flex items-center gap-1">
                      <Users size={13} className="text-gray-400" />{success.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Absent
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">Please keep the entry code safe.</p>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSuccess(null)}
                  className="btn-primary flex-1 justify-center"
                >
                  Register Another
                </button>
                <Link href="/" className="btn-secondary flex-1 justify-center">
                  <ArrowLeft size={15} />
                  View All
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-baisakh-red-light">
            <h2 className="text-baisakh-red font-bold text-xl flex items-center gap-2">
              <Flower2 size={20} />
              On-Spot Registration
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in the details below. Entry code &amp; attendee number will be generated automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-baisakh-red">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahim Ahmed"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-baisakh-red">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rahim@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            {/* Amount + Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount (€)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  No. of Participants <span className="text-baisakh-red">*</span>
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min={1}
                  max={20}
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Comment / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Special instructions or notes (optional)…"
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                className="input-field resize-none"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span className="text-baisakh-red">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(method => {
                  const active = form.paymentMethod === method
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, paymentMethod: method }))}
                      className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all font-medium text-sm ${
                        active
                          ? `${PAYMENT_STYLES[method]} ring-2 ring-offset-1 shadow-sm`
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      {PAYMENT_ICONS[method]}
                      <span className="text-xs text-center leading-tight">{method}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Registering…</>
                : <><Flower2 size={18} /> Register Attendee</>}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-baisakh-red transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Attendees List
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        শুভ নববর্ষ ১৪৩২ &nbsp;•&nbsp; Udjapon Community, Berlin
      </footer>
    </div>
  )
}
