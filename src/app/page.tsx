'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  Users, UserCheck, PenLine, Trash2, Loader2,
  CalendarDays, MapPin, Flower2, UsersRound, Euro,
  Baby, LogOut,
} from 'lucide-react'
import EditModal from '@/components/EditModal'
import Pagination from '@/components/Pagination'
import { Attendee, SortField, SortOrder, AttendeeListResponse } from '@/types'

const PAGE_SIZE = 10

const SORT_LABELS: Record<string, string> = {
  attendeeNo:          'No.',
  participantsName:    'Name',
  emailOrPhoneNo:      'Email/Phone',
  code:                'Code',
  amount:              'Amount',
  transactionMode:     'Mode',
  adultParticipants:   'Adults',
  under15Participants: 'Under 15',
  isPresent:           'Present',
}

function PresentSwitch({
  attendeeId,
  isPresent,
  onToggled,
}: {
  attendeeId: number
  isPresent: boolean
  onToggled: (updated: Attendee) => void
}) {
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/api/attendees/${attendeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPresent: !isPresent }),
      })
      if (res.ok) {
        const updated: Attendee = await res.json()
        onToggled(updated)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPresent}
      onClick={toggle}
      disabled={busy}
      title={isPresent ? 'Mark Absent' : 'Mark Present'}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
        isPresent ? 'bg-baisakh-green' : 'bg-gray-300'
      }`}
    >
      {busy
        ? <Loader2 size={10} className="absolute inset-0 m-auto animate-spin text-white" />
        : <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            isPresent ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
      }
    </button>
  )
}

export default function AttendeesPage() {
  const router = useRouter()
  const [data,     setData]     = useState<AttendeeListResponse | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<SortField>('attendeeNo')
  const [order,    setOrder]    = useState<SortOrder>('asc')
  const [page,     setPage]     = useState(1)
  const [editing,  setEditing]  = useState<Attendee | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search, sortBy, order,
        page:     String(page),
        pageSize: String(PAGE_SIZE),
      })
      const res = await fetch(`/api/attendees?${params}`)
      const json: AttendeeListResponse = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [search, sortBy, order, page])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, sortBy, order])

  const handleSort = (field: SortField) => {
    if (sortBy === field) setOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setOrder('asc') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this attendee? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/attendees/${id}`, { method: 'DELETE' })
    setDeleting(null)
    fetchData()
  }

  const handlePresenceToggle = (updated: Attendee) => {
    setData(d => d
      ? { ...d, attendees: d.attendees.map(a => a.id === updated.id ? updated : a) }
      : d
    )
    fetchData()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown size={13} className="opacity-40" />
    return order === 'asc'
      ? <ArrowUp size={13} className="text-baisakh-gold" />
      : <ArrowDown size={13} className="text-baisakh-gold" />
  }

  return (
    <div className="min-h-screen bg-baisakh-cream">
      {/* ─── Festival Header ─────────────────────────────────────── */}
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
                <CalendarDays size={14} />
                <span>April 25, 2025</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-200 text-sm">
                <MapPin size={14} />
                <span>উদযাপন, বার্লিন, জার্মানি</span>
              </div>
              <button
                onClick={handleLogout}
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
          <span className="px-5 py-2.5 text-sm font-semibold text-baisakh-red border-b-2 border-baisakh-red">
            Attendees List
          </span>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-baisakh-red hover:border-b-2 hover:border-baisakh-red transition-all"
          >
            On-Spot Registration
          </Link>
        </div>
      </nav>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats */}
        {data && (
          <div className="space-y-3">
            {/* Row 1 — headcounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Registrations',       value: data.total,                    icon: Users,      color: 'bg-baisakh-red-light text-baisakh-red'    },
                { label: 'Total Present',             value: data.totalPresent,             icon: UserCheck,  color: 'bg-baisakh-green-light text-baisakh-green' },
                { label: 'Total Adult Participants',  value: data.totalAdultParticipants,   icon: UsersRound, color: 'bg-blue-50 text-blue-600'                  },
                { label: 'Total Under 15 Participants', value: data.totalUnder15Participants, icon: Baby,     color: 'bg-amber-50 text-amber-600'                },
              ].map((s, i) => (
                <div key={i} className={`${s.color} rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <s.icon size={20} />
                  <div>
                    <p className="text-xs font-medium opacity-70">{s.label}</p>
                    <p className="text-lg font-bold">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 — amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: 'Total Amount Collected',
                  sub:   'All registrations',
                  value: `€${data.totalAmount.toFixed(2)}`,
                  color: 'bg-baisakh-gold-light text-baisakh-gold',
                },
                {
                  label: 'Present Attendee Amount',
                  sub:   'Paid by present attendees',
                  value: `€${data.totalPresentAmount.toFixed(2)}`,
                  color: 'bg-baisakh-green-light text-baisakh-green',
                },
                {
                  label: 'On-Spot Registrations',
                  sub:   `${data.totalOnSpotParticipants} participants`,
                  value: String(data.totalOnSpotCount),
                  color: 'bg-purple-50 text-purple-600',
                },
                {
                  label: 'On-Spot Amount',
                  sub:   `${data.totalOnSpotCount} registrations`,
                  value: `€${data.totalOnSpotAmount.toFixed(2)}`,
                  color: 'bg-pink-50 text-pink-600',
                },
              ].map((s, i) => (
                <div key={i} className={`${s.color} rounded-xl px-4 py-3 flex items-center gap-3`}>
                  <Euro size={20} className="shrink-0" />
                  <div>
                    <p className="text-xs font-medium opacity-70">{s.label}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs opacity-50 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email/phone, transaction ref or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">Sort by</label>
            <select
              value={sortBy}
              onChange={e => handleSort(e.target.value as SortField)}
              className="input-field w-auto"
            >
              {Object.entries(SORT_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <button
              onClick={() => setOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-baisakh-red-light transition-colors"
              title="Toggle sort order"
            >
              {order === 'asc'
                ? <ArrowUp size={15} className="text-baisakh-red" />
                : <ArrowDown size={15} className="text-baisakh-red" />}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={32} className="animate-spin text-baisakh-red" />
            </div>
          ) : !data?.attendees.length ? (
            <div className="text-center py-20 text-gray-400">
              <Flower2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No attendees found</p>
              <p className="text-sm mt-1">
                {search ? 'Try a different search term.' : 'Register the first attendee.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-baisakh-red text-white">
                    {(
                      [
                        ['attendeeNo',          'No.'],
                        ['code',                'Code'],
                        ['participantsName',    'Participants'],
                        ['emailOrPhoneNo',      'Email/Phone'],
                        ['amount',              'Amount'],
                        ['transactionMode',     'Mode'],
                        ['adultParticipants',   'Adults'],
                        ['under15Participants', 'U-15'],
                        ['isPresent',           'Present'],
                      ] as [SortField, string][]
                    ).map(([field, label]) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-baisakh-red-dark select-none whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          <SortIcon field={field} />
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Reg. Date</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.attendees.map((a, i) => (
                    <tr
                      key={a.id}
                      className={`group transition-colors hover:bg-baisakh-red-light ${
                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } ${a.isOnSpotRegistration ? 'border-l-2 border-purple-300' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-baisakh-red">
                          #{a.attendeeNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono bg-baisakh-gold-light text-baisakh-gold px-2 py-0.5 rounded-md text-xs font-bold tracking-wide whitespace-nowrap">
                          {a.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate" title={a.participantsName}>
                        {a.participantsName}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate" title={a.emailOrPhoneNo}>
                        {a.emailOrPhoneNo}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        {a.amount > 0 ? `€${a.amount.toFixed(2)}` : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {a.transactionMode
                          ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {a.transactionMode}
                            </span>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-gray-700">{a.adultParticipants}</td>
                      <td className="px-4 py-3 text-center font-medium text-gray-700">{a.under15Participants}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <PresentSwitch
                            attendeeId={a.id}
                            isPresent={a.isPresent}
                            onToggled={handlePresenceToggle}
                          />
                          <span className={`text-xs font-medium ${a.isPresent ? 'text-baisakh-green' : 'text-gray-400'}`}>
                            {a.isPresent ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {a.registrationDate || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditing(a)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-baisakh-red hover:bg-baisakh-red-light transition-colors"
                          >
                            <PenLine size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(a.id)}
                            disabled={deleting === a.id}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                          >
                            {deleting === a.id
                              ? <Loader2 size={15} className="animate-spin" />
                              : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="border-t border-gray-100 px-4">
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="flex max-w-7xl mx-auto px-5 justify-between text-center py-6 text-xs text-gray-400">
        শুভ নববর্ষ ১৪৩৩ &nbsp;•&nbsp; উদযাপন, বার্লিন, জার্মানি
        <small>
          Developed by <a href='https://iamsukanta.com' target='_blank'>iamsukanta.com</a>
        </small>
      </footer>

      {/* Edit Modal */}
      {editing && (
        <EditModal
          attendee={editing}
          onClose={() => setEditing(null)}
          onSaved={updated => {
            setEditing(null)
            setData(d => d
              ? { ...d, attendees: d.attendees.map(a => a.id === updated.id ? updated : a) }
              : d
            )
            fetchData()
          }}
        />
      )}
    </div>
  )
}
