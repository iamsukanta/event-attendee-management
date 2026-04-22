'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Flower2, CalendarDays, MapPin,
  CreditCard, Building2, Banknote, HelpCircle,
  CheckCircle2, Loader2, ArrowLeft, Users, LogOut,
} from 'lucide-react'
import { ON_SPOT_TRANSACTION_MODES, OnSpotTransactionMode } from '@/types'

const TRANSACTION_ICONS: Record<OnSpotTransactionMode, React.ReactNode> = {
  'Cash':          <Banknote     size={18} />,
  'PayPal':        <CreditCard   size={18} />,
  'Bank Transfer': <Building2    size={18} />,
  'Other':         <HelpCircle   size={18} />,
}

const TRANSACTION_STYLES: Record<OnSpotTransactionMode, string> = {
  'Cash':          'border-green-300  bg-green-50  text-green-700  ring-green-400',
  'PayPal':        'border-blue-300   bg-blue-50   text-blue-700   ring-blue-400',
  'Bank Transfer': 'border-purple-300 bg-purple-50 text-purple-700 ring-purple-400',
  'Other':         'border-gray-300   bg-gray-50   text-gray-700   ring-gray-400',
}

interface SuccessData {
  participantsName:    string
  attendeeNo:          number
  code:                string
  emailOrPhoneNo:      string
  transactionMode:     string
  amount:              number
  adultParticipants:   number
  under15Participants: number
  isPresent:           boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    participantsName:            '',
    emailOrPhoneNo:              '',
    transactionNoTransfereeName: '',
    adultParticipants:           '1',
    under15Participants:         '0',
    amount:                      '',
    transactionMode:             '' as OnSpotTransactionMode | '',
  })
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState<SuccessData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.participantsName.trim()) { setError('Participants name is required.'); return }
    const adults = parseInt(form.adultParticipants, 10) || 0
    const under15 = parseInt(form.under15Participants, 10) || 0
    if (adults + under15 < 1) { setError('At least 1 participant is required.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantsName:            form.participantsName.trim(),
          emailOrPhoneNo:              form.emailOrPhoneNo.trim(),
          transactionNoTransfereeName: form.transactionNoTransfereeName.trim(),
          adultParticipants:           adults,
          under15Participants:         under15,
          amount:                      parseFloat(form.amount) || 0,
          transactionMode:             form.transactionMode,
          isOnSpotRegistration:        true,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return }
      setSuccess({
        participantsName:    data.participantsName,
        attendeeNo:          data.attendeeNo,
        code:                data.code,
        emailOrPhoneNo:      data.emailOrPhoneNo,
        transactionMode:     data.transactionMode,
        amount:              data.amount,
        adultParticipants:   data.adultParticipants,
        under15Participants: data.under15Participants,
        isPresent:           data.isPresent,
      })
      setForm({
        participantsName:            '',
        emailOrPhoneNo:              '',
        transactionNoTransfereeName: '',
        adultParticipants:           '1',
        under15Participants:         '0',
        amount:                      '',
        transactionMode:             '',
      })
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
                পহেলা বৈশাখ ১৪৩৩
              </h1>
              <p className="text-red-200 text-sm mt-0.5 font-medium tracking-widest uppercase">
                Pohela Baisakh Celebration
              </p>
            </div>
            <div className="text-right hidden sm:flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5 text-red-200 text-sm">
                <CalendarDays size={14} /><span>April 25, 2025</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-200 text-sm">
                <MapPin size={14} /><span>উদযাপন, বার্লিন</span>
              </div>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  router.replace('/login')
                }}
                title="Sign out"
                className="flex items-center gap-1.5 text-red-300 hover:text-white text-xs transition-colors mt-1"
              >
                <LogOut size={13} />
                Sign out
              </button>
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
                <p className="text-green-200 text-sm">Attendee has been registered and marked present.</p>
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
                  <p className="text-2xl font-bold text-baisakh-gold font-mono tracking-widest">{success.code}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-800 text-base">{success.participantsName}</p>
                {success.emailOrPhoneNo && <p className="text-gray-500">{success.emailOrPhoneNo}</p>}
                <div className="grid grid-cols-4 gap-3 pt-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className="font-semibold text-gray-700">€{success.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Adults</p>
                    <p className="font-semibold text-gray-700 flex items-center gap-1">
                      <Users size={13} className="text-gray-400" />{success.adultParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Under 15</p>
                    <p className="font-semibold text-gray-700 flex items-center gap-1">
                      <Users size={13} className="text-gray-400" />{success.under15Participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-baisakh-green-light text-baisakh-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-baisakh-green" />
                      Present
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
              Entry code &amp; attendee number are generated automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            {/* Participants Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Participants Name <span className="text-baisakh-red">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahim / Ayesha / Zara"
                value={form.participantsName}
                onChange={e => setForm(f => ({ ...f, participantsName: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            {/* Email / Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / Phone No.
              </label>
              <input
                type="text"
                placeholder="e.g. rahim@email.com or +49 176 1234567"
                value={form.emailOrPhoneNo}
                onChange={e => setForm(f => ({ ...f, emailOrPhoneNo: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Transaction No / Transferee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Transaction No. / Transferee Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahim Ahmed or PayPal transaction ID"
                value={form.transactionNoTransfereeName}
                onChange={e => setForm(f => ({ ...f, transactionNoTransfereeName: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Participants count + Amount */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adults <span className="text-baisakh-red">*</span>
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min={0}
                  max={30}
                  value={form.adultParticipants}
                  onChange={e => setForm(f => ({ ...f, adultParticipants: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Under 15
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  max={30}
                  value={form.under15Participants}
                  onChange={e => setForm(f => ({ ...f, under15Participants: e.target.value }))}
                  className="input-field"
                />
              </div>
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
            </div>

            {/* Transaction Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Mode
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ON_SPOT_TRANSACTION_MODES.map(mode => {
                  const active = form.transactionMode === mode
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, transactionMode: mode }))}
                      className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all font-medium text-sm ${
                        active
                          ? `${TRANSACTION_STYLES[mode]} ring-2 ring-offset-1 shadow-sm`
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      {TRANSACTION_ICONS[mode]}
                      <span className="text-xs text-center leading-tight">{mode}</span>
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

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-baisakh-red transition-colors flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Attendees List
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        শুভ নববর্ষ ১৪৩৩ &nbsp;•&nbsp; উদযাপন, বার্লিন, জার্মানি
      </footer>
    </div>
  )
}
